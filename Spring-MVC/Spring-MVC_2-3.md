## MVC 패턴
**변경의 라이프 사이클**
>문제는 둘 사이에 변경의 라이프 사이클이 다르다는 점이다. 예를 들어서 UI를 일부 수정 하는 일과 비즈니스 로직을 수정하는 일은 각각 다르게 발생할 가능성이 매우 높고 대부분 서로에게 영향을 주지 않는 다. 이렇게 변경의 라이프 사이클이 다른 부분을 하나의 코드로 관리하는 것은 유지보수하기 좋지 않다. (물론 UI가 많 이 변하면 함께 변경될 가능성도 있다.)

### Model
- 뷰에 출력할 데이터를 담아둔다. 
- 뷰가 필요한 데이터를 모두 모델에 담아서 전달해주는 덕분에 뷰는 비즈니스 로 직이나 데이터 접근을 몰라도 되고, 화면을 렌더링 하는 일에 집중할 수 있다.

### View
- 모델에 담겨있는 데이터를 사용해서 화면을 그리는 일에 집중
- HTML을 생성하는 부분을 말한다.

### Controller
- HTTP 요청을 받아서 파라미터를 검증하고, 비즈니스 로직을 실행
- 뷰에 전달할 결과 데이터를 조회해서 모델에 담는다.

## MVC 패턴 적용



>서블릿을 컨트롤러로 사용하고, JSP를 뷰로 사용해서 MVC 패턴을 적용해보자. Model은 HttpServletRequest 객체를 사용한다. request는 내부에 데이터 저장소를 가지고 있는데, `request.setAttribute()` , `request.getAttribute()` 를 사용하면 데이터를 보관하고, 조회할 수 있다.


**회원 등록 폼(Controller)**
**MvcMemberFormServlet`**
```java
package hello.servlet.web.servletmvc;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "mvcMembersFormServlet", urlPatterns = "/servlet-mvc/members/new-form")
public class MvcMembersFormServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String viewPath = "/WEB-INF/views/new-form.jsp";
        RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
        dispatcher.forward(request,response);
    }
}
```
- `dispatcher.forward()` : 다른 서블릿이나 JSP로 이동할 수 있는 기능이다. 
	- 서버 내부에서 다시 호출이 발생한다.
- `/WEB-INF`
	- 이 경로안에 JSP가 있으면 외부에서 직접 JSP를 호출할 수 없다. 우리가 기대하는 것은 항상 컨트롤러를 통해서 JSP를 호출

- **redirect vs forward**
>리다이렉트는 실제 클라이언트(웹 브라우저)에 응답이 나갔다가, 클라이언트가 redirect 경로로 다시 요청한다. 따라서 클라이언트가 인지할 수 있고, URL 경로도 실제로 변경된다. 반면에 포워드는 서버 내부에서 일어나는 호 출이기 때문에 클라이언트가 전혀 인지하지 못한다.


**회원 등록 폼(Views)**
`main/webapp/WEB-INF/views/new-form.jsp`
```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<!-- 상대경로 사용, [현재 URL이 속한 계층 경로 + /save] -->
<form action="save" method="post">
    username: <input type="text" name="username" />
    age: <input type="text" name="age" />
    <button type="submit">전송</button>
</form>
</body>
</html>
```
- 상대 경로 사용 `action="save"`
	- 현재 계층 경로: `/servlet-mvc/members/`
	- 결과: `/servlet-mvc/members/save`

--- 

**회원 저장 (Controller)**
**MvcMemberSaveServlet**
```java
package hello.servlet.web.servletmvc;

import hello.servlet.domain.member.Member;
import hello.servlet.domain.member.MemberRepository;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


import java.io.IOException;

@WebServlet(name = "mvcMembersSaveServlet", urlPatterns = "/servlet-mvc/members/save")
public class MvcMembersSaveServlet extends HttpServlet {

    private MemberRepository memberRepository = MemberRepository.getInstance();
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        int age = Integer.parseInt(request.getParameter("age"));

        Member member = new Member(username, age);
        memberRepository.save(member);

        // Model에 데이터 저장
        request.setAttribute("member",member);

        String viewPath = "/WEB-INF/views/save-result.jsp";
        RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
        dispatcher.forward(request, response);
    }
}
```
- HttpServletRequest를 Model로 사용한다.
- request가 제공하는 `setAttribute()` 를 사용하면 request 객체에 데이터를 보관해서 뷰에 전달할 수 있다. 
- 뷰는 `request.getAttribute()` 를 사용해서 데이터를 꺼내면 된다.



**회원 저장 폼(Views)**
`main/webapp/WEB-INF/views/save-result.jsp`
```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body> 성공 <ul>
    <li>id=${member.id}</li>
    <li>username=${member.username}</li>
    <li>age=${member.age}</li>
</ul>
<a href="/index.html">메인</a>
</body>
</html>
```
- `<%= request.getAttribute("member")%>` 로 모델에 저장한 member 객체를 꺼낼 수 있다(너무 복잡)
- JSP는 `${}` 문법을 제공
	- 이 문법을 사용하면 request의 attribute에 담긴 데이터를 편리하게 조회할 수 있다.  


>**MVC 덕분에 컨트롤러 로직과 뷰 로직을 확실하게 분리한 것을 확인할 수 있다. 향후 화면에 수정이 발생하면 뷰 로직만 변경하면 된다.**

---

**회원 목록 조회(Controller)**
**MvcMemberListServlet**
```java
package hello.servlet.web.servletmvc;

import hello.servlet.domain.member.Member;
import hello.servlet.domain.member.MemberRepository;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(name = "mvcMembersListServlet", urlPatterns = "/servlet-mvc/members")
public class MvcMembersListServlet extends HttpServlet {
    private MemberRepository memberRepository = MemberRepository.getInstance();
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Member> members = memberRepository.findAll();

        request.setAttribute("members",members);

        String viewPath = "/WEB-INF/views/members.jsp";
        RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
        dispatcher.forward(request, response);
    }
}
```
- request 객체를 사용해서 `List<Member> members` 를 모델에 보관

**회원 목록 조회(Views)**
`main/webapp/WEB-INF/views/members.jsp`
```java
<%@ page import="hello.servlet.domain.member.MemberRepository" %>
<%@ page import="java.util.List" %>
<%@ page import="hello.servlet.domain.member.Member" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    MemberRepository memberRepository = MemberRepository.getInstance();
    List<Member> members = memberRepository.findAll();
%>

<html>
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<a href="/index.html">메인</a> <table>
    <thead>
    <th>id</th>
    <th>username</th>
    <th>age</th>
    </thead>
    <tbody>
        <%
    for (Member member : members) {
        out.write("<tr>");
        out.write("    <td>" + member.getId() + "</td>");
        out.write("    <td>" + member.getUsername() + "</td>");
        out.write("    <td>" + member.getAge() + "</td>");
        out.write("</tr>");
    } %>
    </tbody>
</table>
</body>
</html>
```
- `<c:forEach>` 기능
	- `<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>` 선언
 

