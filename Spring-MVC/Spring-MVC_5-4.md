# HTTP 요청 파라미터
**클라이언트에서 서버로 요청 데이터를 전달할 때는 주로 다음 3가지 방법을 사용한다.** 

- **GET - 쿼리 파라미터**
	- /url? **username=hello&age=20**
	- 메시지 바디 없이, URL의 쿼리 파라미터에 데이터를 포함해서 전달
	- 예) 검색, 필터, 페이징등에서 많이 사용하는 방식
- **POST - HTML Form**
	- content-type: application/x-www-form-urlencoded
	- 메시지 바디에 쿼리 파리미터 형식으로 전달 username=hello&age=20
	- 예) 회원 가입, 상품 주문, HTML Form 사용
- **HTTP message body**에 데이터를 직접 담아서 요청
	- HTTP API에서 주로 사용, JSON, XML, TEXT 
	- 데이터 형식은 주로 JSON 사용
	- POST, PUT, PATCH

## 쿼리 파라미터, HTML Form
**RequestparamController**

- HttpServletRequest` 의 `request.getParameter()` 를 사용하면 다음 두가지 요청 파라미터를 조회할 수 있다.
**GET, 쿼리 파라미터 전송 예시**
- `http://localhost:8080/request-param?username=hello&age=20`

**POST, HTML Form 전송 예시** 
```
POST /request-param ...
 content-type: application/x-www-form-urlencoded
 username=hello&age=20
```

GET 쿼리 파리미터 전송 방식이든, POST HTML Form 전송 방식이든 둘다 형식이 같으므로 구분없이 조회할 수 있다. 이것을 간단히 요청 파라미터(request parameter) 조회라 한다.


```java
package hello.springmvc.basic.request;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Slf4j
@Controller
public class RequestparamController {
    @RequestMapping("/request-param-v1")
    public void requestParamV1(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username = request.getParameter("username");
        int age = Integer.parseInt(request.getParameter("age"));

        log.info("username = {}, age = {}",username, age);

        response.getWriter().write("ok");
    }
}
```
**hello-form.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <form action="/request-param-v1" method="post">
        username : <input type="text" name="username" />
        age : <input type="text" name="age" />
        <button type="submit">전송</button>
    </form>
</body>
</html>
```
**request.getParameter()**
여기서는 단순히 HttpServletRequest가 제공하는 방식으로 요청 파라미터를 조회했다.

**참고**
> `Jar` 를 사용하면 `webapp` 경로를 사용할 수 없다. 이제부터 정적 리소스도 클래스 경로에 함께 포함해야 한다.

## @RequestParam





## @ModelAttribute



