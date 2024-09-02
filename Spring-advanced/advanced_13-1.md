## 스프링 AOP - 실무 주의사항

### 프록시와 내부 호출 문제
스프링은 프록시 방식의 AOP를 사용한다.
따라서 AOP를 적용하려면 항상 프록시를 통해서 객체(Target)을 호출해야 한다.
`프록시를 거치지 않고 대상 객체를 직접 호출하게 되면 AOP가 적용되지 않고, 어드바이스도 호출되지 않는다.`

 -> 객체의 내부에서 메서드 호출이 발생하면 프록시를 거치지 않고 대상 객체를 직접 호출하는 문제가 발생

**CallServiceV0**
```java
package hello.aop.internalcall;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CallServiceV0 {
    public void externalCall(){
        log.info("call externalCall()");
        internalCall(); // this.internalCall();
    }
    public void internalCall(){
        log.info("call iternalCall()");
    }
}
```
- allServiceV0.external()` 을 호출하면 내부에서 `internal()` 이라는 자기 자신의 메서드를 호출

**CallLogAspect**
```java
package hello.aop.internalcall.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;

@Slf4j
@Aspect
public class CallLogAspect {
    @Before("execution(* hello.aop.internalcall..*.*(..))")
    public void doLog(JoinPoint joinPoint){
        log.info("aop={}", joinPoint.getSignature());
    }
}
```

**CallLogAspectTest**
```java
package hello.aop.internalcall.aop;

import hello.aop.internalcall.CallServiceV0;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@Slf4j
@Import(CallLogAspect.class)
class CallLogAspectTest {
    @Autowired
    CallServiceV0 callServiceV0;

    @Test
    public void external() throws Exception{
        //log.info("target={}", callServiceV0.getClass());
        callServiceV0.externalCall();
    }
    @Test
    public void internal() throws Exception{
        callServiceV0.internalCall();
    }
}
```
- `@Import(CallLogAspect.class)` : 앞서 만든 간단한 `Aspect` 를 스프링 빈으로 등록한다.
  - 이렇게 해서 `CallServiceV0` 에 AOP 프록시를 적용
- `@SpringBootTest` : 내부에 컴포넌트 스캔을 포함하고 있다.
  - `CallServiceV0` 에 `@Component` 가 붙어있으므로 스프링 빈 등록 대상이 된다.

<img width="857" alt="image" src="https://github.com/user-attachments/assets/76aa2645-ce07-492b-82e0-70a963841521">
- `CallServiceV0.external()` 을 실행할 때는 프록시를 호출한다. 따라서 `CallLogAspect` 어 드바이스가 호출된 것을 확인할 수 있다.
- AOP Proxy는 `target.external()` 을 호출
- 여기서 문제는 `callServiceV0.external()` 안에서 `internal()` 을 호출할 때 발생
- 이때는 `CallLogAspect` 어드바이스가 호출되지 않는다.

**외부에서 `internal()` 을 호출 하는 방법**
<img width="638" alt="image" src="https://github.com/user-attachments/assets/09529b97-117a-4632-8a91-6e39d0d74a8e">
- 외부에서 호출하는 경우 프록시를 거치기 때문에 `internal()` 도 `CallLogAspect` 어드바이스가 적용된다.
