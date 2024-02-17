## API 예외 처리 - 스프링이 제공하는 ExceptionResolver

- 스프링 부트가 기본으로 처리하는 ExceptionResolver는 3가지로 다음 순서로 등록된다.

	- 1. ExceptionHandlerExceptionResolver
	- 2. ResponseStatusExceptionResolver
 	- 3. DefaultHandlerExceptionResolver -> 우선 순위가 가장 낮다

### 1. ExceptionHandlerExceptionResolver
- `@ExceptionHandler` 을 처리한다. API 예외 처리는 대부분 이 기능으로 해결한다. 조금 뒤에 자세히 설명

### 2. ResponseStatusExceptionResolver
- HTTP 상태 코드를 지정해준다.
	- 예) `@ResponseStatus(value = HttpStatus.NOT_FOUND)`

`ResponseStatusExceptionResolver` 는 예외에 따라서 HTTP 상태 코드를 지정해주는 역할을 한다.

다음 두 가지 경우를 처리
- `@ResponseStatus` 가 달려있는 예외 
- `ResponseStatusException` 예외

**@ResponseStatus**
```java
package hello.exception.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "잘못된 요청 오류") public class BadRequestException extends RuntimeException {
}
```
- ResponseStatusExceptionResolver` 예외가 해 당 애노테이션을 확인해서 오류 코드를 `HttpStatus.BAD_REQUEST` (400)으로 변경하고, 메시지도 담는다.
- ResponseStatusExceptionResolver` 코드를 확인해보면 결국 `response.sendError(statusCode, resolvedReason)` 를 호출

### 3. DefaultHandlerExceptionResolver
- 스프링 내부 기본 예외를 처리한다.
- 내부 기본 예외란 파라미터 바인딩 타입 오류로 내부에서 `TypeMismatchException` 이 발생한다. 이 경우 서블릿 컨테이너까지 오류가 올라가고, 결과적으로 500 오류가 발생한다.
	- 그러나 파라미터 바인딩은 대부분 클라이언트가 HTTP 요청 정보를 잘못 호출해서 발생하는 문제이므로
	- 이런 경우 HTTP 상태 코드 400을 사용해아 한다.
- `DefaultHandlerExceptionResolver.handleTypeMismatch` 를 보면 다음과 같은 코드를 확인할 수 있다.
- `response.sendError(HttpServletResponse.SC_BAD_REQUEST)` (400) 
	- 결국 `response.sendError()` 를 통해서 문제를 해결한다.

**ApiExceptionController - 추가**
```java
    @GetMapping("/api/default-handler-ex")
    public String defaultException(@RequestParam Integer data){
        return "ok";
    }
```
- `Integer data` 에 문자를 입력하면 내부에서 `TypeMismatchException` 이 발생한다.
- 실행 결과를 보면 HTTP 상태 코드가 400인 것을 확인할 수 있다.

**정리**
>지금까지 HTTP 상태 코드를 변경하고, 스프링 내부 예외의 상태코드를 변경하는 기능도 알아보았다. 그런데`HandlerExceptionResolver` 를 직접 사용하기는 복잡하다. API 오류 응답의 경우 `response` 에 직접 데이터를 넣어야 해서 매우 불편하고 번거롭다. `ModelAndView` 를 반환해야 하는 것도 API에는 잘 맞지 않는다. 스프링은 이 문제를 해결하기 위해 `@ExceptionHandler` 라는 매우 혁신적인 예외 처리 기능을 제공한다. 그것이 아 직 소개하지 않은`ExceptionHandlerExceptionResolver` 이다.