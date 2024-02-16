## API 예외 처리

### API 예외 처리 - HandlerExceptionResolver 시작
예외가 발생해서 서블릿을 넘어 WAS까지 예외가 전달되면 HTTP 상태코드가 500으로 처리된다. 발생하는 예외에 따 라서 400, 404 등등 다른 상태코드로 처리하고 싶다. 오류 메시지, 형식등을 API마다 다르게 처리할 수 있다.

**ApiExceptionController - 수정**
```java
@GetMapping("/api/members/{id}")
    public MemberDto getmember(@PathVariable("id") String id){
        if (id.equals("ex")){
            throw new RuntimeException("잘못된 사용자");
        }
        if(id.equals("bad")){
            throw new IllegalArgumentException("잘못된 값");
        }
        return new MemberDto(id,"hello" + id);
    }
```
- http://localhost:8080/api/members/bad 라고 호출하면 `IllegalArgumentException` 이 발생

**실행해보면 상태 코드가 500인 것을 확인할 수 있다.** 
```json
 {
     "status": 500,
     "error": "Internal Server Error",
     "exception": "java.lang.IllegalArgumentException",
     "path": "/api/members/bad"
}
```

**MyHandlerExceptionResolver - HandlerExceptionResolver(인터페이스)**
```java
package hello.exception.resolver;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
@Slf4j
public class MyHandlerExceptionResolver implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        try {
            if (ex instanceof IllegalArgumentException){
                log.info("IllegalArgumentException resolver to 400");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());
                return new ModelAndView();
            }
        } catch (IOException e){
              log.info("resolver ex", e);
        }

        return null;
    }
}
```
**HandlerExceptionResolver**
- handler` : 핸들러(컨트롤러) 정보
- `Exception ex` : 핸들러(컨트롤러)에서 발생한 발생한 예외

**MyHandlerExceptionResolver**
- `ExceptionResolver` 가 `ModelAndView` 를 반환하는 이유는 마치 try, catch를 하듯이, Exception` 을 처리해서 정상 흐름 처럼 변경한다.
- 여기서는 `IllegalArgumentException` 이 발생하면 `response.sendError(400)` 를 호출해서 HTTP 상태 코드를 400으로 지정하고, 빈 `ModelAndView` 를 반환

**WebConfig - 수정**
`WebMvcConfigurer` 를 통해 등록
```java
    @Override
    public void extendHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
        resolvers.add(new MyHandlerExceptionResolver());
    }
```

### API 예외 처리 - HandlerExceptionResolver 활용
**UserException**
```java
package hello.exception.exception;

public class UserException extends RuntimeException{
    public UserException() {
        super();
    }

    public UserException(String message) {
        super(message);
    }

    public UserException(String message, Throwable cause) {
        super(message, cause);
    }

    public UserException(Throwable cause) {
        super(cause);
    }
}
```
- 사용자 정의 예외를 하나 추가

**ApiExceptionController - 예외 추가**
```java
package hello.exception.api;

import hello.exception.exception.UserException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class ApiExceptionCotroller {
    @GetMapping("/api/members/{id}")
    public MemberDto getmember(@PathVariable("id") String id){
        if (id.equals("ex")){
            throw new RuntimeException("잘못된 사용자");
        }
        if(id.equals("bad")){
            throw new IllegalArgumentException("잘못된 값");
        }
        if(id.equals("user-ex")){
            throw new UserException("사용자 오류");
        }
        return new MemberDto(id,"hello" + id);
    }

    @Data
    @AllArgsConstructor
    static class MemberDto{
        private String memberId;
        private String name;
    }


}
```

**UserHandlerExceptionResolver**
```java
package hello.exception.resolver;

import com.fasterxml.jackson.databind.ObjectMapper;
import hello.exception.exception.UserException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import java.util.HashMap;
import java.util.Map;
import java.io.IOException;


@Slf4j
public class UserHandlerExceptionResolver implements HandlerExceptionResolver {
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        try {
            if(ex instanceof UserException){
                log.info("UserException resolver to 400");
                String acceptHeader = request.getHeader("accept");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

                if ("application/json".equals(acceptHeader)){
                    Map<String, Object> errorResult = new HashMap<>();
                    errorResult.put("ex", ex.getClass());
                    errorResult.put("message", ex.getMessage());
                    String result = objectMapper.writeValueAsString(errorResult);

                    response.setContentType("application/json");
                    response.setCharacterEncoding("utf-8");
                    response.getWriter().write(result);
                    return new ModelAndView();
                }else{
                    return new ModelAndView("error/500");
                }
            }
        }catch (IOException e){
            log.info("resolver ex", e);
        }
        return null;
    }
}
```
- HTTP 요청 해더의 `ACCEPT` 값이 `application/json` 이면 JSON으로 오류를 내려주고, 
- 그 외 경우에는 error/ 500에 있는 HTML 오류 페이지를 보여준다.

**WebConfig에 UserHandlerExceptionResolver** 추가
```java
    @Override
    public void extendHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
        resolvers.add(new MyHandlerExceptionResolver());
        resolvers.add(new UserHandlerExceptionResolver());
    }
```
### 정리
- `ExceptionResolver` 를 사용하면 컨트롤러에서 예외가 발생해도 `ExceptionResolver` 에서 예외를 처리
	- WAS 입장에서는 정상 처리
- ExceptionResolver` 를 사용하면 예외처리가 깔끔
- 직접 `ExceptionResolver` 구현하기는 복잡하다.
