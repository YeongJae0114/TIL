## 서블릿 종속성 제거 -v3

### v3 구조

<img src="/img/Spring_MVC/ControllerV3_1.png" alt="ControllerV3_1" width="500" height="300" />


**ModelView**
```java
package hello.servlet.web.frontcontroller;

import java.util.HashMap;
import java.util.Map;

public class ModelView {
	 private String viewName;
     private Map<String, Object> model = new HashMap<>();
     public ModelView(String viewName) {
         this.viewName = viewName;
}
     public String getViewName() {
         return viewName;
}
     public void setViewName(String viewName) {
         this.viewName = viewName;
}
     public Map<String, Object> getModel() {
         return model;
}
     public void setModel(Map<String, Object> model) {
         this.model = model;
}
    }
```
- lombok 사용 가능


**ControllerV3**
```java
package hello.servlet.web.frontcontroller.v3;

import hello.servlet.web.frontcontroller.ModelView;

import java.util.Map;

public interface ControllerV3 {
    ModelView process(Map<String, String> paramMap);
}

```
- 컨트롤러에서 서블릿 기술을 전혀 사용하지 않는다.
- HttpServletRequest가 제공하는 파라미터는 프론트 컨트롤러가 paramMap에 담아서 호출 
- 응답 결과로 뷰 이름과 뷰에 전달할 Model 데이터를 포함하는 ModelView 객체를 반환

**MemberFormControllerV3**
```java
package hello.servlet.web.frontcontroller.v3.controller;

import hello.servlet.web.frontcontroller.ModelView;
import hello.servlet.web.frontcontroller.v3.ControllerV3;

import java.util.Map;

public class MemberFormControllerV3 implements ControllerV3 {
    @Override
    public ModelView process(Map<String, String> paramMap) {

        return new ModelView("new-form");
    }
}
```
- `ModelView` 를 생성할 때 `new-form` 이라는 view의 논리적인 이름을 지정한다. 실제 물리적인 이름은 프론트 컨트 롤러에서 처리

**MemberSaveControllerV3**
```java
package hello.servlet.web.frontcontroller.v3.controller;

import hello.servlet.domain.member.Member;
import hello.servlet.domain.member.MemberRepository;
import hello.servlet.web.frontcontroller.ModelView;
import hello.servlet.web.frontcontroller.v3.ControllerV3;

import javax.sound.midi.MetaMessage;
import java.util.Map;

public class MemberSaveControllerV3 implements ControllerV3 {
    private MemberRepository memberRepository = MemberRepository.getInstance();

    @Override
    public ModelView process(Map<String, String> paramMap) {
        String username = paramMap.get("username");
        int age = Integer.parseInt(paramMap.get("age"));

        Member member = new Member(username, age);
        memberRepository.save(member);

        ModelView mv = new ModelView("save-result");
        mv.getModel().put("member",member);
        return mv;
    }
}
```
- `paramMap.get("username");`
	- 파라미터 정보는 map에 담겨있다. map에서 필요한 요청 파라미터를 조회하면 된다.
- `mv.getModel().put("member", member);`
	- 모델은 단순한 map이므로 모델에 뷰에서 필요한 `member` 객체를 담고 반환한다.

**MemberListControllerV3**
```java
package hello.servlet.web.frontcontroller.v3.controller;

import hello.servlet.domain.member.Member;
import hello.servlet.domain.member.MemberRepository;
import hello.servlet.web.frontcontroller.ModelView;
import hello.servlet.web.frontcontroller.v3.ControllerV3;

import java.util.List;
import java.util.Map;

public class MemberListControllerV3 implements ControllerV3 {
    MemberRepository memberRepository = MemberRepository.getInstance();
    @Override
    public ModelView process(Map<String, String> paramMap) {
        List<Member> members= memberRepository.findAll();
        ModelView mv = new ModelView("members");
        mv.getModel().put("members",members);

        return mv;
    }
}

```

**FrontControllerServletV3**
```java
package hello.servlet.web.frontcontroller.v3;
import hello.servlet.web.frontcontroller.MyView;
import hello.servlet.web.frontcontroller.ModelView;

import hello.servlet.web.frontcontroller.v3.controller.MemberFormControllerV3;
import hello.servlet.web.frontcontroller.v3.controller.MemberListControllerV3;
import hello.servlet.web.frontcontroller.v3.controller.MemberSaveControllerV3;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "frontControllerServletV3", urlPatterns = "/front-controller/v3/*")
public class FrontControllerServletV3 extends HttpServlet {
    private Map<String, ControllerV3> controllerV3Map = new HashMap<>();

    public FrontControllerServletV3(){
        controllerV3Map.put("/front-controller/v3/members/new-form",new MemberFormControllerV3());
        controllerV3Map.put("/front-controller/v3/members/save",new MemberSaveControllerV3());
        controllerV3Map.put("/front-controller/v3/members",new MemberListControllerV3());
    }

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 요청 url의 controller
        String requestURI = request.getRequestURI();
        ControllerV3 controller = controllerV3Map.get(requestURI);

        if (controller == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        Map<String, String>paramMap = createParamMap(request);
        ModelView mv = controller.process(paramMap);

        String viewName = mv.getViewname();
        MyView view = viewResolver(viewName);
        view.render(mv.getModel(),request,response);
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
**viewResolver**
- 컨트롤러가 반환한 논리 뷰 이름을 실제 물리 뷰 경로로 변경
	- 실제 물리 경로가 있는 MyView 객체를 반환 한다.
- 논리 뷰 이름: `members`
- 물리 뷰 경로: `/WEB-INF/views/members.jsp`

- `view.render(mv.getModel(), request, response)`
	- 뷰 객체를 통해서 HTML 화면을 렌더링 한다.
	- 뷰 객체의 `render()` 는 모델 정보도 함께 받는다.
	- JSP는 `request.getAttribute()` 로 데이터를 조회하기 때문에, 모델의 데이터를 꺼내서
	- `request.setAttribute()` 로 담아둔다. JSP로 포워드 해서 JSP를 렌더링 한다.

**MyView 수정**
```java
package hello.servlet.web.frontcontroller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

public class MyView {
    private String viewPath;

    public MyView(String viewPath){
        this.viewPath = viewPath;
    }


    public void render(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
        dispatcher.forward(request,response);
    }

    public void render(Map<String,Object>model, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        modelToRequestAttribute(model,request);
        RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
        dispatcher.forward(request,response);
    }
    private void modelToRequestAttribute(Map<String, Object>model, HttpServletRequest request){
        model.forEach((key, value) -> request.setAttribute(key,value));
    }
}

```







