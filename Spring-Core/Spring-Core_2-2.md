## 스프링 컨테이너

**스프링 컨테이너 생성**```java
//스프링 컨테이너 생성
ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
```
- 스프링 컨테이너를 생성할 때는 구성 정보를 지정해주어야 한다.
	- `AppConfig.class`
	
- ApplicationContext` 를 스프링 컨테이너라 한다.
	- `ApplicationContext` 는 인터페이스이다.
- 스프링 컨테이너는 XML을 기반으로 만들 수 있고, 애노테이션 기반의 자바 설정 클래스로 만들 수 있다. 
- 직전에 `AppConfig` 를 사용했던 방식이 애노테이션 기반의 자바 설정 클래스로 스프링 컨테이너를 만든 것이다.

**스프링 컨테이너 생성 과정**
<img src="/img/Spring_Core/Core-2_2.png" alt="주문 도메인" width="500" height="400"/>
- 스프링 컨테이너는 파라미터로 넘어온 설정 클래스 정보를 사용해서 스프링 빈을 등록한다.

## 스프링 컨테이너 적용

**AppConfig**
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
```
- `@Configuration` : `AppConfig` 를 설정(구성) 정보로 사용한다. 스프링 빈으로 등록한다.
- `@Bean` 이 라 적힌 메서드를 모두 호출해서 반환된 객체를 스프링 컨테이너에 등록한다. 
- `@Bean(name="memberService2")` 빈의 이름을 설정 가능

**MemeberApp**
```java
package com.example.demo.core;


import com.example.demo.member.Grade;
import com.example.demo.member.Member;
import com.example.demo.service.MemberService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class MemberApp {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
        MemberService memberService = applicationContext.getBean("memberService", MemberService.class);

        Member member = new Member(1L,"aa", Grade.VIP);
        memberService.join(member);

        Member findMember = memberService.findMember(1L);
        System.out.println("new member = " + member.getName());
        System.out.println("find Member = " + findMember.getName());
    }
}
```
- `ApplicationContext` 를 스프링 컨테이너라 한다.
- 스프링 컨테이너에서 스프링 빈을 찾아서 사용한다
- 기존에는 `AppConfig` 를 사용해서 직접 객체를 생성하고 DI를 했지만, 이제부터는 스프링 컨테이너를 통해서 사용한다.

**OrderApp**
```java
package com.example.demo.core;

import com.example.demo.member.Grade;
import com.example.demo.member.Member;
import com.example.demo.order.Order;
import com.example.demo.order.OrderService;
import com.example.demo.service.MemberService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class OrderApp {
    public static void main(String[] args) {
        ApplicationContext applicationContext = 
		new AnnotationConfigApplicationContext(AppConfig.class);
        
	MemberService memberService = applicationContext
		.getBean("memberService", MemberService.class);

        OrderService orderService = applicationContext
		.getBean("OrderService",OrderService.class);

        long memberId = 1L;
        Member member = new Member(memberId, "memberA", Grade.VIP);
        memberService.join(member);

        Order order = orderService.createOrder(memberId, "itemA", 50000);

        System.out.println("order = " + order);
    }
}
```
- `ApplicationContext` 를 스프링 컨테이너라 한다.
- 스프링 컨테이너에서 스프링 빈을 찾아서 사용한다
- 기존에는 `AppConfig` 를 사용해서 직접 객체를 생성하고 DI를 했지만, 이제부터는 스프링 컨테이너를 통해서 사용한다.