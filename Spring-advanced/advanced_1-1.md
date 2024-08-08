## 로그 추적기 V1 - 프로토타입 개발
**TraceId**
```java
package hello.advanced.app.trace;

import java.util.UUID;

public class TraceId {
    private String id;
    private int level;

    public TraceId() {
        this.id = createId();
        this.level = 0;
    }

    private TraceId(String id, int level){
        this.id=id;
        this.level=level;
    }

    private String createId(){
        // 앞 8자리 만 사용
        return UUID.randomUUID().toString().substring(0,8);
    }

    public TraceId createNextId(){
        return new TraceId(id, level+1);
    }

    public TraceId createPreviousId(){
        return new TraceId(id, level+1);
    }
    public boolean isFirstLevel(){
        return level == 0;
    }

    public String getId() {
        return id;
    }

    public int getLevel() {
        return level;
    }
}
```
- **UUID** : UUID로 만든 값을 트랜잭션ID로 사용
- **createNextId()** : 깊이가 증가해도 트랜잭션ID는 같다. 대신에 깊이가 하나 증가
- **createPreviousId()** : `createNextId()` 의 반대 역할을 한다. `id` 는 기존과 같고, `level` 은 하나 감소한다.
- **isFirstLevel()** : 첫 번째 레벨 여부를 편리하게 확인할 수 있는 메서드


**TraceStatus**
```java
package hello.advanced.app.trace;

public class TraceStatus {
    private TraceId traceId;
    // 로그 시작 시간
    private Long startTimeMs;
    // 시작시 사용한 메시지
    private String message;

    public TraceStatus(TraceId traceId, Long startTimeMs, String message) {
        this.traceId = traceId;
        this.startTimeMs = startTimeMs;
        this.message = message;
    }

    public TraceId getTraceId() {
        return traceId;
    }

    public Long getStartTimeMs() {
        return startTimeMs;
    }

    public String getMessage() {
        return message;
    }
}

```
- 로그의 상태 정보를 나타낸다.
- `traceId` : 내부에 트랜잭션ID와 level을 가지고 있다.
- `startTimeMs` : 로그 시작시간이다. 로그 종료시 이 시작 시간을 기준으로 시작~종료까지 전체 수행 시간을 구 할 수 있다.
- `message` : 시작시 사용한 메시지이다. 이후 로그 종료시에도 이 메시지를 사용해서 출력한다.


**HelloTraceV1**
```java
package hello.advanced.app.trace.helloTraceV1;

import hello.advanced.app.trace.TraceId;
import hello.advanced.app.trace.TraceStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class HelloTraceV1 {
    private static final String START_PREFIX = "-->";
    private static final String COMPLETE_PREFIX = "<--";
    private static final String EX_PREFIX = "<X-";

    public TraceStatus begin(String message){
        TraceId traceId = new TraceId();
        Long startTimeMs = System.currentTimeMillis();
        log.info("[{}] {}{}", traceId.getId(), addSpace(START_PREFIX, traceId.getLevel()), message);
        return new TraceStatus(traceId, startTimeMs, message);
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
- `TraceStatus begin(String message)`
	- 로그를 시작
	- 로그 메시지를 파라미터로 받아서 시작 로그를 출력
	- 응답 결과로 현재 로그의 상태인 `TraceStatus` 를 반환

- `void end(TraceStatus status)`
	- 로그를 정상 종료
	- 파라미터로 시작 로그의 상태( `TraceStatus` )를 전달 받는다. 이 값을 활용해서 실행 시간을 계산하고, 종 료시에도 시작할 때와 동일한 로그 메시지를 출력
	- 정상 흐름에서 호출
- `void exception(TraceStatus status, Exception e)`
	- 로그를 예외 상황으로 종료한다.
	- `TraceStatus` , `Exception` 정보를 함께 전달 받아서 실행시간, 예외 정보를 포함한 결과 로그를 출력 한다.
	- 예외가 발생했을 때 호출한다.


**OrderControllerV1**
```java
package hello.advanced.app.v1;

import hello.advanced.app.trace.TraceStatus;
import hello.advanced.app.trace.helloTraceV1.HelloTraceV1;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OrderControllerV1 {
    private final OrderServiceV1 orderServiceV1;
    private final HelloTraceV1 trace;

    @GetMapping("/v1/request")
    public String request(String itemId){

        TraceStatus status = null;
        try {
            status = trace.begin("OrderController.request()");
            orderServiceV1.orderItem(itemId);
            trace.end(status);
        }catch (Exception e){
            trace.exception(status, e);
            throw e;
        }

        return "ok  ";
    }
}
```


**OrderServiceV1**
```java
package hello.advanced.app.v1;

import hello.advanced.app.trace.TraceStatus;
import hello.advanced.app.trace.helloTraceV1.HelloTraceV1;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceV1 {
    private final OrderRepositoryV1 orderRepositoryV1;
    private final HelloTraceV1 trace;

    public void orderItem(String itemId){
        TraceStatus status = null;
        try {
            status = trace.begin("OrderService.orderItem()");
            orderRepositoryV1.save(itemId);
            trace.end(status);
        }catch (Exception e){
            trace.exception(status, e);
            throw e;
        }
    }
}
```

**OrderRepositoryV1**
```java
package hello.advanced.app.v1;

import hello.advanced.app.trace.TraceStatus;
import hello.advanced.app.trace.helloTraceV1.HelloTraceV1;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryV1 {
    private final HelloTraceV1 trace;

    public void save(String itemId){
        TraceStatus status = null;
        try {
            status = trace.begin("OrderRepository.save()");
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
![스크린샷 2024-08-08 오후 12 36 33](https://github.com/user-attachments/assets/95c2bd65-eb1b-4a43-a9ac-60f35c793e4d)


**실행 로그**
<img width="427" alt="스크린샷 2024-08-08 오후 12 42 55" src="https://github.com/user-attachments/assets/d636ff93-0f3b-42de-b1e8-2a39cacc61a7">

