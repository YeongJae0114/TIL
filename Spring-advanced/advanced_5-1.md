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
