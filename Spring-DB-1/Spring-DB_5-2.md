## 언 체크 예외 기본 이해
- `RuntimeException`과 그 하위 예외는 언체크 얘외로 분류
- 컴파일러가 예외를 체크하지 않는다
-  `throws` 를 선언하지 않고, 생략 할 수 있다. 이 경우 자동으로 예외를 던진다.

## 언체크 예외 전체 코드
```java
package hello.jdbc.exception.basic;

import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

@Slf4j
public class UncheckedExceptionTest {
    @Test
    void unchecked_catch() {
        Service service = new Service();
        service.callCatch();
    }
    @Test
    void unchecked_throw(){
        Service service = new Service();
        service.callThrow();
        Assertions.assertThatThrownBy(()->service.callThrow())
                .isInstanceOf(MyUncheckedException.class);
    }

    static class MyUncheckedException extends RuntimeException {
        public MyUncheckedException(String message) {
            super(message);
        }
    }

    static class Service {
        Repository repository = new Repository();

        public void callCatch() {
            try {
                repository.call();
            } catch (MyUncheckedException e) {
                log.info("예외 처리, message={}", e.getMessage(), e);
            }

        }
        public void callThrow(){
            repository.call();
        }
    }

    static class Repository {
        public void call() {
            throw new MyUncheckedException("ex");
        }
    }
}
```

**언체크 예외를 잡아서 처리하는 코드**
```java
public void callCatch() {
            try {
                repository.call();
            } catch (MyUncheckedException e) {
                log.info("예외 처리, message={}", e.getMessage(), e);
            }
        }
```
- 언체크 예외도 필요한 경우 이렇게 잡아서 처리할 수 있다.

**언체크 예외를 밖으로 던지는 코드 - 생략**
```java
public void call() {
            throw new MyUncheckedException("ex");
        }
```
- 언체크 예외는 체크 예외와 다르게 `throws 예외` 를 선언하지 않아도 된다.
- 컴파일러가 이런 부분을 체크하지 않기 때문에 언체크 예외

**언체크 예외를 밖으로 던지는 코드 - 선언**
```java
public void call() throws MyUncheckedException {
            throw new MyUncheckedException("ex");
        }
```
- 참고로 언체크 예외도 `throws 예외` 를 선언해도 된다
