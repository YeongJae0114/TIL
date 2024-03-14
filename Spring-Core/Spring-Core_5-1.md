## 싱글톤 패턴
- 클래스의 인스턴스가 딱 1개만 생성되는 것을 보장하는 디자인 패턴이다.
- 객체 인스턴스를 2개 이상 생성하지 못하도록 막아야 한다.
	- new 키워드 제한

**싱글톤 패턴이 없는 순수한 DI 컨테이너**

<img src="/img/Spring_Core/Core-5_1.png" alt="주문 도메인" width="600" height="450"/>

```java
public class SingletonTest {
	@Test
	@DisplayName("스프링 없는 순수한 DI 컨테이너") 
	void pureContainer() {
		AppConfig appConfig = new AppConfig();
			//1. 조회: 호출할 때 마다 객체를 생성
		MemberService memberService1 = appConfig.memberService();
			//2. 조회: 호출할 때 마다 객체를 생성
		MemberService memberService2 = appConfig.memberService();
			//참조값이 다른 것을 확인
		System.out.println("memberService1 = " + memberService1); 
		System.out.println("memberService2 = " + memberService2);
        	//memberService1 != memberService2
	        assertThat(memberService1).isNotSameAs(memberService2);
    		}
	}
```

- AppConfig는 요청을 할 때 마다 객체를 새로 생성
- 동시에 100명의 고객의 요청이 오면 객체 100개가 생성되고 소멸된다
	- `메모리 낭비가 심함`
- 객체가 딱 1개만 생성되고, 공유하도록 설계 -> 싱글톤 패턴

싱글톤 패턴을 사용하는 테스트 코드 작성

**싱글톤 패턴**
```java
package com.example.demo.singleton;


import com.example.demo.core.AppConfig;
import com.example.demo.service.MemberService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class SingletonService {
    private static final SingletonService instance = new SingletonService();

    public static SingletonService getInstance() {return instance;}

    private SingletonService() {}

    public void logic() {
        System.out.println("싱글톤 객체 로직 호출");
    }

    @Test
    @DisplayName("싱글톤 패턴을 적용한 객체")
    public void SingletonServiceTest() {
        SingletonService singletonService1 = SingletonService.getInstance();
        SingletonService singletonService2 = SingletonService.getInstance();

        System.out.println("singletonService1 = " + singletonService1);
        System.out.println("singletonService2 = " + singletonService2);

        Assertions.assertThat(singletonService1).isSameAs(singletonService2);
        singletonService1.logic();
    }
}
```
- 싱글톤 패턴을 적용해 계속 객체를 생성하지 않고 이미 만들어진 객체를 공유해서 효율적으로 사용할 수 있다. 
- 싱글톤 패턴은 문제점을 가지고 있다

**싱글톤 패턴 문제점**
- 구현 코드의 많이 들어간다. (코드가 길어짐)
- 의존관계상 클라이언트가 구체 클래스에 의존한다.
	- DIP를 위반
- 테스트하기 어렵다
- 내부 속성을 변경하거나 초기화 하기 어렵다.
**결론적으로 유연성이 떨어진다**


## 싱글톤 컨테이너
싱글톤 문제점을 해결하면서 객체 인스턴스를 싱글톤으로 관리하는 컨테이너
- 싱글톤 패턴의 단점을 모두 해결
	- 지저분한 코드가 들어가지 않는다 (코드가 간결해짐)
	- DIP, OCP, 테스트, private 생성자로 부터 자유롭게 싱글톤을 사용할 수 있다.

```java
    @Test
    @DisplayName("스프링 컨테이너와 싱글톤")
    void springContainer(){
        ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

        MemberService memberService1 = ac.getBean("memberService", MemberService.class);
        MemberService memberService2 = ac.getBean("memberService", MemberService.class);

        System.out.println("memberService = "+memberService1);
        System.out.println("memberService = "+memberService2);

        Assertions.assertThat(memberService1).isSameAs(memberService2);
    }
```

싱글톤 컨테이너 덕분에 이미 만들어진 객체를 공유해서 효율적으로 재사용할 수 있다.

<img src="/img/Spring_Core/Core-5_2.png" alt="주문 도메인" width="700" height="350"/>

