## 프록시 기술과 한계 - 타입 캐스팅
JDK 동적 프록시와 CGLIB를 사용해서 AOP 프록시를 만드는 방법에는 각각 장단점이 있다.
JDK 동적 프록시는 인터페이스가 필수이고, 인터페이스를 기반으로 프록시를 생성한다.
CGLIB는 구체 클래스를 기반으로 프록시를 생성한다.

인터페이스가 있는 경우에는 JDK나 CGLIB 둘중 하나를 선택할 수 있다.
- `proxyFactory.setProxyTargetClass(true); // cglib 프록시`
- `proxyFactory.setProxyTargetClass(fales); // jdk 동적 프록시`

인터페이스를 기반으로 프록시를 생성하는 JDK 동적 프록시는 구체 클래스로 타입 캐스팅이 불가능한 한계가 있다. 코드로 살펴보자

**jdkProxy**
```java
package hello.aop.proxyvs;

import hello.aop.member.MemberService;
import hello.aop.member.MemberServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.aop.framework.ProxyFactory;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Slf4j
public class ProxyCastingTest {
    @Test
    void jdkProxy(){
        MemberServiceImpl target = new MemberServiceImpl();
        ProxyFactory proxyFactory = new ProxyFactory(target);
        proxyFactory.setProxyTargetClass(false); // jdk 동적 프록시

        MemberService memberServiceProxy = (MemberService)proxyFactory.getProxy();
        log.info("proxy class={}", memberServiceProxy.getClass());
        Assertions.assertThrows(ClassCastException.class, ()-> {
            MemberServiceImpl castingMemberService = (MemberServiceImpl)memberServiceProxy;
        });
    }
}

```

**JDK 동적 프록시**

<img width="964" alt="image" src="https://github.com/user-attachments/assets/f0d63fb9-c90d-426a-ac5d-c179ff79995c">
- `MemberServiceImpl` 타입을 기반으로 JDK 동적 프록시를 생성했다. 
- `MemberServiceImpl` 타입은 `MemberService` 인터페이스를 구현한다.
- 따라서 JDK 동적 프록시는 `MemberService` 인터페이스를 기반으로 프록시를 생성한다.
-  이 프록시를 `JDK Proxy` 라고 하자. 여기서 `memberServiceProxy` 가 바로 `JDK Proxy` 이다.

</br></br>

**JDK 동적 프록시 캐스팅**

<img width="595" alt="image" src="https://github.com/user-attachments/assets/ef109c41-5fe2-474f-8c17-11e305676764">

- JDK Proxy를 대상 클래스인 `MemberServiceImpl` 타입으로 캐스팅 하려고 하니 예외가 발생
- JDK 동적 프록시는 인터페이스를 기반으로 프록시를 생성하기 때문에
- JDK Proxy는 `MemberService` 인터페이스를 기반으로 생성된 프록시이다. 따라서 JDK Proxy는 `MemberService` 로 캐스팅은 가능하지만
  - `MemberServiceImpl` 이 어떤 것인지 전혀 알지 못한다


**cglibProxy**
```java
    ...
    @Test
    void cglibProxy(){
        MemberServiceImpl target = new MemberServiceImpl();
        ProxyFactory proxyFactory = new ProxyFactory(target);
        proxyFactory.setProxyTargetClass(true); // cglib 프록시

        MemberService memberServiceProxy = (MemberService)proxyFactory.getProxy();
        log.info("proxy class={}", memberServiceProxy.getClass());

        MemberServiceImpl castingMemberService = (MemberServiceImpl)memberServiceProxy;
    }
```
**CGLIB 프록시**

<img width="964" alt="image" src="https://github.com/user-attachments/assets/c49415b3-0b6d-4fa4-8f72-ae8f6ce2db13">

- `MemberServiceImpl` 타입을 기반으로 CGLIB 프록시를 생성했다.
- `MemberServiceImpl` 타입은 `MemberService` 인터페이스를 구현했다.
- CGLIB는 구체 클래스를 기반으로 프록시를 생성한다. 따라서 CGLIB는 `MemberServiceImpl` 구체 클래스를 기반으로 프록시를 생성한다. 
- 이 프록시를 CGLIB Proxy라고 하자. 여기서 `memberServiceProxy` 가 바로 CGLIB Proxy이다.

**CGLIB 프록시 캐스팅**

<img width="555" alt="image" src="https://github.com/user-attachments/assets/dab66faa-7517-4fff-bb5d-403a63b75c63">

- CGLIB Proxy를 대상 클래스인 `MemberServiceImpl` 타입으로 캐스팅하면 성공한다.
- 왜냐하면 CGLIB는 구체 클래스를 기반으로 프록시를 생성하기 때문이다.
- CGLIB Proxy는 `MemberServiceImpl` 구체 클래스를 기반으로 생성된 프록시이다.
- 따라서 CGLIB Proxy는 `MemberServiceImpl` 은 물론이고,
- `MemberServiceImpl` 이 구현한 인터페이스인 `MemberService` 로도 캐스팅 할 수 있다.
