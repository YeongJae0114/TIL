# 요청 매핑 API, (기본, 헤더 조회)
## API 예시
> 회원 관리를 HTTP API로 만든다 생각하고 매핑을 어떻게 하는지 알아보자.

**회원 관리 API**

- 회원 목록 조회: GET `/users`
- 회원 등록: POST `/users`
- 회원 조회: GET `/users/{userId}`
- 회원 수정: PATCH `/users/{userId}`
- 회원 삭제: Delete `/users/{userId}`

**MappingClassController**
```java
package hello.springmvc.basic.requestmapping;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mapping/users")
public class MappingClassController {

    @GetMapping()
    public String user(){
       return "get users";
   }

    @PostMapping()
    public String addUser(){
        return "post user";
    }

    @GetMapping("/{userId}")
    public String findUser(@PathVariable String userId){
       return "get userId = "+ userId;
    }

    @PatchMapping("/{userId}")
    public String updateUser(@PathVariable String userId){
        return "update userId = "+ userId;
    }

    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable String userId){
        return "Delete userId = "+ userId;
    }
}
```
## HTTP 요청 - 기본, 헤더 조회
```java
package hello.springmvc.basic.request;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;

@Slf4j
@RestController
public class RequestHeaderController {
    @RequestMapping("/headers")
    public String headers(HttpServletRequest request,
                          HttpServletResponse response,
                          HttpMethod httpMethod,
                          Locale locale,
                          @RequestHeader MultiValueMap<String, String> headerMap,
                          @RequestHeader("host") String host,
                          @CookieValue(value = "mycookie",required = false) String cookie
    ){
        log.info("request={}", request);
        log.info("response={}", response);
        log.info("httpMethod={}", httpMethod);
        log.info("locale={}", locale);
        log.info("headerMap={}", headerMap);
        log.info("header host={}", host);
        log.info("myCookie={}", cookie);

        return "ok";
    }
}
```

> **참고**
`@Controller` 의 사용 가능한 파라미터 목록은 다음 공식 메뉴얼에서 확인할 수 있다.
https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann- arguments

> **참고**
`@Controller` 의 사용 가능한 응답 값 목록은 다음 공식 메뉴얼에서 확인할 수 있다.
https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann- return-types


```text
@Slf4j
다음 코드를 자동으로 생성해서 로그를 선언해준다. 개발자는 편리하게 log 라고 사용하면 된다.
 private static final org.slf4j.Logger log =
 	org.slf4j.LoggerFactory.getLogger(RequestHeaderController.class);
```

**MultiValueMap**
```java
MultiValueMap<String, String> map = new LinkedMultiValueMap();
 map.add("keyA", "value1");
 map.add("keyA", "value2");
 //[value1,value2]
List<String> values = map.get("keyA");
```
- MAP과 유사한데, 하나의 키에 여러 값을 받을 수 있다.
- HTTP header, HTTP 쿼리 파라미터와 같이 하나의 키에 여러 값을 받을 때 사용한다.
	- **keyA=value1&keyA=value2**


