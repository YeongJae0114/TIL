## ThreadLocal - 소개
쓰레드 로컬은 해당 쓰레드만 접근할 수 있는 특별한 저장소를 말한다.

쓰레드 로컬을 사용하면 각 쓰레드마다 별도의 내부 저장소를 제공한다. 따라서 같은 인스턴스의 쓰레드 로컬 필드에 접 근해도 문제 없다.

![스크린샷 2024-08-08 오후 4 52 28](https://github.com/user-attachments/assets/d75aa8d4-b4b4-4583-8275-d85744c0c8fe)
`thread-A` 가 `userA` 라는 값을 저장하면 쓰레드 로컬은 `thread-A` 전용 보관소에 데이터를 안전하게 보관한다.

![스크린샷 2024-08-08 오후 4 52 40](https://github.com/user-attachments/assets/8f0b3052-82f9-49e8-8dd4-1f3a634774af)
`thread-B` 가 `userB` 라는 값을 저장하면 쓰레드 로컬은 `thread-B` 전용 보관소에 데이터를 안전하게 보관한다.

![스크린샷 2024-08-08 오후 4 52 48](https://github.com/user-attachments/assets/45777ee4-58a9-4a21-a308-34fec5525d87)
쓰레드 로컬을 통해서 데이터를 조회할 때도 `thread-A` 가 조회하면 쓰레드 로컬은 `thread-A` 전용 보관소에서 `userA` 데이터를 반환해준다


**ThreadLocal - 사용 방법**
```java
package hello.advanced.trace.threadlocal.code;
 import lombok.extern.slf4j.Slf4j;
 @Slf4j
 public class ThreadLocalService {
     private ThreadLocal<String> nameStore = new ThreadLocal<>();
     public String logic(String name) {
	 log.info("저장 name={} -> nameStore={}", name, nameStore.get()); nameStore.set(name);
	 sleep(1000);
	 log.info("조회 nameStore={}",nameStore.get());
         return nameStore.get();
     }
     
	 private void sleep(int millis) {
         try {
             Thread.sleep(millis);
         } catch (InterruptedException e) {
             e.printStackTrace();
         }
	} 
}
```

## 쓰레드 로컬 동기화 - 개발
FieldLogTrace` 에서 발생했던 동시성 문제를 `ThreadLocal` 로 해결해보자.
`TraceId traceIdHolder` 필드를 쓰레드 로컬을 사용하도록 `ThreadLocal<TraceId> traceIdHolder` 로 변경하면 된다.

**ThreadLocalLogTrace**
```java
package hello.advanced.app.trace.logtrace;

import hello.advanced.app.trace.TraceId;
import hello.advanced.app.trace.TraceStatus;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ThreadLocalLogTrace implements LogTrace{
    private static final String START_PREFIX = "-->";
    private static final String COMPLETE_PREFIX = "<--";
    private static final String EX_PREFIX = "<X-";

    // 동시성 이슈 발생
    //private TraceId traceIdHolder;
    private ThreadLocal<TraceId> traceIdHolder = new ThreadLocal<>();

    @Override
    public TraceStatus begin(String message) {
        syncTraceId();
        TraceId traceId = traceIdHolder.get();
        Long startTimeMs = System.currentTimeMillis();
        log.info("[{}] {}{}", traceId.getId(), addSpace(START_PREFIX, traceId.getLevel()), message);
        return new TraceStatus(traceId, startTimeMs, message);
    }

    private void syncTraceId(){
        TraceId traceId = traceIdHolder.get();
        if(traceId == null){
            traceIdHolder.set(new TraceId());
        }else {
            traceIdHolder.set(traceId.createNextId());
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
        TraceId traceId = traceIdHolder.get();
        if (traceId.isFirstLevel()){
            traceIdHolder.remove();
        }else {
            traceIdHolder.set(traceId.createPreviousId());
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
- `traceIdHolder` 가 필드에서 `ThreadLocal` 로 변경되었다. 따라서 값을 저장할 때는 `set(..)` 을 사용하고, 값을 조회할 때는 `get()` 을 사용한다.
- **ThreadLocal.remove()** 로컬에 저장된 값을 제거해주어야 한다.

**LogTraceConfig - 수정**
```java
package hello.advanced;

import hello.advanced.app.trace.logtrace.FieldLogTrace;
import hello.advanced.app.trace.logtrace.LogTrace;
import hello.advanced.app.trace.logtrace.ThreadLocalLogTrace;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LogTraceConfig {
    @Bean
    public LogTrace logTrace(){
        return new ThreadLocalLogTrace();
    }
}
```
- 동시성 문제가 있는 `FieldLogTrace` 대신에 문제를 해결한 `ThreadLocalLogTrace` 를 스프링 빈으로 등록하자.
