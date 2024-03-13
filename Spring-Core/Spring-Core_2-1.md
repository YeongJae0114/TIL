## 스프링 핵심 원리

**스프링 핵심 원리를 적용하여 도메인을 설계하자**
1. 역할과 구현 분리
	- 다형성 활용, 인터페이스 구현 객체 분리
2. OCP, DIP 같은 객체지향 설계 원칙
3. DIP : 인터페이스에 의존하며 주문 서비스 클라이어트 설계
4. OCP : 확장성을 고려

<img src="/img/Spring_Core/Core-2_1.png" alt="주문 도메인" width="500" height="400"/>

### Member
**Grade-enum**
```java
package com.example.demo.member;

public enum Grade {
    BASIC,
    VIP
}
```
- enum : 관련 상수들의 집합이다
- 클래스가 constant만으로 작성된다.

**Member객체** 
```java
package com.example.demo.member;

import lombok.Data;

@Data
public class Member {
    private Long id;
    private String name;
    private Grade grade;

    public Member(Long id, String name, Grade grade){
        this.id = id;
        this.name = name;
        this.grade = grade;
    }
}
```
- 회원들의 정보를 담는 객체이다.
- id, name, grade 를 변수로 갖고있다.
- @Data : 롬복의 애노테이션을 사용해서 Getter와 Setter를 자동으로 생성

### Repository
**MemberRepository**
```java
package com.example.demo.repository;
import com.example.demo.member.Member;

public interface MemberRepository {
    void save(Member member);
    Member findById(Long memberId);
}
```
- 인터페이스로 구현 객체를 분리
- 기능
	- save() : 저장
	- findById() : 회원 ID로 회원 정보 찾기

**MemoryMemberRepository** 
```java
package com.example.demo.repository;
import com.example.demo.member.Member;
import java.util.HashMap;
import java.util.Map;

public class MemoryMemberRepository implements MemberRepository{
    private static Map<Long, Member> store = new HashMap<>();

    @Override
    public void save(Member member) {
        store.put(member.getId(), member);
    }

    @Override
    public Member findById(Long memberId) {
        return store.get(memberId);
    }
}
```
- MemberRepository의 구현체이다.
	- store 이라는 HashMap<>()에 데이터를 저장 (메모리)
	- save(), findById()의 기능을 구현

### Service
**MemberService** 
```java
package com.example.demo.service;

import com.example.demo.member.Member;

public interface MemberService {
    void join(Member member);
    public Member findMember(Long memberId);
}
```
- 인터페이스로 구현 객체를 분리
- join() : Repository의 

**MemberServiceImpl**
```java
package com.example.demo.service;

import com.example.demo.member.Member;
import com.example.demo.repository.MemberRepository;

public class MemberServiceImpl implements MemberService{
    private final MemberRepository memberRepository;

    public MemberServiceImpl(MemberRepository memberRepository){
        this.memberRepository = memberRepository;
    }

    @Override
    public void join(Member member) {
        memberRepository.save(member);
    }

    @Override
    public Member findMember(Long memberId) {
        return memberRepository.findById(memberId);
    }
}
```
- MemberService의 구현체
- **DIP** 
	- MemberRepository 를 의존하게 한다. 
		- 직접 MemoryMemberRepository를 주입하면 추상에만 의존하지 않게 되므로 구체 클래스를 변경할 때 클라이언트 코드도 함께 변경해야 하는 일이 발생
	- 객체를 생성하고 연결하는 역할과 실행하는 역할이 명확히 분리
- MemberServiceImpl() 생성자로 MemberRepository 주입
- join(), findMember() : 저장, 회원 조회


### discount
**DiscountPolicy**
```java
package com.example.demo.discount;

import com.example.demo.member.Member;

public interface DiscountPolicy {
    int discount(Member member, int price);
}
```
- 인터페이스로 구현 객체를 분리
- discount() : 할인 금액을 반환

