## HTTP 응답 - 정적 리소스, 뷰 템플릿
> 뷰 템플릿을 거쳐서 HTML이 생성되고, 뷰가 응답을 만들어서 전달한다.
일반적으로 HTML을 동적으로 생성하는 용도로 사용하지만, 다른 것들도 가능하다. 뷰 템플릿이 만들 수 있는 것이라 면 뭐든지 가능하다.

**뷰 템플릿 경로** 
`src/main/resources/templates`

뷰 템플릿 생성** 
`src/main/resources/templates/response/hello.html`
```html
 <!DOCTYPE html>
 <html xmlns:th="http://www.thymeleaf.org">
 <head>
     <meta charset="UTF-8">
     <title>Title</title>
 </head>
<body>
 <p th:text="${data}">empty</p>
</body>
</html>
```
**ResponseViewController - 뷰 템플릿을 호출하는 컨트롤러**
```java
package hello.springmvc.basic.response;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ResponseViewController {
    @RequestMapping("/response-view-v1")
    public ModelAndView responseViewV1(){
        ModelAndView mav = new ModelAndView("response/hello")
                .addObject("data","hello!");
        return mav;
    }

    @RequestMapping("/response-view-v2")
    public String responseViewV2(Model model){
        model.addAttribute("data", "hello");
        return "response/hello";
    }

    @RequestMapping("/response/hello")
    public void responseViewV3(Model model){
        model.addAttribute("data", "hello2");
    }
}

```
**String을 반환하는 경우 - View or HTTP 메시지**
>`@ResponseBody` 가 없으면 `response/hello` 로 뷰 리졸버가 실행되어서 뷰를 찾고, 렌더링 한다. `@ResponseBody` 가 있으면 뷰 리졸버를 실행하지 않고, HTTP 메시지 바디에 직접 `response/hello` 라는 문자가
입력된다. 여기서는 뷰의 논리 이름인 `response/hello` 를 반환하면 다음 경로의 뷰 템플릿이 렌더링 되는 것을 확인할 수 있 다.

**Void**를 반환하는 경우
>`@Controller` 를 사용하고, `HttpServletResponse` , `OutputStream(Writer)` 같은 HTTP 메시지 바
디를 처리하는 파라미터가 없으면 요청 URL을 참고해서 논리 뷰 이름으로 사용 요청 URL: `/response/hello`
실행: `templates/response/hello.html`
**참고로 이 방식은 명시성이 너무 떨어지고 이렇게 딱 맞는 경우도 많이 없어서, 권장하지 않는다.**
  
---

## HTTP 응답 - HTTP API, 메시지 바디에 직접 입력
> HTTP API를 제공하는 경우에는 HTML이 아니라 데이터를 전달해야 하므로, HTTP 메시지 바디에 JSON 같은 형식 으로 데이터를 실어 보낸다. HTTP 요청에서 응답까지 대부분 다루었으므로 이번시간에는 정리를 해보자.

**responseBodyV1**
```java
    @GetMapping("/response-body-string-v1")
    public void responseBodyV1(HttpServletResponse response) throws IOException{
        response.getWriter().write("ok");
    }
```
- 서블릿을 직접 다룰 때 처럼 HttpServletResponse 객체를 통해서 HTTP 메시지 바디에 직접 `ok` 응답 메시지를 전달한다.
- `response.getWriter().write("ok")`

**responseBodyV2**
```java
    @GetMapping("/response-body-string-v2")
    public ResponseEntity<String> responseBodyV2() {
        return new ResponseEntity<>("ok", HttpStatus.OK);
    }
```
- ResponseEntity` 엔티티는 `HttpEntity` 를 상속 받았는데, HttpEntity는 HTTP 메시지의 헤더, 바디 정보를 가지고 있다. `ResponseEntity` 는 여기에 더해서 HTTP 응답 코드를 설정할 수 있다. 
- `HttpStatus.CREATED` 로 변경하면 201 응답이 나가는 것을 확인할 수 있다.

**responseBodyV3**
```java
    @GetMapping("/response-body-string-v3")
    public String responseBodyV3() {
        return "ok";
    }
```
- @ResponseBody` 를 사용하면 view를 사용하지 않고, HTTP 메시지 컨버터를 통해서 HTTP 메시지를 직접 입력할 수 있다. `ResponseEntity` 도 동일한 방식으로 동작한다.

**responseBodyJsonV1**
```java
    @GetMapping("/response-body-json-v1")
    public ResponseEntity<HelloData> responseBodyJsonV1(){
         HelloData helloData = new HelloData();
         helloData.setUsername("user1");
         helloData.setAge(20);

         return new ResponseEntity<>(helloData, HttpStatus.OK);
    }
```
- `ResponseEntity` 를 반환한다. HTTP 메시지 컨버터를 통해서 JSON 형식으로 변환되어서 반환된다.

**responseBodyJsonV2**
```java
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    @GetMapping("/response-body-json-v2")
    public HelloData responseBodyJsonV2(){
        HelloData helloData = new HelloData();
        helloData.setUsername("user1");
        helloData.setAge(20);

        return helloData;
    }
```
- `ResponseEntity` 는 HTTP 응답 코드를 설정할 수 있는데, `@ResponseBody` 를 사용하면 이런 것을 설정하기 까다롭다.
- `@ResponseStatus(HttpStatus.OK)` 애노테이션을 사용하면 응답 코드도 설정할 수 있다.
