## JDK 동적 프록시 - 적용1

JDK 동적 프록시는 인터페이스가 필수 이기 때문에 V1 애플리케이션에 적용

**LogTraceBasicHandler**
```java
package hello.proxy.config.v2_dynamicProxy.handler;

import hello.proxy.trace.TraceStatus;
import hello.proxy.trace.logtrace.LogTrace;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class LogTraceBasicHandler implements InvocationHandler {
    private final LogTrace logTrace;
    private final Object target;

    public LogTraceBasicHandler(Object target, LogTrace logTrace) {
        this.logTrace = logTrace;
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        TraceStatus status = null;
        try {
            String message = method.getDeclaringClass().getSimpleName() + "." + method.getName() + "()";
            status = logTrace.begin(message);
            // 실제 로직 호출
            Object result = method.invoke(target, args);
            logTrace.end(status);
            return result;
        }catch (Exception e){
            logTrace.exception(status, e);
            throw e;
        }
    }
}
```
- String message = method.getDeclaringClass().getSimpleName() + "." ...`
  - `LogTrace` 에 사용할 메시지이다. 프록시를 직접 개발할 때는 `"OrderController.request()"` 와 같이 프록시마다 호출되는 클래스와 메서드 이름을 직접 남겼다.
  -  이제는 `Method` 를 통해서 호출되는 메서 드 정보와 클래스 정보를 동적으로 확인할 수 있기 때문에 이 정보를 사용하면 된다.

**DynamicProxyBasicConfig**
```
package hello.proxy.config.v2_dynamicProxy;

import hello.proxy.app.v1.*;
import hello.proxy.config.v2_dynamicProxy.handler.LogTraceBasicHandler;
import hello.proxy.trace.logtrace.LogTrace;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Proxy;

@Configuration
public class DynamicProxyBasicConfig {
    @Bean
    public OrderControllerV1 orderControllerV1(LogTrace logTrace){
        OrderControllerV1 orderController = new OrderControllerV1Impl(orderServiceV1(logTrace));
        return (OrderControllerV1) Proxy.newProxyInstance(OrderControllerV1.class.getClassLoader(),
                new Class[]{OrderControllerV1.class},
                new LogTraceBasicHandler(orderController, logTrace));
    }

    @Bean
    public OrderServiceV1 orderServiceV1(LogTrace logTrace){
        OrderServiceV1 orderService = new OrderServiceV1Impl(orderRepositoryV1(logTrace));
        return (OrderServiceV1) Proxy.newProxyInstance(OrderServiceV1.class.getClassLoader(),
                new Class[]{OrderServiceV1.class},
                new LogTraceBasicHandler(orderService, logTrace));
    }

    @Bean
    public OrderRepositoryV1 orderRepositoryV1(LogTrace logTrace){
        OrderRepositoryV1 orderRepository = new OrderRepositoryV1Impl();
        return (OrderRepositoryV1) Proxy.newProxyInstance(OrderRepositoryV1.class.getClassLoader(),
                new Class[]{OrderRepositoryV1.class},
                new LogTraceBasicHandler(orderRepository, logTrace));
    }
}
```
- 이전에는 프록시 클래스를 직접 개발했지만, 이제는 JDK 동적 프록시 기술을 사용해서 각각의 `Controller` , `Service` , `Repository` 에 맞는 동적 프록시를 생성해주면 된다.
- `LogTraceBasicHandler` : 동적 프록시를 만들더라도 `LogTrace` 를 출력하는 로직은 모두 같기 때문에 프록시는 모두 `LogTraceBasicHandler` 를 사용한다.

![image](https://github.com/user-attachments/assets/8137e0ad-28a8-48ac-8672-15d8cfa9395f)


