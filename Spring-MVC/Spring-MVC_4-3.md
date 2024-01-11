## 스프링 MVC - 컨트롤러 통합

> `@RequestMapping` 을 잘 보면 클래스 단위가 아니라 메서드 단위에 적용된 것을 확인할 수 있다. 따라서 컨트롤러 클래스를 유연하게 하나로 통합할 수 있다.

**SpringMemberControllerV2 - 컨트롤러 통합**
```java
package hello.servlet.web.springmvc.v2;

import hello.servlet.domain.member.Member;
import hello.servlet.domain.member.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping("/springmvc/v2/members")

public class SpringMemberControllerV2 {
    @RequestMapping("/new-form")
    public ModelAndView newForm(){
        return new ModelAndView("new-form");
    }

    private MemberRepository memberRepository = MemberRepository.getInstance();
    @RequestMapping("/save")
    public ModelAndView save(HttpServletRequest request, HttpServletResponse response){
        String username = request.getParameter("username");
        int age = Integer.parseInt(request.getParameter("age"));

        Member member = new Member(username, age);
        memberRepository.save(member);

        ModelAndView mv = new ModelAndView("save-result");
        mv.addObject("member",member);

        return mv;
    }
    @RequestMapping
    public ModelAndView members(HttpServletRequest request, HttpServletResponse response){
        List<Member> members = memberRepository.findAll();

        ModelAndView mv = new ModelAndView("members");
        mv.addObject("members",members);

        return mv;
    }
}

```
**조합**
- 컨트롤러 클래스를 통합하는 것을 넘어서 조합도 가능하다.
- 다음 코드는 `/springmvc/v2/members` 라는 부분에 중복이 있다.
	- `@RequestMapping("/springmvc/v2/members/new-form")` 	- `@RequestMapping("/springmvc/v2/members")`
	- `@RequestMapping("/springmvc/v2/members/save")`


