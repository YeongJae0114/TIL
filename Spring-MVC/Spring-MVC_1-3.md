## HttpServletResponse - 기본 사용법
**HttpServletResponse 역할**
- **HTTP 응답 메시지 생성** 
	- HTTP 응답코드 지정
	- 헤더 생성
	- 바디 생성
- **편의 기능 제공**
	- Content-Type, 쿠키, Redirect

**Content 편의 메서드**
```java
private void content(HttpServletResponse response) {
    //Content-Type: text/plain;charset=utf-8
    //Content-Length: 2
    //response.setHeader("Content-Type", "text/plain;charset=utf-8");
    response.setContentType("text/plain");
    response.setCharacterEncoding("utf-8");
    //response.setContentLength(2); //(생략시 자동 생성)
    }
```


**쿠키 편의 메서드**
```java
    private void cookie(HttpServletResponse response) {
        //Set-Cookie: myCookie=good; Max-Age=600;
        // response.setHeader("Set-Cookie", "myCookie=good; Max-Age=600");
        Cookie cookie = new Cookie("myCookie", "good");
        cookie.setMaxAge(600); //600초
        response.addCookie(cookie);
    }
```

**redirect 편의 메서드**
```java
private void redirect(HttpServletResponse response) throws IOException {
        //Status Code 302
        //Location: /basic/hello-form.html
        // response.setStatus(HttpServletResponse.SC_FOUND); //302

        //response.setHeader("Location", "/basic/hello-form.html");
        response.sendRedirect("/basic/hello-form.html");
    }
```
### HTTP 요청 데이터 - POST HTML Form

HttpServletResponse 클래스의 주요 메서드

|메서드|설명|
|------|---|
|setContentType(type)|문자열 형태의 type에 지정된 MIME Type으로 Content Type을 지정한다.|
|setHeader(name, value)|	문자열 name의 이름으로 문자열 value 값을 헤더로 설정한다.|
|setDateHeader(name, date)|	문자열 name의 이름으로 date에 설정된 밀리세컨드 시간 값을 헤더에 설정한다.|
|sendRedirect(url)|	클라이언트 요청을 다른 페이지로 보낸다.|


## HTTP 응답 데이터 - 단순 텍스트, HTML

```java
package hello.servlet.basic.response;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "responseHtmlServlet", urlPatterns = "/response-html")
public class ResponseHtmlServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        response.setCharacterEncoding("utf-8");

        PrintWriter writer = response.getWriter();
        writer.println("<html>");
        writer.println("<body>");
        writer.println(" <div>안녕?</div>");
        writer.println("</body>");
        writer.println("</html>");

    }
}

```
HTTP 응답으로 HTML을 반환할 때는 content-type을 `text/html` 로 지정해야 한다.

## HTTP 응답 데이터 - API JSON
```java
package hello.servlet.basic.response;

import com.fasterxml.jackson.databind.ObjectMapper;
import hello.servlet.basic.HelloData;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "responseJsonServlet", urlPatterns = "/response-json")
public class ResponseJsonServlet extends HttpServlet {

    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");

        HelloData helloData = new HelloData();
        helloData.setUsername("kim");
        helloData.setAge(20);

        String result = objectMapper.writeValueAsString(helloData);
        response.getWriter().write(result);

    }
}

```
HTTP 응답으로 JSON을 반환할 때는 content-type을 `application/json` 로 지정해야 한다.
Jackson 라이브러리가 제공하는 `objectMapper.writeValueAsString()` 를 사용하면 객체를 JSON 문자로 변경할 수 있다

