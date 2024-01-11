## 스프링 MVC - 시작하기

> **@RequestMapping**
스프링은 애노테이션을 활용한 매우 유연하고, 실용적인 컨트롤러를 만들었는데 이것이 바로 `@RequestMapping` 애 노테이션을 사용하는 컨트롤러이다. 다들 한번쯤 사용해보았을 것이다.
여담이지만 과거에는 스프링 프레임워크가 MVC 부분이 약해서 스프링을 사용하더라도 MVC 웹 기술은 스트럿츠 같은 다른 프레임워크를 사용했었다. 그런데 `@RequestMapping` 기반의 애노테이션 컨트롤러가 등장하면서, MVC 부분도 스프링의 완승으로 끝이 났다.

> `@RequestMapping` `RequestMappingHandlerMapping` `RequestMappingHandlerAdapter`
앞서 보았듯이 가장 우선순위가 높은 핸들러 매핑과 핸들러 어댑터는 `RequestMappingHandlerMapping` , `RequestMappingHandlerAdapter` 이다.
`@RequestMapping` 의 앞글자를 따서 만든 이름인데, 이것이 바로 지금 스프링에서 주로 사용하는 애노테이션 기반의
컨트롤러를 지원하는 핸들러 매핑과 어댑터이다. **실무에서는 99.9% 이 방식의 컨트롤러를 사용**한다.

**SpringMemberFormControllerV1 - 회원 등록 폼**
```java
package hello.servlet.web.springmvc.v1;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class SpringMemberFromControllerV1 {

    @RequestMapping("/springmvc/v1/members/new-form")
    public ModelAndView process(){
        return new ModelAndView("new-form");
    }

}
```
- `Controller` : 
	- 스프링이 자동으로 스프링 빈으로 등록
	- 스프링 MVC에서 애노테이션 기반 컨트롤러로 인식
- `@RequestMapping` : 요청 정보를 매핑
	- 해당 URL이 호출되면 이 메서드가 호출된다. 애노테이션을 기반으로 동작하기 때문에, 메서드의 이름은 임의로 지정
- ModelAndView` : 모델과 뷰 정보를 담아서 반환

*물론 컴포넌스 스캔 없이 다음과 같이 스프링 빈으로 직접 등록해도 동작*
```java
@RequestMapping
 public class SpringMemberFormControllerV1 {
     @RequestMapping("/springmvc/v1/members/new-form")
     public ModelAndView process() {
         return new ModelAndView("new-form");
     }
}
```


**SpringMemberSaveControllerV1 - 회원 저장**
```java
package hello.servlet.web.springmvc.v1;

import hello.servlet.domain.member.Member;
import hello.servlet.domain.member.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class SpringMemberSaveControllerV1 {
    private MemberRepository memberRepository = MemberRepository.getInstance();
    @RequestMapping("/springmvc/v1/members/save")
    public ModelAndView process(HttpServletRequest request, HttpServletResponse response){
        String username = request.getParameter("username");
        int age = Integer.parseInt(request.getParameter("age"));

        Member member = new Member(username, age);
        memberRepository.save(member);

        ModelAndView mv = new ModelAndView("save-result");
        mv.addObject("member",member);

        return mv;
    }
}
```
- `mv.addObject("member", member)`
	- 스프링이 제공하는 `ModelAndView` 를 통해 Model 데이터를 추가할 때는 `addObject()` 를 사용하면 된다. 이 데이터는 이후 뷰를 렌더링 할 때 사용된다.

**SpringMemberListControllerV1 - 회원 목록**
```java
package hello.servlet.web.springmvc.v1;
import hello.servlet.domain.member.Member;
import hello.servlet.domain.member.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class SpringMemberListControllerV1 {
    private MemberRepository memberRepository = MemberRepository.getInstance();

    @RequestMapping("/springmvc/v1/members")
    public ModelAndView process(HttpServletRequest request, HttpServletResponse response){
        List<Member> members = memberRepository.findAll();

        ModelAndView mv = new ModelAndView("members");
        mv.addObject("members",members);

        return mv;
    }
}
```



