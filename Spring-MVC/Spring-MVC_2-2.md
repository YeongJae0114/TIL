## JSP로 회원 관리 웹 애플리케이션 만들기

**JSP 라이브러리 추가**
```java
// build.gradle에 추가 
implementation 'org.apache.tomcat.embed:tomcat-embed-jasper'
implementation 'jakarta.servlet:jakarta.servlet-api' //스프링부트 3.0 이상
implementation 'jakarta.servlet.jsp.jstl:jakarta.servlet.jsp.jstl-api' //스프링부트
3.0 이상
implementation 'org.glassfish.web:jakarta.servlet.jsp.jstl' //스프링부트 3.0 이상
```
**회원 등록 폼 JSP**
```java
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
 <html>
 <head>
     <title>Title</title>
 </head>
<body>
<form action="/jsp/members/save.jsp" method="post">
    username: <input type="text" name="username" />
    age: <input type="text" name="age" />
    <button type="submit">전송</button>
 </form>
 </body>
 </html>
```
- `<%@ page contentType="text/html;charset=UTF-8" language="java" %>` 
	- 첫 줄은 JSP문서라는 뜻이다. JSP 문서는 이렇게 시작한다.


**회원 저장 JSP**
```java
 <%@ page import="hello.servlet.domain.member.MemberRepository" %>
 <%@ page import="hello.servlet.domain.member.Member" %>
 <%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
    MemberRepository memberRepository = MemberRepository.getInstance();
    System.out.println("save.jsp");
    String username = request.getParameter("username");
    int age = Integer.parseInt(request.getParameter("age"));

    Member member = new Member(username, age);
    System.out.println("member = " + member);
    memberRepository.save(member);
%>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body> 성공
 <ul>
     <li>id=<%=member.getId()%></li>
     <li>username=<%=member.getUsername()%></li>
     <li>age=<%=member.getAge()%></li>
</ul>
<a href="/index.html">메인</a>
</body>
</html>

```
- 서블릿 코드와 비슷하지만, 다른 점은 html에 자바 코드가 들어가있는데 서블릿 보다는 편리함.
- `<%@ page import="hello.servlet.domain.member.MemberRepository" %>`
	- 자바의 import 문과 같다. 
- `<% ~~ %>`
	- 이 부분에는 자바 코드를 입력
- `<%= ~~ %>`
	- 이 부분에는 자바 코드를 출력


**회원 목록 JSP**
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
- 회원 리포지토리를 먼저 조회하고, 결과 List를 사용해서 중간에 `<tr><td>` HTML 태그를 반복해서 출력하고 있다.

## 서블릿과 JSP의 한계
```text
서블릿의 화면을 구성할 때는 자바코드에 HTML작업을 추가해 코드가 깔끔하지 않고 보기 불편했고 이를 보안한 JSP를 사용해 좀 더 가독성이 좋고 깔끔한 코드를 만들어 냈지만, 삽입한 JAVA 코드를 보면 데이터를 조회하는 리포지토리 등 다양한 코드가 모두 JSP에 노출되어 있다. JSP에 너무 많은 정보와 역할을 한다. 이는 유지보수에 큰 어려움을 준다. (이를 위한 MVC 패턴의 등장)
```
