## 인터페이스 기반 프록시 - 적용
인터페이스와 구현체가 있는 V1 App에 지금까지 학습한 프록시를 도입해서 `LogTrace` 를 사용해보자.
**프록시를 사용하면 기존 코드를 전혀 수정하지 않고 로그 추적 기능을 도입할 수 있다.**

![image](https://github.com/user-attachments/assets/3d960fec-f372-486c-9bd7-f9d3ec9913cb)


</br></br>

**여기에 로그 추적용 프록시를 추가하면 다음과 같다.**

</br></br>

**클래스 의존 관계**
![image](https://github.com/user-attachments/assets/8053cd61-91fa-4643-bd79-358aa7be637f)



**런타임 객체 의존 관계**
![image](https://github.com/user-attachments/assets/141f6f06-0c78-43b5-a090-635679d5f6fc)

**OrderRepositoryInterfaceProxy**
```java
package hello.proxy.config.v1_proxy.interface_proxy;

import ...

@RequiredArgsConstructor
public class OrderRepositoryInterfaceProxy implements OrderRepositoryV1 {
    private final OrderRepositoryV1 target;
    private final LogTrace logTrace;

    @Override
    public void save(String itemId) {
        TraceStatus status = null;
        try {
            status = logTrace.begin("OrderRepository.request");
            target.save(itemId);
            logTrace.end(status);
        }catch (Exception e){
            logTrace.exception(status, e);
            throw e;
        }
    }
}
```

**OrderServiceInterfaceProxy**
```java
package hello.proxy.config.v1_proxy.interface_proxy;

import ...

@RequiredArgsConstructor
public class OrderServiceInterfaceProxy implements OrderServiceV1{
    private final OrderServiceV1 target;
    private final LogTrace logTrace;

    @Override
    public void orderItem(String itemId) {
        TraceStatus status = null;
        try {
            status = logTrace.begin("OrderService.orderItem");
            target.orderItem(itemId);
            logTrace.end(status);
        }catch (Exception e){
            logTrace.exception(status, e);
            throw e;
        }
    }
}
```

**OrderControllerInterfaceProxy**
```java
package hello.proxy.config.v1_proxy.interface_proxy;

import ...

@RequiredArgsConstructor
public class OrderControllerInterfaceProxy implements OrderControllerV1{
    private final OrderControllerV1 target;
    private final LogTrace logTrace;

    @Override
    public String request(String itemId) {
        TraceStatus status = null;
        try {
            status = logTrace.begin("OrderController.request");
            String request = target.request(itemId);
            logTrace.end(status);
            return request;
        }catch (Exception e){
            logTrace.exception(status, e);
            throw e;
        }
    }

    @Override
    public String noLog() {
        return target.noLog();
    }
}
```

**InterfaceConfig**
```java
package hello.proxy.config.v1_proxy;
import ...

@Configuration
public class InterfaceConfig {
    @Bean
    public OrderControllerV1 orderController(LogTrace logTrace){
        OrderControllerV1Impl controllerImpl = new OrderControllerV1Impl(orderService(logTrace));
        return new OrderControllerInterfaceProxy(controllerImpl, logTrace);
    }

    @Bean
    public OrderServiceV1 orderService(LogTrace logTrace){
        OrderServiceV1Impl serviceIpml = new OrderServiceV1Impl(orderRepository(logTrace));
        return new OrderServiceInterfaceProxy(serviceIpml, logTrace);
    }

    @Bean
    public OrderRepositoryV1 orderRepository(LogTrace logTrace){
        OrderRepositoryV1Impl repositoryImpl = new OrderRepositoryV1Impl();
        return new OrderRepositoryInterfaceProxy(repositoryImpl, logTrace);
    }
}
```
- **V1 프록시 런타임 객체 의존 관계 설정** 
  - 프록시의 런타임 객체 의존 관계를 설정, 프록시를 생성하고 프록시를 실제 스프링 빈 대신 등록한다. 실제 객체는 스프링 빈으로 등록하지 않는다.
- 프록시는 내부에 실제 객체를 참조하고 있다.
  - 예를 들어서 `OrderServiceInterfaceProxy` 는 내부에 실제 대상 객체인 `OrderServiceV1Impl` 을 가지고 있다.
- 정리하면 다음과 같은 의존 관계를 가지고 있다.
  - `proxy -> target`
  - `orderServiceInterfaceProxy -> orderServiceV1Impl`

![image](https://github.com/user-attachments/assets/16f068fc-4c2c-404a-8a34-862efba019cf)
- AppV1Config` 를 통해 프록시를 적용하기 전

  
![image](https://github.com/user-attachments/assets/ac62dc7e-b5da-4d37-a7ba-731b97b4f425)
- InterfaceProxyConfig` 를 통해 프록시를 적용한 후
- 스프링 컨테이너는 이제 실제 객체가 아니라 프록시 객체를 스프링 빈으로 관리
- 프록시 객체는 스프링 컨테이너가 관리하고 자바 힙 메모리에도 올라간다. 반면에 실제 객체는 자바 힙 메모리에 는 올라가지만 스프링 컨테이너가 관리하지는 않는다.
**ProxyApplication**
```java
package hello.proxy;
import ...

@Import(InterfaceConfig.class)
@SpringBootApplication(scanBasePackages = "hello.proxy.app") //주의
public class ProxyApplication {
	public static void main(String[] args) {
		SpringApplication.run(ProxyApplication.class, args);
	}

	@Bean
	public LogTrace logTrace(){
		return new ThreadLocalLogTrace();
	}
}
```
- LogTrace` 가 아직 스프링 빈으로 등록

