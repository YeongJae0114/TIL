## 예외 처리와 오류 페이지
### 서블릿 예외 처리 - 시작
스프링이 아닌 순수 서블릿 컨테이너는 예외를 어떻게 처리하는지 알아보자.

**서블릿은 다음 2가지 방식으로 예외 처리를 지원한다.** 
- `Exception` (예외)
- `response.sendError(HTTP 상태 코드, 오류 메시지)`

### Exception(예외)
**자바 직접 실행**
- 자바의 메인 메서드를 직접 실행하는 경우 `main` 이라는 이름의 쓰레드가 실행된다.
- 실행 도중에 예외를 잡지 못하고 처음 실행한 `main()` 메서드를 넘어서 예외가 던져지면, 예외 정보를 남기고 해당 쓰 레드는 종료된다.
**웹 애플리케이션**
- 웹 애플리케이션은 사용자 요청별로 별도의 쓰레드가 할당되고, 서블릿 컨테이너 안에서 실행된다.

```
WAS(여기까지 전파) <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러(예외발생)
```
- 결국 톰캣 같은 WAS 까지 예외가 전달된다

### WAS 예외 처리
**response.sendError(HTTP 상태 코드, 오류 메시지)**
```java
package hello.exception.servlet;

import ...

@Slf4j
@Controller
public class ServletExController {
    @GetMapping("/error-ex")
    public void errorEx(){
        throw new RuntimeException("예외 발생");
    }

    @GetMapping("/error-404")
    public void error404(HttpServletResponse response) throws IOException {
        response.sendError(404, "404 오류");
    }

    @GetMapping("/error-400")
    public void error400(HttpServletResponse response) throws IOException {
        response.sendError(400, "400 오류");
    }

    @GetMapping("/error-500")
    public void error500(HttpServletResponse response) throws IOException {
        response.sendError(500 );
    }
}
```
- `response.sendError(HTTP 상태 코드)` 
- `response.sendError(HTTP 상태 코드, 오류 메시지)`


**sendError 흐름** 
```
WAS(sendError 호출 기록 확인) <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러 (response.sendError())
```
- `response.sendError()` 를 호출하면 `response` 내부에는 오류가 발생했다는 상태를 저장
- 서블릿 컨테이너는 고객에게 응답 전에 `response` 에 `sendError()` 가 호출되었는지 확인
	- 설정한 오류 코드에 맞추어 기본 오류 페이지를 보여준다.
 
**서블릿 오류 페이지 등록**
```java
package hello.exception;

import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

//@Component
public class WebServerCustomizer implements WebServerFactoryCustomizer<ConfigurableWebServerFactory> {
    @Override
    public void customize(ConfigurableWebServerFactory factory) {
        ErrorPage errorPage404 = new ErrorPage(HttpStatus.NOT_FOUND,"/error-page/404");

        ErrorPage errorPage500 = new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR,"/error-page/500");

        ErrorPage errorPageEx = new ErrorPage(RuntimeException.class,"/error-page/500");

        factory.addErrorPages(errorPage404, errorPage500, errorPageEx);
    }
}
```
- `response.sendError(404)` : `errorPage404` 호출 
- `response.sendError(500)` : `errorPage500` 호출 
- `RuntimeException` 또는 그 자식 타입의 예외: `errorPageEx` 호출

**서블릿 오류 페이지 Controller**
```java
package hello.exception.servlet;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
public class ErrorPageController {
    @RequestMapping("/error-page/404")
    public String errorPage404(HttpServletRequest request, HttpServletResponse response){
        log.info("errorPage 404");
        printErrorInfo(request);
        return "error-page/404";
    }

    @RequestMapping("/error-page/500")
    public String errorPage500(HttpServletRequest request, HttpServletResponse response){
        log.info("errorPage 500");
        printErrorInfo(request);
        return "error-page/500";
    }
}
```

### 서블릿 예외 처리 - 오류 페이지 작동 원리
서블릿은 `Exception` (예외)가 발생해서 서블릿 밖으로 전달되거나 또는 `response.sendError()` 가 호출 되었
을 때 설정된 오류 페이지를 찾는다. 

**예외 발생 흐름**
```
WAS(여기까지 전파) <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러(예외발생) 
```

**sendError 흐름** 
```
WAS(sendError 호출 기록 확인) <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러
(response.sendError())
```
- WAS는 해당 예외를 처리하는 오류 페이지 정보를 확인한다.
- `new ErrorPage(RuntimeException.class, "/error-page/500")`
- 예를 들어서 `RuntimeException` 예외가 WAS까지 전달되면, WAS는 오류 페이지 정보를 확인한다. 확인해보니`RuntimeException` 의 오류 페이지로 `/error-page/500` 이 지정되어 있다. WAS는 오류 페이지를 출력하기 위해 `/error-page/500` 를 다시 요청한다. 

**오류 페이지 요청 흐름**
```
WAS `/error-page/500` 다시 요청 -> 필터 -> 서블릿 -> 인터셉터 -> 컨트롤러(/error-page/500) -> View
```

**예외 발생과 오류 페이지 요청 흐름** 
```
1. WAS(여기까지 전파) <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러(예외발생)
2. WAS `/error-page/500` 다시 요청 -> 필터 -> 서블릿 -> 인터셉터 -> 컨트롤러(/error-page/
500) -> View
```
- **중요한 점은 웹 브라우저(클라이언트)는 서버 내부에서 이런 일이 일어나는지 전혀 모른다는 점이다. 오직 서버 내부에 서 오류 페이지를 찾기 위해 추가적인 호출을 한다.**


1. 예외가 발생해서 WAS까지 전파된다.
2. WAS는 오류 페이지 경로를 찾아서 내부에서 오류 페이지를 호출한다. 이때 오류 페이지 경로로 필터, 서블릿, 인터셉터, 컨트롤러가 모두 다시 호출된다.