**FixDiscountPolicy** 
```java
package com.example.demo.discount;

import com.example.demo.member.Grade;
import com.example.demo.member.Member;

public class FixDiscountPolicy implements DiscountPolicy{
    private int discountFixAmount = 1000;
    @Override
    public int discount(Member member, int price) {
        if (member.getGrade() == Grade.VIP){
            return discountFixAmount;
        }else {
            return 0;
        }
    }
}
```
- DiscountPolicy의 구현체
- discount() : 할인 금액을 정하는 로직 
	- 고정된 금액을 할인

**RateDiscountPolicy** 
```java
package com.example.demo.discount;

import com.example.demo.member.Grade;
import com.example.demo.member.Member;

public class RateDiscountPolicy implements DiscountPolicy{
    private int discountPercent = 10;
    @Override
    public int discount(Member member, int price) {
        if (member.getGrade()== Grade.VIP){
            return price * discountPercent / 100;
        }else {
            return 0;
        }
    }
}
```
- DiscountPolicy의 다른 구현체
- discount() : 할인 금액을 정하는 로직 
	- 정률 할인


### order
**Order 객체**
```java
package com.example.demo.order;
import lombok.Data;

@Data
public class Order {
    private Long memberId;
    private String itemName;
    private int itemPrice;
    private int discountPrice;

    public Order(Long memberId, String itemName, int itemPrice, int discountPrice){
        this.memberId = memberId;
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.discountPrice = discountPrice;
    }
    public int calculatePrice(){
        return itemPrice - discountPrice;
    }
}
```
- 주문 정보를 담는 객체 생성
- @Data 사용


**OrderService**
```java
package com.example.demo.order;
public interface OrderService {
    Order createOrder(Long memberId, String itemName, int itemPrice);
}
```
- 인터페이스로 구현 객체를 분리
- createOrder : Order 객체 생성

**OrderServiceImpl**
```java
package com.example.demo.order;

import com.example.demo.discount.DiscountPolicy;
import com.example.demo.member.Member;
import com.example.demo.repository.MemberRepository;

public class OrderServiceImpl implements OrderService{
    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy;

    public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy){
        this.memberRepository = memberRepository;
        this.discountPolicy = discountPolicy;
    }

    @Override
    public Order createOrder(Long memberId, String itemName, int itemPrice) {
        Member member = memberRepository.findById(memberId);
        int discountPrice = discountPolicy.discount(member, itemPrice);

        return new Order(member.getId(), itemName, itemPrice, discountPrice);
    }
}

```
- OrderService의 구현체
- DIP를 위반하지 않도록 인터페이스에만 의존하도록 의존관계를 설계
	- 인터페이스에만 의존한다 : `memberRepository `, `discountPolicy `

**구현체가 없는 코드를 실행하기 위해서 AppConfig 생성**
AppConfig : 구현 객체를 생성**하고, **연결**하는 책임을 가지는 별도의 설정 클래스

### AppConfig
```java
package com.example.demo.core;

import com.example.demo.discount.DiscountPolicy;
import com.example.demo.discount.FixDiscountPolicy;
import com.example.demo.order.OrderService;
import com.example.demo.order.OrderServiceImpl;
import com.example.demo.repository.MemberRepository;
import com.example.demo.repository.MemoryMemberRepository;
import com.example.demo.service.MemberService;
import com.example.demo.service.MemberServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
- @Configuration : AppConfig에 설정을 구성한다는 뜻
- AppConfig는 애플리케이션의 실제 동작에 필요한 **구현 객체를 생성**한다. 	- `MemberServiceImpl`
	- `MemoryMemberRepository`
	- `OrderServiceImpl`
	- `FixDiscountPolicy`
- AppConfig는 생성한 객체 인스턴스의 참조(레퍼런스)를 **생성자를 통해서 주입(연결)**해준다. 
	- `MemberServiceImpl` -> `MemoryMemberRepository`
	- `OrderServiceImpl` -> `MemoryMemberRepository` , `FixDiscountPolicy`


