## 체크 예외 기본 이해

체크 예외를 잡아서 처리하거나, 또는 밖으로 던져 예외를 처리해보자
테스트 코드를 통하여 실습 진행

### 체크 예외 전체 코드 
```java
package hello.jdbc.exception.basic;

import lombok.extern.slf4j.Slf4j;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

@Slf4j
public class CheckedTest {
    @Test
    void checked_catch(){
        Service service = new Service();
        service.callCatch();
    }
    @Test
    void checked_throw(){
        Service service = new Service();

        Assertions.assertThatThrownBy(()-> service.callThrow())
                .isInstanceOf(MyCheckedException.class);
    }

    /**
     * Exception 을 상속받는 예외는 체크 예외가 된다
     */
    static class MyCheckedException extends Exception{
        public MyCheckedException(String message){
            super(message);
        }
    }
    /**
     * Checked 예외는
     * 예외를 잡아서 처리하거나, 던지거나 둘중 하나를 필수로 선택해야 한다.
     * */
    static class Service{
        Repository repository = new Repository();
        /**
         * 예외를 잡아서 처리하는 코드
         */
        public void callCatch(){
            try {
                repository.call();
            }catch (MyCheckedException e){
                log.info("예외 처리, message={}",e.getMessage(),e);
            }

        }
        public void callThrow() throws MyCheckedException {
            repository.call();
        }
    }
    static class Repository {
        public void call() throws MyCheckedException {
            throw new MyCheckedException("ex");
        }
    }
}
```
### Exception을 상속받은 예외 (체크 예외)
**MyCheckedException**
```java
    static class MyCheckedException extends Exception{
        public MyCheckedException(String message){
            super(message);
        }
    }
```
- `MyCheckedException` 는 `Exception` 을 상속받음.
- `Exception` 을 상속 받았기 때문에 체크 예외
- 오류 메시지를 보관하는 예외 기능 사용 (예외의 기본 기능)
  
**예외를 잡아서 처리하는 코드**
```java
    @Test
    void checked_catch(){
        Service service = new Service();
        service.callCatch();
    }

static class Service{
        Repository repository = new Repository();
        /**
         * 예외를 잡아서 처리하는 코드
         */
        public void callCatch(){
            try {
                repository.call();
            }catch (MyCheckedException e){
                log.info("예외 처리, message={}",e.getMessage(),e);
            }
        }
	}
```
- `service.callCatch()` 에서 예외를 처리했기 때문에 테스트 메서드까지 예외가 올라오지 않는다.
실행 순서를 분석해보자.
1. `test` -> `service.callCatch()` -> `repository.call()` **[예외발생,던짐]** 
2. `test` <- `service.callCatch()` **[예외처리]** <- `repository.call()`
3. `test` **[정상흐름]** <- `service.callCatch()` <- `repository.call()`

`Repository.call()` 에서 `MyUncheckedException` 예외가 발생하고, 그 예외를 `Service.callCatch()` 에서 잡는다.

**예외를 처리하지 않고, 밖으로 던지는 코드**
```java
    @Test
    void checked_throw(){
        Service service = new Service();

        Assertions.assertThatThrownBy(()-> service.callThrow())
                .isInstanceOf(MyCheckedException.class);
    }

static class Service{
        Repository repository = new Repository();

        public void callThrow() throws MyCheckedException {
            repository.call();
        }
	}
```
- 체크 예외를 처리할 수 없을 때는 `method() throws 예외` 을 사용해서 밖으로 던질 예외를 필수로 지정
	- `throws` 를 지정하지 않으면 컴파일 오류가 발생한다.
- 체크 예외를 밖으로 던지는 경우에도 해당 타입과 그 하위 타입을 모두 던질 수 있다 

1. `test` -> `service.callThrow()` -> `repository.call()` **[예외발생,던짐]**
2. `test` <- `service.callThrow()` **[예외던짐]** <- `repository.call()` 
3. `test` **[예외도착]** <- `service.callThrow()` <- `repository.call()`
