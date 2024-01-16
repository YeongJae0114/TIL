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
스프링이 제공하는 `@RequestParam` 을 사용하면 요청 파라미터를 매우 편리하게 사용할 수 있다.
**requestParamV2**
```java
 @ResponseBody
    @RequestMapping("/request-param-v2")
    public String requestParamV2(
            @RequestParam("username") String memberName,
            @RequestParam("age") int memberAge){

        log.info("username = {}, age = {}",memberName, memberAge);
        return "ok";
    }
```
- `@RequestParam` : 파라미터 이름으로 바인딩
- `@ResponseBody` : View 조회를 무시하고, HTTP message body에 직접 해당 내용 입력

- **@RequestParam**의 `name(value)` 속성이 파라미터 이름으로 사용 
	- @RequestParam("**username**") String **memberName**
	- request.getParameter("**username**")

**requestParamV3**
```java
    @ResponseBody
    @RequestMapping("/request-param-v3")
    public String requestParamV3(
            @RequestParam String username,
            @RequestParam int age){

        log.info("username = {}, age = {}",username, age);
        return "ok";
    }
```
- HTTP 파라미터 이름이 변수 이름과 같으면 `@RequestParam(name="xx")` 생략 가능

**requestParamV4**
```java
    @ResponseBody
    @RequestMapping("/request-param-v4")
    public String requestParamV4(
             String username,
             int age){

        log.info("username = {}, age = {}",username, age);
        return "ok";
    }
```
- `String` , `int` , `Integer` 등의 단순 타입이면 `@RequestParam` 도 생략 가능
- 그러나 애노테이션을 너무 생략하면 가독성이 떨어지는 문제가 발생할 수 있다. 

**파라미터 필수 여부 - requestParamRequiered**
```java
    @ResponseBody
    @RequestMapping("/request-param-requiered")
    public String requestParamRequiered(
            @RequestParam(required = true) String username,
            @RequestParam(required = false) Integer age){
        log.info("username = {}, age = {}",username, age);
        return "ok";
    }
```
- `@RequestParam.required`
	- 파라미터 필수 여부 : 파라미터 이름만 있고 값이 없는 경우(빈문자로 통과)를 주의해야함
	- 기본값이 파라미터 필수( `true` )이다.
- `/request-param-required` 요청
	- `username` 이 없으므로 400 예외가 발생
**주의! - 기본형(primitive)에 null 입력**
	- `/request-param` 요청 
	- `@RequestParam(required = false) int age`

>`null` 을 `int` 에 입력하는 것은 불가능(500 예외 발생) 따라서 `null` 을 받을 수 있는 `Integer` 로 변경하거나, 또는 다음에 나오는 `defaultValue` 사용


**기본 값 적용 - requestParamDefault**
```java
    @ResponseBody
    @RequestMapping("/request-param-default")
    public String requestParamDefault(
            @RequestParam(defaultValue = "guest") String username,
            @RequestParam(defaultValue = "-1") Integer age){
        log.info("username = {}, age = {}",username, age);
        return "ok";
    }
```
- 파라미터에 값이 없는 경우 `defaultValue` 를 사용하면 기본 값을 적용
	- `defaultValue` 는 빈 문자의 경우에도 설정한 기본 값이 적용
- 이미 기본 값이 있기 때문에 `required` 는 의미가 없다.

**파라미터를 Map으로 조회하기 - requestParamMap**
```java
    @ResponseBody
    @RequestMapping("/request-param-map")
    public String requestParamMap(
            @RequestParam Map<String, Object> paramMap) {
        log.info("username = {}, age = {}",paramMap.get("username"), paramMap.get("age"));
        return "ok";
    }
```
- 파라미터를 Map, MultiValueMap으로 조회할 수 있다.

## @ModelAttribute

**HelloData**
```java
package hello.springmvc.basic;

import lombok.Data;

@Data
public class HelloData {
    private String username;
    private int age;

}
```

**@ModelAttribute 적용 - modelAttributeV1**
```java
    @ResponseBody
    @RequestMapping("/model-attribute-v1")
    public String modelAttributeV1(@ModelAttribute HelloData helloData){
        log.info("username = {}, age = {}",helloData.getUsername(),helloData.getAge());
        return "ok";
    }
```

**@ModelAttribute 생략 - modelAttributeV2**
```java
    @ResponseBody
    @RequestMapping("/model-attribute-v2")
    public String modelAttributeV2(HelloData helloData){
        log.info("username = {}, age = {}",helloData.getUsername(),helloData.getAge());
        return "ok";
    }
```
