## 컴포넌트 스캔
자바 코드의 @Bean 을 통해서 직접 스프링 빈을 나열했다. 만약 스프링 빈이 많아진다면 일일이 등록하기 힘들기 때문에, 스프링은 설정 정보가 없어도 자동으로 스피링 빈을 등록하는 **컴포넌트 스캔**이라는 기능을 제공한다. 또한 의존관계를 자동을 주입하는 `@Autowired` 라는 기능도 제공

-  `@Component` 애노테이션이 붙은 클래스를 스캔해서 스프링 빈으로 등록한다.

**참고**
>컴포넌트 스캔을 사용하면 `@Configuration` 이 붙은 설정 정보도 자동으로 등록되기 때문에, AppConfig, TestConfig 등 앞서 만들어두었던 설정 정보도 함께 등록되고, 실행되어 버린다. 그래서
`excludeFilters` 를 이용해서 설정정보는 컴포넌트 스캔 대상에서 제외했다. 보통 설정 정보를 컴포넌트 스캔 대상에서 제외하지는 않지만, 기존 예제 코드를 최대한 남기고 유지하기 위해서 이 방법을 선택했다.

### 컨포넌트 스캔과 의존관계 자동 주입

**AutoAppConfig**
```java
package com.example.demo.core;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;

@ComponentScan(excludeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = Configuration.class))
@Configuration
public class AutoAppConfig {   }
```
- 컴포넌트 스캔을 사용하려면 먼저 `@ComponentScan` 을 설정 정보에 붙여주면 된다. 
- 기존의 AppConfig와는 다르게 @Bean으로 등록한 클래스가 하나도 없다

**MemoryMemberRepository @Component 추가**
```java
 @Component
 public class MemoryMemberRepository implements MemberRepository {}
```

**RateDiscountPolicy @Component 추가** 
```java
 @Component
 public class RateDiscountPolicy implements DiscountPolicy {}
```

**MemberServiceImpl @Component, @Autowired 추가** 
```java
 @Component
 public class MemberServiceImpl implements MemberService {
     private final MemberRepository memberRepository;
     @Autowired
     public MemberServiceImpl(MemberRepository memberRepository) {
         this.memberRepository = memberRepository;
     }
}
```

**OrderServiceImpl @Component, @Autowired 추가** 
```java
 @Component
 public class OrderServiceImpl implements OrderService {
     private final MemberRepository memberRepository;
     private final DiscountPolicy discountPolicy;
@Autowired
     public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy
 discountPolicy) {
         this.memberRepository = memberRepository;
         this.discountPolicy = discountPolicy;
     }
}
```
- `@Autowired` 를 사용하면 생성자에서 여러 의존관계도 한번에 주입받을 수 있다.

**1. @ComponentScan**
<img src="/img/Spring_Core/Core-6_1.png" alt="주문 도메인" width="800" height="400"/>
- `@ComponentScan` 은 `@Component` 가 붙은 모든 클래스를 스프링 빈으로 등록한다.


**2. @Autowired 의존관계 자동 주입**
<img src="/img/Spring_Core/Core-6_2.png" alt="주문 도메인" width="800" height="400"/>
- 생성자에 `@Autowired` 를 지정하면, 스프링 컨테이너가 자동으로 해당 스프링 빈을 찾아서 주입
	- `getBean(MemberRepository.class)` 와 동일하다고 이해하면 된다.
- 생성자에 파라미터가 많아도 다 찾아서 자동으로 주입.




### 탐색 위치와 기본 스캔 대상
- 탐색할 패키지의 시작 위치 지정할 수 있다.
```java
@ComponentScan(
         basePackages = "hello.core",
}
```
- `basePackages` : 탐색할 패키지의 시작 위치를 지정

**Error**
```error
org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'com.example.demo.service.MemberService' available
```
- 탐색 위치를 지정하지 않으면 `ComponentScan` 이 붙은 클래스의 패키지가 시작 위치가 된다.
- 탐색 위치가 맞지 않아 나온 오류코드

### 컴포넌트 스캔 기본 대상
컴포넌트 스캔은 `@Component` 뿐만 아니라 다음과 내용도 추가로 대상에 포함한다. 
- `@Component` : 컴포넌트 스캔에서 사용
- `@Controller` : 스프링 MVC 컨트롤러에서 사용
- `@Service` : 스프링 비즈니스 로직에서 사용
- `@Repository` : 스프링 데이터 접근 계층에서 사용 
- `@Configuration` : 스프링 설정 정보에서 사용


### 필터
- `includeFilters` : 컴포넌트 스캔 대상을 추가로 지정한다. 
- `excludeFilters` : 컴포넌트 스캔에서 제외할 대상을 지정한다.

#### 필터 만들기
**컴포넌트 스캔 대상에 추가할 애노테이션** 
```java
package hello.core.scan.filter;
import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
	public @interface MyIncludeComponent {
 }
```
**컴포넌트 스캔 대상에서 제외할 애노테이션** 
```java
package hello.core.scan.filter;
import java.lang.annotation.*;
 
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
	public @interface MyExcludeComponent {
 }
```

#### 필터 사용
**컴포넌트 스캔 대상에 추가할 클래스** 
```java
 package hello.core.scan.filter;
 @MyIncludeComponent
 public class BeanA {
}
```

**컴포넌트 스캔 대상에 제외할 클래스** 
```java
 package hello.core.scan.filter;
 @ MyExcludeComponent
 public class BeanB {
}
```

### FilterType 옵션 
FilterType은 5가지 옵션이 있다.
- ANNOTATION: 기본값, 애노테이션을 인식해서 동작한다
	- ex) `org.example.SomeAnnotation`
- ASSIGNABLE_TYPE: 지정한 타입과 자식 타입을 인식해서 동작한다. 
	- ex) `org.example.SomeClass`
- ASPECTJ: AspectJ 패턴 사용
	- ex) `org.example..*Service+`
- REGEX: 정규 표현식
	- ex) `org\.example\.Default.*`
- CUSTOM: `TypeFilter` 이라는 인터페이스를 구현해서 처리 
	- ex) `org.example.MyTypeFilter`

### 중복 등록과 충돌
컴포넌트 스캔에서 같은 이름을 등록하면 어떻게 될까?
두가지 상황이 있다.
1. 자동 빈 등록 vs 자동 빈 등록 
2. 수동 빈 등록 vs 자동 빈 등록

**1. 자동 빈 등록 vs 자동 빈 등록**
- 컴포넌트 스캔에 의해 자동으로 스프링 빈이 등록되는데, 그 이름이 같은 경우 스프링은 오류를 발생시킨다.
- `ConflictingBeanDefinitionException` 예외 발생

**2. 수동 빈 등록 vs 자동 빈 등록**
- 이 경우 수동 빈 등록이 우선권을 가진다. 
	- 수동 빈이 자동 빈을 오버라이딩 해버림.
- 보통은 여러 설정들이 꼬여서 나중에 애매한 오류가 발생한다
	- **정말 잡기 어려운 버그가 만들어진다.**



