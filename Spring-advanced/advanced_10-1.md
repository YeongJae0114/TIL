## 스프링 AOP 구현 - 시작
스프링 AOP를 구현하는 일반적인 방법은 앞서 학습한 `@Aspect` 를 사용하는 방법이다.
이번 시간에는 `@Aspect` 를 사용해서 가장 단순한 AOP를 구현해보자.

**AspectV1**
```java
package hello.aop.order.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

@Slf4j
@Aspect
public class AspectV1 {
    @Around("execution(* hello.aop.order..*(..))")
    public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable{
        log.info("[log] {}", joinPoint.getSignature());
        return joinPoint.proceed();
    }
}
```
- 포인트컷 : `@Around` 애노테이션의 값인 `execution(* hello.aop.order..*(..))`
- 어드바이스 : `@Around` 애노테이션의 메서드인 `doLog`
**AspectJ 포인트컷 표현식**
  - `execution(* hello.aop.order..*(..))`는
  - `hello.aop.order` 패키지와 그 하위 패키지( `..` )를 지정
- 이제 `OrderService` , `OrderRepository` 의 모든 메서드는 AOP 적용의 대상이 된다. 참고로 스프링은 프 록시 방식의 AOP를 사용하므로 프록시를 통하는 메서드만 적용 대상이 된다.

> 스프링 AOP는 AspectJ의 문법을 차용하고, 프록시 방식의 AOP를 제공한다. AspectJ를 직접 사용하는 것이 아니다.
> 스프링 AOP를 사용할 때는 `@Aspect` 애노테이션을 주로 사용하는데, 이 애노테이션도 AspectJ가 제공하는 애노테이션이다.

**AopTest**
```java
package hello.aop;

import ...

@SpringBootTest
@Slf4j
@Import(AspectV1.class)
public class AopTest {
    @Autowired
    OrderService orderService;

    @Autowired
    OrderRepository orderRepository;

    @Test
    void aopInfo() {
        log.info("isAopProxy, orderService = {}", AopUtils.isAopProxy(orderService));
        log.info("isAopProxy, orderRepository = {}", AopUtils.isAopProxy(orderRepository));
    }

    @Test
    void success(){
        orderService.orderItem("itemA");
    }
    @Test
    void exception(){
        Assertions.assertThatThrownBy(()->orderService.orderItem("ex"))
                .isInstanceOf(IllegalStateException.class);
    }
}
```
`@Aspect` 는 애스펙트라는 표식이지 컴포넌트 스캔이 되는 것은 아니다. 따라서 `AspectV1` 를 AOP로 사용하려면 스 프링 빈으로 등록해야 한다.

**스프링 빈으로 등록하는 방법**
- @Bean` 을 사용해서 직접 등록
- `@Component` 컴포넌트 스캔을 사용해서 자동 등록
- `@Import` 주로 설정 파일을 추가할 때 사용( `@Configuration` )

<img width="657" alt="image" src="https://github.com/user-attachments/assets/ff3795a7-0fad-4b4b-866c-3db82e22f56f">

