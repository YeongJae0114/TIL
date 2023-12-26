# Servrit(서블릿)

## 서블릿이란?
- http 스펙을 쉽게 사용 가능하게 해주는 도구
<img src="img/Spring_MVC/Servlet.png" alt="Servlet" width="500" height="300" />

### 서블릿 컨테이너 동작 방식
- 스프링 부트가 실행되면, 내장 톰캣 서버가 실행
- 톰캣 서버는 서블릿 컨테이너를 통해서 서블릿을 생성

**요청, 응답 메시지** 
`localhost:8080/hello`로 요청이 오면
- http 요청 메시지를 기반으로 톰캣 서버에서 request, response 객체가 생성되고
- request, response를 서블릿 컨테이너에서 실행 
- 가공한 response를 반환


## HttpServletRequest - 개요
- 요청 메시지를 편리하게 사용할 수 있도록 개발자 대신 HTTP 요청 메시지를 파싱
- `HttpServletRequest` 객체에 담아서 제공
### HTTP 요청 메시지 
```text
POST /save HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
username=kim&age=20
``` 
### 임시 저장소 기능
- 해당 HTTP 요청이 시작부터 끝날 때 까지 유지되는 임시 저장소 기능 저장: 	- `request.setAttribute(name, value)`
	- 조회: `request.getAttribute(name)`


### 세션 관리 기능
- `request.getSession(create: true)`
- 로그인 유지 

## HttpServletRequest - 사용법
```text
HttpServlet 클래스에서 사용자 요청을 처리하는 doGet/doPost 메서드는 모두 HttpServletRequest와 HttpServletResponse 객체를 매개변수로 가지고 있다.
```
- `@WebServlet`으로 어노테이션으로 등록
- `extends HttpServlet` HttpServlet

**HttpServletRequest클래스의 주요 메서드**

|메서드|설명|
|------|---|
|getParameterNames()|현재 요청에 포함된 매개변수 이름을 열거 형태로 넘겨준다.|
|getParameter(name)|문자열 name과 같은 이름을 가진 매개변수 값을 가져온다.|
|getParameterValues(name)|문자열 name과 같은 이름을 가진 매개변수 값을 배열 형태로 가져온다.( 주로 checkbox, mutilple list 등에 사용 )|
|getCookies()|모든 쿠키 값을 javax.servlet.http.Cookie의 배열 형태로 가져온다.|
|getMethod()|현재 요청이 Get인지, Post인지 파악해서 가져온다.|
|getSession()|현재 세션 객체를 가져온다.|
|getRemoteAddr()|클라이언트의 IP 주소를 알려준다.|
|getProtocol()|현재 서버의 프로토콜을 문자열 형태로 알려준다.|
|setCharacterEncoding()|현재 JSP로 전달되는 내용을 지정한 캐리터셋을로 변환해 준다.|                                HTML 폼에서 한글을 입력할 때 정상적으로 처리하려면 반드시 필요하다.|
|getAttribute(name)	|''|
|setAttribute(null, null)|	''|
 

### HTTP 요청 데이터 - 개요
- 서버로 데이터를 전달하는 방법
- **다음 3 가지 방법을 사용**

- **GET -쿼리 파라미터**
	- /url**?username=hello&age=20**
	- 메시지 바디 없이, URL의 쿼리 파라미터에 데이터를 포함해서 전달 
	- 예) 검색, 필터, 페이징등에서 많이 사용하는 방식
- **POST - HTML Form**
	- content-type: application/x-www-form-urlencoded
   	- 메시지 바디에 쿼리 파리미터 형식으로 전달 username=hello&age=20
	- 예) 회원 가입, 상품 주문, HTML Form 사용 
- **HTTP message body**에 데이터를 직접 담아서 요청 
	- HTTP API에서 주로 사용, JSON, XML, TEXT
		- 데이터 형식은 주로 JSON 사용 POST, PUT, PATCH

### HTML Form 데이터 전송





### HTTP 요청 데이터 - GET 쿼리 파라미터 
```java
package hello.servlet.basic.request;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
// http://localhost:8080/request-param?username=hello&age=20
@WebServlet(name = "requestParamServlet", urlPatterns = "/request-param")
public class RequestParamServlet  extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("전체 파라미터 조회 - start");

        request.getParameterNames().asIterator()
                        .forEachRemaining(paraName -> System.out.println("ParamName = " + paraName + "="+request.getParameter(paraName)));

        System.out.println("[전체 파라미터 조회] - end");
        System.out.println();
        System.out.println("[단일 파라미터 조회] ");
        String username = request.getParameter("username");
        String age = request.getParameter("age");
        System.out.println("username : "+ username + "age : "+age) ;
        System.out.println();

        System.out.println("[이름이 같은 복수 파라미터 조회]");
        String[] usernames = request.getParameterValues("username");
        for(String name : usernames){
            System.out.println("username : "+ name);
        }
        response.getWriter().write("ok");
    }
}

```

## HTTP 요청 데이터 - POST HTML Form
- 이번에는 HTML의 Form을 사용해서 클라이언트에서 서버로 데이터를 전송해보자.
- 주로 회원 가입, 상품 주문 등에서 사용하는 방식이다. 
**특징**
- content-type: `application/x-www-form-urlencoded`
- 메시지 바디에 쿼리 파리미터 형식으로 데이터를 전달한다. `username=hello&age=20`

```text
**참고**
content-type은 HTTP 메시지 바디의 데이터 형식을 지정한다.
**GET URL 쿼리 파라미터 형식**으로 클라이언트에서 서버로 데이터를 전달할 때는 HTTP 메시지 바디를 사용하 지 않기 때문에 content-type이 없다.
**POST HTML Form 형식**으로 데이터를 전달하면 HTTP 메시지 바디에 해당 데이터를 포함해서 보내기 때문에 바디에 포함된 데이터가 어떤 형식인지 content-type을 꼭 지정해야 한다. 이렇게 폼으로 데이터를 전송하는 형 식을 `application/x-www-form-urlencoded` 라 한다.
```
- **`request.getParameter()` 는 GET URL 쿼리 파라미터 형식도 지원하고, POST HTML Form 형식도 둘 다 지원한다.**


 