### 싱글톤 방식의 주의점
- 여러 클라이언트가 하나의 같은 객체 인스턴스를 공유하기 때문에 싱글톤 객체는 상태를 유지하게 설계하면 안된다.
- 무상태로 설계해야 한다.
	- 특정 클라이언트에 의존적인 필드가 있으면 안된다.
	- 특정 클라이언트가 값을 변경할 수 있는 필드가 있으면 안된다.
	- 가급적 읽기만 가능해야 한다.
	- 필드 대신에 자바에서 공유되지 않는, 지역변수, 파라미터, ThreadLocal 등을 사용해야 한다.

>무상태(stateless)란 상태를 공유하는 필드 변수가 없는 것을 의미한다. 특정 클라이언트가 의존할 수 있는 필드 변수가 존재하면 안된다. 당연히 값을 변경할 수 없어야 한다. 가능한 메서드를 이용해 값을 읽기만 할 수 있도록 한다.

**상태를 유지할 경우 발생하는 문제점 예시**
```java
class StatefulServiceTest {

    @Test
    void statefulServiceSingleton() {
     ApplicationContext ac = new AnnotationConfigApplicationContext(TestConfig.class);

        StatefulService statefulService1 = ac.getBean(StatefulService.class);
        StatefulService statefulService2 = ac.getBean(StatefulService.class);

        // ThreadA: A 사용자 10000원 주문
        statefulService1.order("userA", 10000);

        // ThreadB: B 사용자 20000원 주문
        statefulService1.order("userA", 20000);

        // ThreadA: 사용자 A 주문 금액 조회
        int price = statefulService1.getPrice();
        System.out.println("price = " + price); // 20000원이 나온다. B 사용자로 인해 상태값 변경

        // statefulService1의 price와 statefulService2의 price가 동일해지는 문제가 발생한다. 
	Assertions.assertThat(statefulService1.getPrice())
		.isEqualTo(statefulService2.getPrice());
    }

    static class TestConfig {

        @Bean
        public StatefulService statefulService () {
            return new StatefulService();
        }
    }
}
```
- `StatefulService` 의 `price` 필드는 공유되는 필드인데, 특정 클라이언트가 값을 변경한다.
- 사용자A의 주문금액은 10000원이 되어야 하는데, 20000원이라는 결과가 나왔다.


### @Configuration와 바이트코드
```java
@Configuration
public class AppConfig {
    @Bean
    public MemberService memberService(){
        return new MemberServiceImpl(memberRepository());
    }
    @Bean
    public OrderService orderService(){
        return new OrderServiceImpl(memberRepository(), discountPolicy());
    }

    @Bean
    public MemberRepository memberRepository(){
        return new MemoryMemberRepository();
    }
    @Bean
    public DiscountPolicy discountPolicy(){
        return new FixDiscountPolicy();
    }
}
```
**@Bean 으로 스프링 빈을 생성한다. 그럼 `memberRepository()` 는 몇번 호출 될까?**
- 위 자바 코드만 본다면  
	1. 스프링 컨테이너가 스프링 빈에 등록하기 위해 `memberRepository()` 호출
	2. `memberService ` 로직에서 `memberRepository()`
	3. `orderService ` 로직에서 `memberRepository()`

총 3번 호출 된다고 생각할 수 있지만, 결과는 **모두 1번만 호출된다**

#### 그럼 왜 1번만 호출되는 것일까?

모든 비밀은 `@Configuration` 을 적용한 `AppConfig` 에 있다.
스프링이 CGLIB라는 바이트코드 조작 라이브러리를 사용해서 AppConfig 클래스를 상속받은 임의의 다른 클래스를 만들고, 그 다른 클래스를 스프링 빈으로 등록한 것이다.

<img src="/img/Spring_Core/Core-5_3.png" alt="주문 도메인" width="700" height="350"/>

만약 @Configuration을 적용하지 않고 @Bean 만 적용하면 아까 예상한대로 `memberRepository()` 는 총 3번 호출 될것이다.


1. 스프링 컨테이너가 스프링 빈에 등록하기 위해 `memberRepository()` 호출
2. `memberService ` 로직에서 `memberRepository()`
3. `orderService ` 로직에서 `memberRepository()`









