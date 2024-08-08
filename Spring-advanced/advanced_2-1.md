## 필드 동기화 - 개발
이전에 로그 추적기를 만들면서 로그를 출력할 때 트랜잭션 ID와 level을 동기화 하는 문제가 있었다. 이 문제를 해결하기 위해 TraceId를 파라미터로 넘겨 해결했다.

하지만 이러한 방식을 모든 메서드에 적용하기에는 코드가 복잡해 보이고 귀찮다. 이번에는 TraceId를 넘기지 않고 동기화 문제를 해결해 보자

**LogTrace 인터페이스**
```java
package hello.advanced.app.trace.logtrace;

import hello.advanced.app.trace.TraceStatus;

public interface LogTrace {
    //  begin
    TraceStatus begin(String message);
    // end
    void end(TraceStatus status);
    // exception
    void exception(TraceStatus status, Exception e);
}
```

**FieldLogTrace**
```java
package hello.advanced.app.trace.logtrace;

import hello.advanced.app.trace.TraceId;
import hello.advanced.app.trace.TraceStatus;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FieldLogTrace implements LogTrace{
    private static final String START_PREFIX = "-->";
    private static final String COMPLETE_PREFIX = "<--";
    private static final String EX_PREFIX = "<X-";

    // 동시성 이슈 발생
    private TraceId traceIdHolder;

    @Override
    public TraceStatus begin(String message) {
        syncTraceId();
        TraceId traceId = traceIdHolder;
        Long startTimeMs = System.currentTimeMillis();
        log.info("[{}] {}{}", traceId.getId(), addSpace(START_PREFIX, traceId.getLevel()), message);
        return new TraceStatus(traceId, startTimeMs, message);
    }

    private void syncTraceId(){
        if(traceIdHolder == null){
            traceIdHolder = new TraceId();
        }else {
            traceIdHolder = traceIdHolder.createNextId();
        }
    }

    @Override
    public void end(TraceStatus status) {
        complete(status, null);
    }

    @Override
    public void exception(TraceStatus status, Exception e) {
        complete(status, e);
    }

    private void complete(TraceStatus status, Exception e) {
        Long stopTimeMs = System.currentTimeMillis();
        long resultTimeMs = stopTimeMs - status.getStartTimeMs();
        TraceId traceId = status.getTraceId();
        if (e == null) {
            log.info("[{}] {}{} time={}ms", traceId.getId(),
                    addSpace(COMPLETE_PREFIX, traceId.getLevel()), status.getMessage(),
                    resultTimeMs);
        } else {
            log.info("[{}] {}{} time={}ms ex={}", traceId.getId(),
                    addSpace(EX_PREFIX, traceId.getLevel()), status.getMessage(), resultTimeMs,
                    e.toString());
        }
        releaseTraceId();
    }

    private void releaseTraceId() {
        if (traceIdHolder.isFirstLevel()){
            traceIdHolder = null;
        }else {
            traceIdHolder = traceIdHolder.createPreviousId();
        }
    }

    private static String addSpace(String prefix, int level) {
	...
    }
}
```
- 전체적인 구조는 HelloTraceV2 와 비슷하다
- `private TraceId traceIdHolder`를 사용해 계속 저장해 두고 사용한다
	- 동기화, 동시성의 문제가 발생한다


**FieldLogTraceTest**
```java
package hello.advanced.app.trace.logtrace;

import hello.advanced.app.trace.TraceStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FieldLogTraceTest {
    FieldLogTrace trace = new FieldLogTrace();

    @Test
    void begin_end_level2(){
        TraceStatus status1 = trace.begin("hello1");
        TraceStatus status2 = trace.begin("hello2");
        trace.end(status2);
        trace.end(status1);
    }

    @Test
    void begin_exception(){
        TraceStatus status1 = trace.begin("hello1");
        TraceStatus status2 = trace.begin("hello2");
        trace.exception(status2, new IllegalStateException());
        trace.exception(status1, new IllegalStateException());
    }
}
```


**실행결과**
```
-- [b95febba] hello1
-- [b95febba] |-->hello2
-- [b95febba] |<--hello2 time=0ms
-- [b95febba] hello1 time=0ms
```

## 필드 동기화 - 적용
 `FieldLogTrace` 를 애플리케이션에 적용해보자

