## 프록시와 내부 호출 - 대안1(자기 자신 주입)
내부 호출을 해결하는 가장 간단한 방법은 자기 자신을 의존관계 주입 받는 것이다.

**CallServiceV1**
```java
package hello.aop.internalcall;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CallServiceV1 {
    private CallServiceV1 callServiceV1;

    @Autowired
    public void setCallServiceV1(CallServiceV1 callServiceV1){
        log.info("callServiceV1 setter={}", callServiceV1.getClass());
        this.callServiceV1 = callServiceV1;
    }

    public void externalCall(){
        log.info("call externalCall()");
        callServiceV1.internalCall();
    }
    public void internalCall(){
        log.info("call iternalCall()");
    }
}
```
- `callServiceV1`를 수정자(set)를 통해서 주입 받는다.
- AOP가 적용된 대상을 의존관계 주입 받으면 주입 받은 대상은 실제 자신이 아니라 프록시 객체이다
- 생성자와 수정자를 통해서 의존관계를 주입 받으면 순환 사이클이 만들어진다.
  - 수정자도 spring 최신 버전에서는 순환 사이클이 만들어지는데
  - application.properties 에 `spring.main.allow-circular-references=true`를 추가해야 한다. 

**CallServiceV1Test**
```java
package hello.aop.internalcall.aop;

import hello.aop.internalcall.CallServiceV1;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(CallLogAspect.class)
class CallServiceV1Test {
    @Autowired
    CallServiceV1 callServiceV1;

    @Test
    void external(){
        callServiceV1.externalCall();
    }
}
```

**결과**
```text
[aop] [    Test worker] h.aop.internalcall.aop.CallLogAspect     : aop=void hello.aop.internalcall.CallServiceV1.externalCall()
[aop] [    Test worker] hello.aop.internalcall.CallServiceV1     : call externalCall()
[aop] [    Test worker] h.aop.internalcall.aop.CallLogAspect     : aop=void hello.aop.internalcall.CallServiceV1.internalCall()
[aop] [    Test worker] hello.aop.internalcall.CallServiceV1     : call iternalCall()
```
<img width="791" alt="image" src="https://github.com/user-attachments/assets/750e04cf-4260-4613-ab12-c757e2f4f3e0">
- 자기 자신의 인스턴스를 호출하는 것이 아니라 프록시 인스턴스를 통해서 호출하는 것을 확인할 수 있다.

## 대안2 (지연 조회)
앞서 생성자 주입이 실패하는 이유는 자기 자신을 생성하면서 주입해야 하기 때문이다. 이 경우 수정자 주입을 사용하거나 지연 조회를 사용하면 된다.
- 스프링 빈을 지연해서 조회하는 방식인데, `ObjectProvider(Provider)`, `ApplicationContext`를 사용하면 된다.

**CallServiceV2**
```java
package hello.aop.internalcall;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CallServiceV2 {
    private final ObjectProvider<CallServiceV2>callServiceProvider;

    public CallServiceV2(ObjectProvider<CallServiceV2> callServiceProvider) {
        this.callServiceProvider = callServiceProvider;
    }

    // private final ApplicationContext applicationContext;
    //    public CallServiceV2(ApplicationContext applicationContext) {
    //        this.applicationContext = applicationContext;
    //    }

    public void externalCall(){
        log.info("call externalCall()");
        //CallServiceV2 callServiceV2 = applicationContext.getBean(CallServiceV2.class);
        CallServiceV2 callServiceV2 = callServiceProvider.getObject();
        callServiceV2.internalCall(); // 외부 메서드 실행
    }
    public void internalCall(){
        log.info("call iternalCall()");
    }
}
```
- `ApplicationContext` 를 사용해 스프링 컨테이너에서 조회하는 것을 스프링 빈 생성 시점이 아니라 실제 객체를 사용하는 시점으로 지연할 수 있다.
  - `callServiceProvider.getObject`를 호출하는 사점에 스프링 컨테이너에서 빈을 조회한다.

**CallServiceV2Test**
```java
package hello.aop.internalcall.aop;

import hello.aop.internalcall.CallServiceV2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(CallLogAspect.class)
class CallServiceV2Test {
    @Autowired
    CallServiceV2 callServiceV2;

    @Test
    void external(){
        callServiceV2.externalCall();
    }
}
```
**결과**
```text
CallLogAspect     : aop=void hello.aop.internalcall.CallServiceV2.externalCall()
CallServiceV2     : call externalCall()
CallLogAspect     : aop=void hello.aop.internalcall.CallServiceV2.internalCall()
CallServiceV2     : call iternalCall()
```

## 대안 3 (구조변경)
대안 1, 2 방식은 의존관계 주입 또는 Provider를 사용해 지연 조회를 해야한다
가장 좋은 방법은 내부 호출이 발생하지 않도록 구조를 변경하는 것이다. 
스프링은 실제로 이 방법을 가장 권장한다.

**CallServiceV3**
```java
package hello.aop.internalcall;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

// 구조 변경
@Slf4j
@Component
@RequiredArgsConstructor
public class CallServiceV3 {
    private final InternalService internalService;

    public void external(){
        log.info("call externalCall()");
        internalService.internal();
    }
}
```
- 내부 호출을 `InternalService` 라는 별도의 클래스로 분리

**InternalService**
```java
package hello.aop.internalcall;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class InternalService {
    public void internal(){
        log.info("call internal");
    }
}
```

**CallServiceV3Test**
```java
package hello.aop.internalcall.aop;


import hello.aop.internalcall.CallServiceV3;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(CallLogAspect.class)
class CallServiceV3Test {
    @Autowired
    CallServiceV3 callServiceV3;

    @Test
    void external(){
        callServiceV3.external();
    }
}
```

**결과**
```text
CallLogAspect     : aop=void hello.aop.internalcall.CallServiceV3.externalCall()
CallServiceV3     : call externalCall()
CallLogAspect     : aop=void hello.aop.internalcall.CallServiceV3.internalCall()
CallServiceV3     : call iternalCall()
```

<img width="964" alt="image" src="https://github.com/user-attachments/assets/bcb0e0fe-f0e4-4223-9100-c2687e9ff357">

- 내부 호출 자체가 사라지고, `callSevice` -> `internalService`를 호출하는 구조로 변경되었다. 덕분에 자연스럽게 AOP 적용


