## 템플릿 콜백 패턴 - 적용
**TraceCallback** - interface
```java
package hello.advanced.app.trace.callback;

public interface TraceCallback<T> {
    T call();
}
```
- 제네릭을 사용해 콜백의 반환 타입을 정의

**TraceTemplate**
```java
package hello.advanced.app.trace.callback;

import hello.advanced.app.trace.TraceStatus;
import hello.advanced.app.trace.logtrace.LogTrace;

public class TraceTemplate {

    private final LogTrace trace;

    public TraceTemplate(LogTrace trace){
        this.trace = trace;
    }

    public <T> T execute(String message, TraceCallback<T> callback){
        TraceStatus status = null;
        try{
            status = trace.begin(message);
            T result = callback.call();
            trace.end(status);
            return result;
        }catch (Exception e){
            trace.exception(status, e);
            throw e;
        }

    }
}
```
- raceTemplate` 는 템플릿 역할
- `public <T> T execute(String message, TraceCallback<T> callback)` 
	- TraceCallback callback` 을 전달
	- 제네릭으로 반환 타입을 정의


**OrderControllerV5**
```java
package hello.advanced.app.v5;

import hello.advanced.app.trace.callback.TraceCallback;
import hello.advanced.app.trace.callback.TraceTemplate;
import hello.advanced.app.trace.logtrace.LogTrace;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderControllerV5 {
    private final OrderServiceV5 orderService;
    private final TraceTemplate template;

    public OrderControllerV5(OrderServiceV5 orderService, LogTrace logTrace) {
        this.orderService = orderService;
        this.template = new TraceTemplate(logTrace);
    }

    @GetMapping("/v5/request")
    public String request(String itemId) {
        return template.execute("OrderController.request()", new TraceCallback<>() {
                    @Override
                    public String call() {
                        orderService.orderItem(itemId);
                        return "ok";
                    }
                });
    }
}
```
- `this.template = new TraceTemplate(trace)` : `trace` 의존관계 주입


**OrderServiceV5**
```java
package hello.advanced.app.v5;

import hello.advanced.app.trace.callback.TraceCallback;
import hello.advanced.app.trace.callback.TraceTemplate;
import hello.advanced.app.trace.logtrace.LogTrace;

import org.springframework.stereotype.Service;

@Service
public class OrderServiceV5 {
    private final OrderRepositoryV5 orderRepository;
    private final TraceTemplate template;

    public OrderServiceV5(OrderRepositoryV5 orderRepository, LogTrace logTrace) {
        this.orderRepository = orderRepository;
        this.template = new TraceTemplate(logTrace);
    }

    public void orderItem(String itemId){
        template.execute("OrderService.orderItem()", ()->{
            orderRepository.save(itemId);
            return null;
        });
//         template.execute("OrderService.orderItem()", new TraceCallback<Object>() {
//            @Override
//            public Object call() {
//                orderRepository.save(itemId);
//                return null;
//            }
//        });

    }
}
```
- template.execute(.., new TraceCallback(){..})` : 템플릿을 실행하면서 콜백을 전달한다. 여기 서는 콜백으로 람다 사용


**OrderRepositoryV5**
```java
package hello.advanced.app.v5;

import hello.advanced.app.trace.callback.TraceCallback;
import hello.advanced.app.trace.callback.TraceTemplate;
import hello.advanced.app.trace.logtrace.LogTrace;
import hello.advanced.app.trace.template.AbstractTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository

public class OrderRepositoryV5 {
    private final TraceTemplate template;

    public OrderRepositoryV5(LogTrace logTrace) {
        this.template = new TraceTemplate(logTrace);
    }

    public void save(String itemId){
        template.execute("OrderRepository.save()", new TraceCallback<Object>() {
            @Override
            public Object call() {
                if(itemId.equals("ex")){
                    throw new IllegalStateException("예외 발생");
                }
                sleep(1000);
                return null;
            }
        });

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

**실행로그**
```text
 [22bc581f] OrderController.request()
 [22bc581f] |-->OrderService.orderItem()
 [22bc581f] |   |-->OrderRepository.save()
 [22bc581f] |   |<--OrderRepository.save() time=1001ms
 [22bc581f] |<--OrderService.orderItem() time=1003ms
 [22bc581f] OrderController.request() time=1004ms
```

## 정리
템플릿 메서드 패턴, 전략 패턴, 그리고 템플릿 콜백 패턴까지 진행하면서 변하는 코드와 변하지 않는 코드를 분리했다.

최종적으로 템플릿 콜백 패턴을 적용하고 콜백으로 람다를 사용해서 코드 사용도 최소화 했다.

**그러나**
- 로그 추적기를 적용하기 위해서 원본 코드를 수정해 야 한다.
- 클래스가 수백개이면 수백개를 수정해야한다..

다음부터 원본 코드를 손대지 않고 로그 추적기를 적용할 수 있는 방법을 알아보겠다.