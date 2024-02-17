## API 예외 처리 - @ExceptionHandler
살펴본 `BasicErrorController` 를 사용하거나 `HandlerExceptionResolver` 를 직접 구현하 는 방식으로 API 예외를 다루기는 쉽지 않다.

**@ExceptionHandler**
- 스프링은 API 예외 처리 문제를 해결하기 위해 `@ExceptionHandler` 라는 애노테이션을 사용
- 우선순위가 가장 높다.

`예외가 발생했을 때 API 응답으로 사용하는 객체를 정의`
**ErrorResult**
```java
package hello.exception.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResult {
    private String code;
    private String message;
}
```
**ApiExceptionV2Controller**
```java
package hello.exception.api;


import hello.exception.exception.ErrorResult;
import hello.exception.exception.UserException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
public class ApiExceptionV2Controller {
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public ErrorResult illegalExHandler(IllegalArgumentException e){
        log.error("[exceptionHandle] ex", e);
        return new ErrorResult("BAD",e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResult>userExHandler(UserException e){
        log.info("[exceptionHandler] ex", e);
        ErrorResult errorResult = new ErrorResult("USER-EX", e.getMessage());
        return new ResponseEntity<>(errorResult,HttpStatus.BAD_REQUEST);
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler
    public ErrorResult exHandler(Exception e){
        log.error("[exceptionHandle] ex", e);
        return new ErrorResult("EX", "내부 오류");
    }

    @GetMapping("/api2/members/{id}")
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
- **@ExceptionHandler 예외 처리 방법**
	- `@ExceptionHandler` 애노테이션을 선언하고, 해당 컨트롤러에서 처리하고 싶은 예외를 지정
	- 해당 컨트롤러에서 예외가 발생하면 이 메서드가 호출
- **예외 생략**
	- `@ExceptionHandler` 에 예외를 생략할 수 있다. 생략하면 메서드 파라미터의 예외가 지정된다.

**IllegalArgumentException 처리 흐름**
```java
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public ErrorResult illegalExHandler(IllegalArgumentException e){
        log.error("[exceptionHandle] ex", e);
        return new ErrorResult("BAD",e.getMessage());
    }
```

1. 컨트롤러 호출 결과 `IllegalArgumentException ` 예외가 컨트롤러 밖으로 던져진다.
2. 예외가 발생했으므로 `ExceptionResolver`가 작동한다. 
	- 가장 우선순위가 높은 `ExceptionHandlerExceptionResolver` 가 실행
3. `ExceptionHandlerExceptionResolver `는 해당 컨트롤러에 `IllegalArgumentException`을 처리할 수 있는 `@ExceptionHandler` 가 있는지 확인
4. `@ExceptionHandler` 가 있다면 `illegalExHandle()` 를 실행
	- `@RestController` 이므로 `illegalExHandle()` 에도 `@ResponseBody` 가 적용된다. 따라서 HTTP 컨버터가 사용되고, 응답이 다음과 같은 JSON으로 반환
5. @ResponseStatus(HttpStatus.BAD_REQUEST)` 를 지정했으므로 HTTP 상태 코드 400으로 응답한다.

**UserException 처리**
```java
    @ExceptionHandler
    public ResponseEntity<ErrorResult>userExHandler(UserException e){
        log.info("[exceptionHandler] ex", e);
        ErrorResult errorResult = new ErrorResult("USER-EX", e.getMessage());
        return new ResponseEntity<>(errorResult,HttpStatus.BAD_REQUEST);
    }
```
- `@ExceptionHandler` 에 예외를 지정하지 않으면 해당 메서드 파라미터 예외를 사용
- `ResponseEntity` 를 사용해서 HTTP 메시지 바디에 직접 응답
	- ResponseEntity` 를 사용하면 HTTP 응답 코드를 프로그래밍해서 동적으로 변경
- `@ResponseStatus` 는 애노테이션이므로 HTTP 응답 코드를 동적으로 변경할 수 없다.

**Exception**
```java
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler
    public ErrorResult exHandler(Exception e){
        log.error("[exceptionHandle] ex", e);
        return new ErrorResult("EX", "내부 오류");
    }
```
- `throw new RuntimeException("잘못된 사용자")` 이 코드가 실행되면서, 컨트롤러 밖으로 `RuntimeException` 이 던져진다.
- `RuntimeException` 은 `Exception` 의 자식 클래스이다. 따라서 이 메서드가 호출된다.
- `@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)` 로 HTTP 상태 코드를 500으로 응답한다.