**LogTraceConfig**
```java
package hello.advanced;

import hello.advanced.app.trace.logtrace.FieldLogTrace;
import hello.advanced.app.trace.logtrace.LogTrace;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LogTraceConfig {
    @Bean
    public LogTrace logTrace(){
        return new FieldLogTrace();
    }
}
```
- @Configuration 을 사용해 스프링 빈으로 등록


**OrderControllerV3**
```java
package hello.advanced.app.v3;
 import hello.advanced.trace.TraceStatus;
 import hello.advanced.trace.logtrace.LogTrace;
 import lombok.RequiredArgsConstructor;
 import org.springframework.web.bind.annotation.GetMapping;
 import org.springframework.web.bind.annotation.RestController;
 @RestController
 @RequiredArgsConstructor
 public class OrderControllerV3 {
     private final OrderServiceV3 orderService;
     private final LogTrace trace;
     @GetMapping("/v3/request")
     public String request(String itemId) {
         TraceStatus status = null;
         try {
             status = trace.begin("OrderController.request()");
             orderService.orderItem(itemId);
             trace.end(status);
             return "ok";
} catch (Exception e) { trace.exception(status, e);
throw e; //예외를 꼭 다시 던져주어야 한다.
} }
```
- 의존성 주입을 받아 `FieldLogTrace`를 사용한다.
- `TraceId traceId` 파라미터를 모두 제거
- `beginSync()` `begin` 으로 사용하도록 변경

**OrderServiceV3**
```java
package hello.advanced.app.v3;
 import hello.advanced.trace.TraceId;
 import hello.advanced.trace.TraceStatus;
 import hello.advanced.trace.logtrace.LogTrace;
 import lombok.RequiredArgsConstructor;
 import org.springframework.stereotype.Service;
 @Service
 @RequiredArgsConstructor
 public class OrderServiceV3 {
     private final OrderRepositoryV3 orderRepository;
     private final LogTrace trace;
     public void orderItem(String itemId) {
         TraceStatus status = null;
         try {
             status = trace.begin("OrderService.orderItem()");
             orderRepository.save(itemId);
             trace.end(status);
         } catch (Exception e) {
             trace.exception(status, e);
             throw e;
} }
}
```


**OrderRepositoryV3**
```java
package hello.advanced.app.v3;
 import hello.advanced.trace.TraceId;
 import hello.advanced.trace.TraceStatus;
 import hello.advanced.trace.logtrace.LogTrace;
 import lombok.RequiredArgsConstructor;
 import org.springframework.stereotype.Repository;

 @Repository
 @RequiredArgsConstructor
 public class OrderRepositoryV3 {
     private final LogTrace trace;
     public void save(String itemId) {
         TraceStatus status = null;
         try {
             status = trace.begin("OrderRepository.save()");
//저장 로직
if (itemId.equals("ex")) {
throw new IllegalStateException("예외 발생!"); }
             sleep(1000);
             trace.end(status);
         } catch (Exception e) {
             trace.exception(status, e);
throw e; }
}
     private void sleep(int millis) {
         try {
             Thread.sleep(millis);
         } catch (InterruptedException e) {
             e.printStackTrace();
         }
} }
```


**실행 결과**
```java
[f8477cfc] OrderController.request()
 [f8477cfc] |-->OrderService.orderItem()
 [f8477cfc] |   |-->OrderRepository.save()
 [f8477cfc] |   |<--OrderRepository.save() time=1004ms
 [f8477cfc] |<--OrderService.orderItem() time=1006ms
 [f8477cfc] OrderController.request() time=1007ms
```

- 이상이 없는 코드 같지만 심각한 동시성 문제를 갖고 있다

**동시성 문제 확인**
다음 로직을 1초 안에 2번 실행하면, `트랜잭션 ID` 도 동일하고, `level` 도 뭔가 많이 꼬여서 출력된다.
`FieldLogTrace` 는 싱글톤으로 등록된 스프링 빈이다. 이 객체의 인스턴스가 애플리케이션에 딱 1 존재한다는 뜻이다.
이렇게 하나만 있는 인스턴스의 `FieldLogTrace.traceIdHolder` 필드를 여러 쓰레드가 동시에 접근하기 때문에 문제가 발생한다.

img 1

img 2

img 3



