## 로그 추적기 V2 - 파라미터로 동기화 개발

현재 로그의 상태 정보인 `트랜잭션ID` 와 `level` 은 `TraceId` 에 포함되어 있다. 따라서 `TraceId` 를 다음 로그에 넘 겨주면 된다. 이 기능을 추가한 `HelloTraceV2` 를 개발한다.


**HelloTraceV2**
```java
package hello.advanced.app.trace.helloTraceV1;

import hello.advanced.app.trace.TraceId;
import hello.advanced.app.trace.TraceStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class HelloTraceV2 {
    private static final String START_PREFIX = "-->";
    private static final String COMPLETE_PREFIX = "<--";
    private static final String EX_PREFIX = "<X-";

    public TraceStatus begin(String message){
        TraceId traceId = new TraceId();
        Long startTimeMs = System.currentTimeMillis();
        log.info("[{}] {}{}", traceId.getId(), addSpace(START_PREFIX, traceId.getLevel()), message);
        return new TraceStatus(traceId, startTimeMs, message);
    }
    //V2 에서 추가
    public TraceStatus beginSync(TraceId beforeTraceId, String message){
        TraceId nextId = beforeTraceId.createNextId();
        Long startTimeMs = System.currentTimeMillis();
        log.info("[{}] {}{}", nextId.getId(), addSpace(START_PREFIX, nextId.getLevel()), message);
        return new TraceStatus(nextId, startTimeMs, message);
    }

    public void end(TraceStatus traceStatus){
        complete(traceStatus,null);
    }
    public void exception(TraceStatus traceStatus, Exception e){
        complete(traceStatus, e);
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
    }

    private static String addSpace(String prefix, int level) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < level; i++) {
            sb.append( (i == level - 1) ? "|" + prefix : "|   ");
        }
        return sb.toString();
    }
}
```
- **beginSync(TraceId beforeTraceId, String message)**
	- 기존 `TraceId` 에서 `createNextId()` 를 통해 다음 ID를 구한다.


**OrderControllerV2**
```java
package hello.advanced.app.v2;

import hello.advanced.app.trace.TraceStatus;
import hello.advanced.app.trace.helloTraceV1.HelloTraceV1;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OrderControllerV2 {
    private final OrderServiceV2 orderServiceV1;
    private final HelloTraceV1 trace;

    @GetMapping("/v2/request")
    public String request(String itemId){

        TraceStatus status = null;
        try {
            status = trace.begin("OrderController.request()");
            orderServiceV1.orderItem(status.getTraceId(),itemId);
            trace.end(status);
        }catch (Exception e){
            trace.exception(status, e);
            throw e;
        }

        return "ok  ";
    }
}
```


**OrderServiceV2**
```java
package hello.advanced.app.v2;

import hello.advanced.app.trace.TraceId;
import hello.advanced.app.trace.TraceStatus;
import hello.advanced.app.trace.helloTraceV1.HelloTraceV1;
import hello.advanced.app.trace.helloTraceV1.HelloTraceV2;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceV2 {
    private final OrderRepositoryV2 orderRepositoryV2;
    private final HelloTraceV2 trace;

    public void orderItem(TraceId traceId, String itemId){
        TraceStatus status = null;
        try {
            status = trace.beginSync(traceId,"OrderService.orderItem()");
            orderRepositoryV2.save(status.getTraceId() ,itemId);
            trace.end(status);
        }catch (Exception e){
            trace.exception(status, e);
            throw e;
        }
    }
}
```

**OrderRepositoryV2**
```java
package hello.advanced.app.v2;

import hello.advanced.app.trace.TraceId;
import hello.advanced.app.trace.TraceStatus;
import hello.advanced.app.trace.helloTraceV1.HelloTraceV1;
import hello.advanced.app.trace.helloTraceV1.HelloTraceV2;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryV2 {
    private final HelloTraceV2 trace;

    public void save(TraceId traceId, String itemId){
        TraceStatus status = null;
        try {
            status = trace.beginSync(traceId,"OrderRepository.save()");
            if(itemId.equals("ex")){
                throw new IllegalStateException("예외 발생");
            }
            sleep(1000);
            trace.end(status);
        }catch (Exception e){
            trace.exception(status, e);
            throw e;
        }
    }
    private void sleep(int millis){
        try {
            Thread.sleep(millis);
        }catch (InterruptedException e){
            e.printStackTrace();
        }
    }
}
```
**동작 흐름**
![스크린샷 2024-08-08 오후 12 41 42](https://github.com/user-attachments/assets/46ae39ae-ea60-4b9f-86d0-980afe15628f)


**실행결과**
<img width="427" alt="스크린샷 2024-08-08 오후 12 42 37" src="https://github.com/user-attachments/assets/139cf8ce-4589-4e64-b8d2-8154a6d70cc4">
