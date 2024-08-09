## 템플릿 메서드 패턴 
지금까지의 로그 추적기는 잘 작동 하지만, 코드가 복잡해지면 코드의 반복되는 부분이 증가하고 핵심기능과 부가기능이 섞여있어 유지보수 하기도 힘들다. 이 문제를 템플릿 메서드 패턴을 사용해 해결해 보자

## 템플릿 메서드 패턴 - 도입
**AbstractTemplate**
```java
package hello.advanced.app.trace.template;

import hello.advanced.app.trace.TraceStatus;
import hello.advanced.app.trace.logtrace.LogTrace;

public abstract class AbstractTemplate<T> {
    private final LogTrace trace;

    public AbstractTemplate(LogTrace trace){
        this.trace = trace;
    }

    public T execute(String message){
        TraceStatus status = null;
        try{
            status = trace.begin(message);
            T result = call();
            trace.end(status);
            return result;
        }catch (Exception e){
            trace.exception(status, e);
            throw e;
        }
    }

    protected abstract T call();
}
```
- `AbstractTemplate` 은 템플릿 메서드 패턴에서 부모 클래스이고, 템플릿 역할을 한다.
- `<T>` 제네릭을 사용했다. 반환 타입을 정의한다.
- 객체를 생성할 때 내부에서 사용할 `LogTrace trace` 를 전달 받는다.
- 로그에 출력할 `message` 를 외부에서 파라미터로 전달받는다.
- 템플릿 코드 중간에 `call()` 메서드를 통해서 변하는 부분을 처리한다.
- `abstract T call()` 은 변하는 부분을 처리하는 메서드이다. 이 부분은 상속으로 구현해야 한다.



**OrderControllerV4**
```java
package hello.advanced.app.v4;

import hello.advanced.app.trace.TraceStatus;
import hello.advanced.app.trace.logtrace.LogTrace;
import hello.advanced.app.trace.template.AbstractTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OrderControllerV4 {
    private final OrderServiceV4 orderService;
    private final LogTrace logTrace;

    @GetMapping("/v4/request")
    public String request(String itemId){
        AbstractTemplate<String>template = new AbstractTemplate<String>(logTrace) {
            @Override
            protected String call() {
                orderService.orderItem(itemId);
                return "ok";
            }
        };
        return template.execute("OrderController.request()");
    }
}
```
- `AbstractTemplate<String>` 
	- 제네릭을 String 으로 설정했다. `AbstractTemplate` 의 반환 타입은 `String`
- 익명 내부 클래스 사용
- `template.execute("OrderController.request()")`
	- 템플릿을 실행하면서 로그로 남길 `message` 를 전달



**OrderServiceV4**
```java
package hello.advanced.app.v4;

import hello.advanced.app.trace.TraceStatus;
import hello.advanced.app.trace.logtrace.LogTrace;
import hello.advanced.app.trace.template.AbstractTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceV4 {
    private final OrderRepositoryV4 orderRepository;
    private final LogTrace logTrace;

    public void orderItem(String itemId){
        AbstractTemplate<Void> template = new AbstractTemplate<>(logTrace) {
            @Override
            protected Void call() {
                orderRepository.save(itemId);
                return null;
            }
        };
        template.execute("OrderService.orderItem()");
    }
}

```
- `AbstractTemplate<Void>`
	- 반환할 내용이 없으면 `Void` 타입을 사용 


**OrderRepositoryV4**
```java
package hello.advanced.app.v4;

import hello.advanced.app.trace.TraceStatus;
import hello.advanced.app.trace.logtrace.LogTrace;
import hello.advanced.app.trace.template.AbstractTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryV4 {
    private final LogTrace logTrace;

    public void save(String itemId){

        AbstractTemplate<Void> template = new AbstractTemplate<Void>(logTrace) {
            @Override
            protected Void call() {
                if(itemId.equals("ex")){
                    throw new IllegalStateException("예외 발생");
                }
                sleep(1000);
                return null;
            }
        };
        template.execute("OrderRepository.save()");

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


**결과**
```text
 [fc10ab45] OrderController.request()
 [fc10ab45] |-->OrderService.orderItem()
 [fc10ab45] |   |-->OrderRepository.save()
 [fc10ab45] |   |<--OrderRepository.save() time=1004ms
 [fc10ab45] |<--OrderService.orderItem() time=1006ms
 [fc10ab45] OrderController.request() time=1007ms
```





