## 포인트컷 분리
`@Around` 에 포인트컷 표현식을 직접 넣을 수 도 있지만, `@Pointcut` 애노테이션을 사용해서 별도로 분리할 수 도 있다.

**AspectV2**
```java
package hello.aop.order.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;

@Slf4j
@Aspect
public class AspectV2 {
    @Pointcut("execution(* hello.aop.order..*(..))")
    private void allOrder(){}

    @Around("allOrder()")
    public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable{
        log.info("[log] {}", joinPoint.getSignature());
        return joinPoint.proceed();
    }
}
```
**@Pointcut**
- `@Pointcut` 에 포인트컷 표현식
- 메서드 이름과 파라미터를 합쳐서 포인트컷 시그니처(signature)라 한다.
  - 포인트컷 시그니처는 `allOrder()` 이다
- 메서드의 반환 타입은 `void`
- 포인트컷 시그니처는 `allOrder()` 이다. 이름 그대로 주문과 관련된 모든 기능을 대상으로 하는 포인트컷

> 하나의 포인트컷 표현식을 여러 어드바이스에서 함 께 사용할 수 있다

## 어드바이스 추가
다음과 같이 doLog 뿐만아니라 doTx라는 어드바이스도 추가한다.

<img width="744" alt="image" src="https://github.com/user-attachments/assets/c7d8e7eb-84eb-4996-b474-fd384c8f7f17">

**AspectV3**
```java
package hello.aop.order.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;

@Slf4j
@Aspect
public class AspectV3 {
    @Pointcut("execution(* hello.aop.order..*(..))")
    private void allOrder(){}

    @Pointcut("execution(* *..*Service.*(..))")
    private void allService(){}

    @Around("allOrder()")
    public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable{
        log.info("[log] {}", joinPoint.getSignature());
        return joinPoint.proceed();
    }

    @Around("allOrder() && allService()")
    public Object doTransaction(ProceedingJoinPoint joinPoint)throws Throwable{
        try {
            log.info("[트랜잭션 시작] {}", joinPoint.getSignature());
            Object result = joinPoint.proceed();
            log.info("[트랜잭션 커밋] {}", joinPoint.getSignature());
            return result;
        }catch (Exception e){
            log.info("[트랜잭션 롤백] {}", joinPoint.getSignature());
            throw e;
        }finally {
            log.info("[리소스 릴리즈] {}", joinPoint.getSignature());
        }
    }
 }
```
- `allOrder()` 포인트컷은 `hello.aop.order` 패키지와 하위 패키지를 대상으로 한다.
- allService()` 포인트컷은 타입 이름 패턴이 `*Service` 를 대상으로 하는데 쉽게 이야기해서 `XxxService` 처럼 `Service` 로 끝나는 것을 대상으로 한다.
  - `*Servi*` 과 같은 패턴도 가능
- `@Around("allOrder() && allService()")` 처럼 조합이 가능


### 포인트컷 참조
다음과 같이 포인트컷을 공용으로 사용하기 위해 별도의 외부 클래스에 모아두어도 된다. 참고로 외부에서 호출할 때는 포인트컷의 접근 제어자를 `public` 으로 열어두어야 한다.

**Pointcuts**
```java
package hello.aop.order.aop;

import org.aspectj.lang.annotation.Pointcut;

public class Pointcuts {
    @Pointcut("execution(* hello.aop.order..*(..))")
    public void allOrder(){}

    @Pointcut("execution(* *..*Service.*(..))")
    public void allService(){}

    @Pointcut("allOrder() && allService()")
    public void orderAndService(){}
}
```

이제 포인트컷을 참조해보자

**AspectV4Pointcut**
```java
package hello.aop.order.aop;

import ...

@Slf4j
@Aspect
public class AspectV4Pointcut {


    @Around("hello.aop.order.aop.Pointcuts.allOrder()")
    public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable{
        log.info("[log] {}", joinPoint.getSignature());
        return joinPoint.proceed();
    }
    @Around("hello.aop.order.aop.Pointcuts.orderAndService()")
    public Object doTransaction(ProceedingJoinPoint joinPoint)throws Throwable{
        try {
            log.info("[트랜잭션 시작] {}", joinPoint.getSignature());
            Object result = joinPoint.proceed();
            log.info("[트랜잭션 커밋] {}", joinPoint.getSignature());
            return result;
        }catch (Exception e){
            log.info("[트랜잭션 롤백] {}", joinPoint.getSignature());
            throw e;
        }finally {
            log.info("[리소스 릴리즈] {}", joinPoint.getSignature());
        }
    }
 }
```

## 어드바이스 순서
> 어드바이스는 기본적으로 순서를 보장하지 않는다. 
순서를 지정하고 싶으면 `@Aspect` 적용 단위로 `org.springframework.core.annotation.@Order` 애노테이션을 적용해야 한다. 
문제는 이것을 어드바이스 단위가 아니라 클래스 단위로 적용할 수 있다는 점이다. 
그래서 지금처럼 하나의 애스펙트에 여러 어드바이스가 있으면
순서를 보장 받을 수 없다. 따라서 **애스펙트를 별도의 클래스로 분리**해야 한다.

**AspectV5Order**
```java
package hello.aop.order.aop;

import ...

@Slf4j
public class AspectV5Order {
    @Aspect
    @Order(2)
    public static class LogAspect{
        @Around("hello.aop.order.aop.Pointcuts.allOrder()")
        public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable{
            log.info("[log] {}", joinPoint.getSignature());
            return joinPoint.proceed();
        }

    }
    @Aspect
    @Order(1)
    public static class TxAspect{
        @Around("hello.aop.order.aop.Pointcuts.orderAndService()")
        public Object doTransaction(ProceedingJoinPoint joinPoint)throws Throwable{
            try {
                log.info("[트랜잭션 시작] {}", joinPoint.getSignature());
                Object result = joinPoint.proceed();
                log.info("[트랜잭션 커밋] {}", joinPoint.getSignature());
                return result;
            }catch (Exception e){
                log.info("[트랜잭션 롤백] {}", joinPoint.getSignature());
                throw e;
            }finally {
                log.info("[리소스 릴리즈] {}", joinPoint.getSignature());
            }
        }
    }
 }
```
- 하나의 애스펙트 안에 있던 어드바이스를 `LogAspect` , `TxAspect` 애스펙트로 각각 분리했다.

<img width="744" alt="image" src="https://github.com/user-attachments/assets/ac25b4f2-6fe4-4ada-93a1-99932c223d73">


