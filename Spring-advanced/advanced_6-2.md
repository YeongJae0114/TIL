## 포인트컷, 어드바이스, 어드바이저 
- **포인트컷**( `Pointcut` ): 어디에 부가 기능을 적용할지, 어디에 부가 기능을 적용하지 않을지 판단하는 필터링 로직이다. 주로 클래스와 메서드 이름으로 필터링 한다. 이름 그대로 어떤 포인트(Point)에 기능을 적용할지 하지 않 을지 잘라서(cut) 구분하는 것이다.
- **어드바이스**( `Advice` ): 이전에 본 것 처럼 프록시가 호출하는 부가 기능이다. 단순하게 프록시 로직이라 생각하면 된다.
- **어드바이저**( `Advisor` ): 단순하게 하나의 포인트컷과 하나의 어드바이스를 가지고 있는 것이다. 쉽게 이야기해서 **포인트컷1 + 어드바이스1**이다.

**역할과 책임**
- 포인트컷은 대상 여부를 확인하는 필터 역할만 담당한다.
- 어드바이스는 깔끔하게 부가 기능 로직만 담당한다.
- 둘을 합치면 어드바이저가 된다. 스프링의 어드바이저는 하나의 포인트컷 + 하나의 어드바이스로 구성된다.

![image](https://github.com/user-attachments/assets/3c464d30-c66e-4c32-86c2-3b2808727a86)


**AdvisorTest**
```java
@Slf4j
public class AdvisorTest {
    @Test
    void advisorTest1() {
        ServiceInterface target = new ServiceImpl();
        ProxyFactory proxyFactory = new ProxyFactory(target);
        DefaultPointcutAdvisor advisor = new
DefaultPointcutAdvisor(Pointcut.TRUE, new TimeAdvice());
        proxyFactory.addAdvisor(advisor);
        ServiceInterface proxy = (ServiceInterface) proxyFactory.getProxy();
        proxy.save();
        proxy.find();
    }
}
```
- new DefaultPointcutAdvisor` : `Advisor` 인터페이스의 가장 일반적인 구현체이다.
  - 생성자를 통해 하나 의 포인트컷과 하나의 어드바이스를 넣어주면 된다.
  - 어드바이저는 하나의 포인트컷과 하나의 어드바이스로 구성 된다.
- Pointcut.TRUE` : 항상 `true` 를 반환하는 포인트컷
- `new TimeAdvice()` : 앞서 개발한 `TimeAdvice` 어드바이스를 제공
- proxyFactory.addAdvisor(advisor)` : 프록시 팩토리에 적용할 어드바이저를 지정

### 프록시 팩토리 - 어드바이저 관계
![image](https://github.com/user-attachments/assets/b8a0eed3-fbc8-46bb-afa0-034f297394ed)


## 스프링이 제공하는 포인트컷
스프링은 우리가 필요한 포인트컷을 이미 대부분 제공한다.
```java
@Test
@DisplayName("스프링이 제공하는 포인트컷") void advisorTest3() {
     ServiceImpl target = new ServiceImpl();
     ProxyFactory proxyFactory = new ProxyFactory(target);
     NameMatchMethodPointcut pointcut = new NameMatchMethodPointcut();
     pointcut.setMappedNames("save");
     DefaultPointcutAdvisor advisor = new DefaultPointcutAdvisor(pointcut, new
 TimeAdvice());
     proxyFactory.addAdvisor(advisor);
     ServiceInterface proxy = (ServiceInterface) proxyFactory.getProxy();
     proxy.save();
     proxy.find();
 }
```
- **NameMatchMethodPointcut 사용**
  - `NameMatchMethodPointcut` 을 생성하고 `setMappedNames(...)` 으로 메서드 이름을 지정하면 포인트컷이 완성
    
### 스프링이 제공하는 포인트컷
대표적인 몇가지만 알아보자.
- `NameMatchMethodPointcut` : 메서드 이름을 기반으로 매칭한다. 내부에서는 `PatternMatchUtils` 를 사용한다.
  - 예) `*xxx*` 허용
- `JdkRegexpMethodPointcut` : JDK 정규 표현식을 기반으로 포인트컷을 매칭한다.
- `TruePointcut` : 항상 참을 반환한다. `AnnotationMatchingPointcut` : 애노테이션으로 매칭한다.
- `AspectJExpressionPointcut` : aspectJ 표현식으로 매칭한다.

**가장 중요한 것은 aspectJ 표현식**
여기에서 사실 다른 것은 중요하지 않다. 실무에서는 사용하기도 편리하고 기능도 가장 많은 aspectJ 표현식을 기반으로 사용하는 `AspectJExpressionPointcut` 을 사용하게 된다.

aspectJ 표현식과 사용방법은 중요해서 이후 AOP를 설명할 때 자세히 설명하겠다.
지금은 `Pointcut` 의 동작 방식과 전체 구조에 집중하자.


##  여러 어드바이저 함께 적용

<img width="619" alt="image" src="https://github.com/user-attachments/assets/8761444d-92e9-47f2-985c-a1aa2883b2eb">

```java
@Test
@DisplayName("여러 프록시") void multiAdvisorTest1() {
  //client -> proxy2(advisor2) -> proxy1(advisor1) -> target
  //프록시1 생성
  ServiceInterface target = new ServiceImpl(); ProxyFactory proxyFactory1 = new ProxyFactory(target); DefaultPointcutAdvisor advisor1 = new
  DefaultPointcutAdvisor(Pointcut.TRUE, new Advice1());
  proxyFactory1.addAdvisor(advisor1);
  ServiceInterface proxy1 = (ServiceInterface) proxyFactory1.getProxy();

  //프록시2 생성, target -> proxy1 입력
  ProxyFactory proxyFactory2 = new ProxyFactory(proxy1); DefaultPointcutAdvisor advisor2 = new
  DefaultPointcutAdvisor(Pointcut.TRUE, new Advice2()); proxyFactory2.addAdvisor(advisor2);
  ServiceInterface proxy2 = (ServiceInterface) proxyFactory2.getProxy(); //실행
  proxy2.save();
}

@Slf4j
     static class Advice1 implements MethodInterceptor {
         @Override
         public Object invoke(MethodInvocation invocation) throws Throwable {
             log.info("Advice1 호출");
             return invocation.proceed();
         }
}

@Slf4j
     static class Advice2 implements MethodInterceptor {
         @Override
         public Object invoke(MethodInvocation invocation) throws Throwable {
             log.info("advice2 호출");
             return invocation.proceed();
         }
}
```
### 문제
 프록시를 2번 생성해야 한다는 문제가 있다. 만약 적용해야 하는 어드바이저가 10개 라면 10개의 프록시를 생성해야한다.

 ## 하나의 프록시, 여러 어드바이저
 스프링은 이 문제를 해결하기 위해 하나의 프록시에 여러 어드바이저를 적용할 수 있게 만들어두었다.
<img width="619" alt="image" src="https://github.com/user-attachments/assets/f8981381-c216-4713-b24c-41406bc35c69">

```java
@Test
@DisplayName("하나의 프록시, 여러 어드바이저") void multiAdvisorTest2() {
     //proxy -> advisor2 -> advisor1 -> target
     DefaultPointcutAdvisor advisor2 = new DefaultPointcutAdvisor(Pointcut.TRUE, new Advice2());
     DefaultPointcutAdvisor advisor1 = new DefaultPointcutAdvisor(Pointcut.TRUE, new Advice1());

     ServiceInterface target = new ServiceImpl();
     ProxyFactory proxyFactory1 = new ProxyFactory(target);
     proxyFactory1.addAdvisor(advisor2);
     proxyFactory1.addAdvisor(advisor1);
     ServiceInterface proxy = (ServiceInterface) proxyFactory1.getProxy();

     //실행
     proxy.save();
}
```
- 프록시 팩토리에 원하는 만큼 `addAdvisor()` 를 통해서 어드바이저를 등록하면 된다.
- 등록하는 순서대로 `advisor` 가 호출된다. 여기서는 `advisor2` , `advisor1` 순서로 등록했다.

<img width="619" alt="image" src="https://github.com/user-attachments/assets/641fbd7f-bc2d-41ab-b7b7-d4fdb068ff18">



