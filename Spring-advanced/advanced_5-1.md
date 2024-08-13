## 리플렉션
지금까지 프록시를 사용해 기존 코드를 변경하지 않고, 로그 추적기라는 부가 기능을 적용할 수 있었다. 그러나 대상 클래스 수가 만큼 프록시를 위한 클래스를 만들어야 한다.  
이 문제를 자바가 기본으로 제공하는 JDK 동적 프록시 가술이나 CGLIB 같은 프록시 생성 오픈소스 기술을 활용하면 프록시 객체를 동적을 만들어 낼 수 있다.

예제 코드를 통해 자바 리플렉션 기술을 이해해보자.

**ReflectionTest**
```java
package hello.proxy.jdkdynamic;

import ...

@Slf4j
public class ReflectionTest {
    @Test
    void reflection0(){
        Hello target = new Hello();
        log.info("start");
        String result1 = target.callA();
        log.info("result={}", result1);

        log.info("start");
        String result2 = target.callB();
        log.info("result={}", result2);
    }
    @Slf4j
    static class Hello{
        public String callA() {
            log.info("callA");
            return "A";
        }
        public String callB() {
            log.info("callB");
            return "B"; }
    }
}
```
**동작**
- start 로그 출력
- 메서드 호출
- 메서드 호출 결과 출력


```java
    @Test
    void reflection1() throws Exception{
        Class classHello = Class.forName("hello.proxy.jdkdynamic.ReflectionTest$Hello");

        Hello target = new Hello();

        Method methodCallA = classHello.getMethod("callA");
        Object result1 = methodCallA.invoke(target);
        log.info("result1={}", result1);

        Method methodCallB = classHello.getMethod("callB");
        Object result2 = methodCallB.invoke(target);
        log.info("result2={}", result2);
    }
```
- `Class.forName("hello.proxy.jdkdynamic.ReflectionTest$Hello")` : 클래스의 메터 정보를 획득한다
- `classHello.getMethod("callA");` : 해당 클래스의 `call` 메서드 메타 정보 획득
- `methodCallA.invoke(target);` : 인스턴스를 넘겨주면 해당 메서드를 찾아서 실행한다
  - `target` 의 `call` 메서드

```java
    @Test
    void reflection2() throws Exception {
        Class classHello =
                Class.forName("hello.proxy.jdkdynamic.ReflectionTest$Hello");
        Hello target = new Hello();
        Method methodCallA = classHello.getMethod("callA");
        dynamicCall(methodCallA, target);
        Method methodCallB = classHello.getMethod("callB");
        dynamicCall(methodCallB, target);
    }

    private void dynamicCall(Method method, Object target) throws Exception {
        log.info("start");
        Object result = method.invoke(target);
        log.info("result={}", result);
    }
```
- `dynamicCall(Method method, Object target)`
  - 공통 로직1 , 공통 로직2 를 한번에 처리할 수 있는 통합된 공통 처리 로직이다.
  - `Method method` : 호출한 메서드 정보가 넘어온다
  - `Object target` : 실행할 메서드가 넘어온다.

**결론**
정적인 `target.callA()` , `target.callB()` 코드를 리플렉션을 사용해서 `Method` 라는 메타정보로 추상화했 다. 덕분에 공통 로직을 만들 수 있게 되었다.

## JDK 동적 프록시 - 소개
동적 프록시 기술을 사용하면 개발자가 직접 프록시 클래스를 만들지 않아도 된다. 이름 그대로 프록시 객체를 동적으로 런타임에 개발자 대신 만들어준다. 그리고 동적 프록시에 원하는 실행 로직을 지정할 수 있다.

`JDK 동적 프록시는 인터페이스를 기반으로 프록시를 동적으로 만들어준다. 따라서 인터페이스가 필수이다.`

## 기본 예제 코드
**AInterface**
```java
package hello.proxy.jdkdynamic.code;

public interface AInterface {
    void call();
}
```

**AImpl**
```java
package hello.proxy.jdkdynamic.code;

public class AImpl implements AInterface {
    @Override
    public void call() {
    }
}
```

**BInterface**
```java
package hello.proxy.jdkdynamic.code;

public interface BInterface {
    void call();
}

```
**BImpl**
```java
package hello.proxy.jdkdynamic.code;

public class BImpl implements BInterface {
    @Override
    public void call() {
    }
}
```


## JDK 동적 프록시 - 예제
```java
package hello.proxy.jdkdynamic.code;

import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
@Slf4j
public class TimeInvocationHandler implements InvocationHandler {
    private final Object target;

    public TimeInvocationHandler(Object target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        log.info("TimeProxy start");
        long startTime = System.currentTimeMillis();
        Object result = method.invoke(target, args);

        long endTime = System.currentTimeMillis();
        long resultTime = endTime - startTime;
        log.info("resultTime = {}", resultTime);

        log.info("TimeProxy end");
        return result;
    }
}
```
- `TimeInvocationHandler` 은 `InvocationHandler` 인터페이스를 구현한다. 이렇게해서 JDK 동적 프록 시에 적용할 공통 로직을 개발할 수 있다.
- `Object target` : 동적 프록시가 호출할 대상
- `method.invoke(target, args)` : 리플렉션을 사용해서 `target` 인스턴스의 메서드를 실행한다. `args` 는 메서드 호출시 넘겨줄 인수이다.

**JdkDynamicProxyTest**
```
package hello.proxy.jdkdynamic.code;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;

@Slf4j
public class JdkDynamicProxyTest {
    @Test
    void dynamicA(){
        AInterface target = new AImpl();
        TimeInvocationHandler handler = new TimeInvocationHandler(target);
        AInterface proxy = (AInterface)Proxy.newProxyInstance(AInterface.class.getClassLoader(), new Class[]{AInterface.class}, handler);

        proxy.call();
        log.info("targetClass={}",target.getClass());
        log.info("proxyClass={}",proxy.getClass());
    }

    @Test
    void dynamicB(){
        BInterface target =new BImpl();
        TimeInvocationHandler handler = new TimeInvocationHandler(target);
        BInterface proxy = (BInterface)Proxy.newProxyInstance(BInterface.class.getClassLoader(), new Class[]{BInterface.class}, handler);

        proxy.call();
        log.info("targetClass={}",target.getClass());
        log.info("proxyClass={}",proxy.getClass());
    }
}
```
- `new TimeInvocationHandler(target)` : 동적 프록시에 적용할 핸들러 로직이다.
- `Proxy.newProxyInstance(AInterface.class.getClassLoader(), new Class[] {AInterface.class}, handler)`
- 동적 프록시는 `java.lang.reflect.Proxy` 를 통해서 생성할 수 있다.
- 클래스 로더 정보, 인터페이스, 그리고 핸들러 로직을 넣어주면 된다. 그러면 해당 인터페이스를 기반으로 동적 프록시를 생성하고 그 결과를 반환한다.

![image](https://github.com/user-attachments/assets/54f1999a-3444-4053-9b17-92a1a0d38bcd)

**JDK 동적 프록시 도입 후 클래스 의존 관계**

![image](https://github.com/user-attachments/assets/cbe74722-041a-4899-80ca-8e9bc8f70807)
