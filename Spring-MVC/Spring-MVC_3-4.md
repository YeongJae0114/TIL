## 실용적인 컨트롤러 -v4

### v4 구조

<img src="/img/Spring_MVC/ControllerV4_1.png" alt="ControllerV3_1" width="500" height="300" />



**ControllerV4**
```java
package hello.servlet.web.frontcontroller.v4;

import java.util.Map;

public interface ControllerV4 {
    String process(Map<String, String>paramMap, Map<String, Object> model);
}

```


**MemberFormControllerV4**
```java
package hello.servlet.web.frontcontroller.v4.controller;

import hello.servlet.web.frontcontroller.v4.ControllerV4;

import java.util.Map;

public class MemberFormControllerV4 implements ControllerV4 {
    @Override
    public String process(Map<String, String> paramMap, Map<String, Object> model) {
        return "new-form";
    }
}

```
- v3 와는 다르게 ModelView 객체가 아닌 뷰의 논리 이름만 반환

**MemberSaveControllerV4**
```java
package hello.servlet.web.frontcontroller.v4.controller;

import hello.servlet.domain.member.Member;
import hello.servlet.domain.member.MemberRepository;
import hello.servlet.web.frontcontroller.v4.ControllerV4;

import java.util.Map;

public class MemberSaveControllerV4 implements ControllerV4 {
    private MemberRepository memberRepository = MemberRepository.getInstance();

    @Override
    public String process(Map<String, String> paramMap, Map<String, Object> model) {
        String username = paramMap.get("username");
        int age = Integer.parseInt(paramMap.get("age"));

        Member member = new Member(username, age);
        memberRepository.save(member);

        model.put("member", member);
        return "save-result";
    }
}

```
- `model.put("member", member)` : 모델이 파라미터로 전달되기 때문에, 모델을 직접 생성하지 않아도 된다.

**MemberListControllerV4**
```java
package hello.servlet.web.frontcontroller.v4.controller;

import hello.servlet.domain.member.Member;
import hello.servlet.domain.member.MemberRepository;
import hello.servlet.web.frontcontroller.v4.ControllerV4;

import java.util.List;
import java.util.Map;

public class MemberListControllerV4 implements ControllerV4 {
    private MemberRepository memberRepository = MemberRepository.getInstance();
    @Override
    public String process(Map<String, String> paramMap, Map<String, Object> model) {
        List<Member> members = memberRepository.findAll();

        model.put("members",members);
        return "members";
    }
}
```

**FrontControllerServletV4**
```java
package hello.servlet.web.frontcontroller.v4;


import hello.servlet.web.frontcontroller.MyView;

import hello.servlet.web.frontcontroller.v4.controller.MemberFormControllerV4;
import hello.servlet.web.frontcontroller.v4.controller.MemberListControllerV4;
import hello.servlet.web.frontcontroller.v4.controller.MemberSaveControllerV4;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "frontControllerServletV4", urlPatterns = "/front-controller/v4/*")
public class FrontControllerServletV4 extends HttpServlet {
    private Map<String, ControllerV4> controllerV4Map = new HashMap<>();

    public FrontControllerServletV4(){
        controllerV4Map.put("/front-controller/v4/members/new-form",new MemberFormControllerV4());
        controllerV4Map.put("/front-controller/v4/members/save",new MemberSaveControllerV4());
        controllerV4Map.put("/front-controller/v4/members",new MemberListControllerV4());
    }

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 요청 url의 controller
        String requestURI = request.getRequestURI();
        ControllerV4 controller = controllerV4Map.get(requestURI);

        if (controller == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        Map<String, String>paramMap = createParamMap(request);
        Map<String, Object> model = new HashMap<>();
        String viewName = controller.process(paramMap, model);

        MyView view = viewResolver(viewName);
        view.render(model,request,response);
    }
    private Map<String, String> createParamMap(HttpServletRequest request){
        Map<String, String> paramMap = new HashMap<>();
        request.getParameterNames().asIterator()
                .forEachRemaining(paramName -> paramMap.put(paramName,
                        request.getParameter(paramName)));
        return paramMap;
    }
    private MyView viewResolver(String viewName){
        return new MyView("/WEB-INF/views/"+viewName+".jsp");
    }
}
```


**모델 객체 전달**
- `Map<String, Object> model = new HashMap<>(); //추가`
	- 모델 객체를 프론트 컨트롤러에서 생성해서 넘겨준다. 
	- 컨트롤러에서 모델 객체에 값을 담으면 여기에 그대로 담겨있게 된다.


**뷰의 논리 이름을 직접 반환** 
```java
 String viewName = controller.process(paramMap, model);
 MyView view = viewResolver(viewName);
```
- 컨트롤로가 직접 뷰의 논리 이름을 반환하므로 이 값을 사용해서 실제 물리 뷰를 찾을 수 있다.







