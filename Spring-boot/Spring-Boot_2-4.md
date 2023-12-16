## 스프링 빈과 의존관계

### 1.컴포넌트 스캔과 자동 의존관계 설정

**MemberController**
- 회원 컨트롤러에 의존관계 추가
```java
package hello.hellospring.controller;

import hello.hellospring.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class MemberController {
    
    private final MemberService memberService;
    
    @Autowired
    public MemberController(MemberService memberService){
        this.memberService = memberService;
    }
    
}

```
**스프링 빈이란?**
```text 
빈(Bean)은 스프링 컨테이너에 의해 관리되는 재사용 가능한 소프트웨어 컴포넌트이다.즉, 스프링 컨테이너가 관리하는 자바 객체를 뜻하며, 하나 이상의 빈(Bean)을 관리한다.
```

- 생성자에 @Autowired가 있으면 스프링이 연관된 객체를 스프링 컨테이너에서 찾아가서 넣어준다.
	- 이렇게 객체 의존관계를 외부에서 넣어주는 것을 DI(Dependency Injection), `의존성 주입`이라고 한다. 
- 이전엔 개발자가 직접 주입했고, 여기서는 @Autowired에 의해 스프링이 주입해준다.

**회원 서비스 스프링 빈 등록**
- 
```java
package hello.hellospring.service;

import hello.hellospring.domain.Member;
import hello.hellospring.repositort.MemberRepository;
import hello.hellospring.repositort.MemoryMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    @Autowired
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
}

```
- @Service : MemberService도 스프링 빈으로 등록

**회원 리포지토리 스프링 빈 등록**
- 
```java
package hello.hellospring.repositort;
import hello.hellospring.domain.Member;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class MemoryMemberRepository implements MemberRepository {

}

```
- @ Repository : MemoryMemberRepository도 스프링 빈으로 등록

### 2.자바코드로 직접 스프링 빈 등록
- 회원 서비스와 회원 리포지토리의 @Service, @Repository, @Autowired 애노테이션을 제거하고 진행

```java
package hello.hellospring;

import hello.hellospring.repositort.MemberRepository;
import hello.hellospring.repositort.MemoryMemberRepository;
import hello.hellospring.service.MemberService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringConfig {
    @Bean
    public MemberService memberService(){
        return new MemberService(memberRepository());
    }
    @Bean
    public MemberRepository memberRepository(){
        return new MemoryMemberRepository();
    }
}

```
- 실무에서는 주로 정형화된 컨트롤러, 서비스, 리포지토리 같은 코드는 컴포넌트 스캔을 사용
- 정형화 되지 않거나, 상황에 따라 구현 클래스를 변경해야 하면 설정을 통해 스프링 빈으로 등록
- 주의: `@Autowired` 를 통한 DI는 `helloController` , `memberService` 등과 같이 스프링이 관리하는 객체 에서만 동작한다. 스프링 빈으로 등록하지 않고 내가 직접 생성한 객체에서는 동작하지 않는다.










