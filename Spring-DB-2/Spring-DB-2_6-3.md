## 예외와 트랜잭션 커밋, 롤백 
애플리케이션에서 문제가 발생했을 때를 대비해 예외 처리를 해줘야할 것이다. 

이때 내부에서 예외를 처리하지 못하고 트랜잭션 범위 밖으로 예외를 던지면 어떻게 될까?

➡️ 범위 밖 : `@Transactional`가 적용된 AOP 범위 바깥

![image](https://github.com/user-attachments/assets/86af4d3e-be6d-4d2f-b121-f7dc09088435)
- 예외 발생시 스프링 트랜잭션 AOP는 예외의 종류에 따라 트랜잭션을 커밋하거나 롤백한다.
  - 언체크 예외 : `RuntimeException` , `Error` 와 그 하위 예외가 발생하면 트랜잭션을 롤백
  - 체크 예외 :   `Exception` 과 그 하위 예외가 발생하면 트랜잭션을 커밋

**여기서 언체크 예외와 체크 예외의 차이가 뭘까?**

#### 체크 예외
- 체크 예외는 컴파일 시점에 체크되며, 예외 발생 가능성을 컴파일러가 강제한다.
- `throws`를 사용해 예외를 선언하거나 `try-catch`로 처리한다.
- ex) `IOException`, `SQLException`, `ClassNotFoundException`

#### 언체크 예외 
- 런타임 예외로, 컴파일러가 예외 처리를 강제하지 않는다.
- 프로그래밍 논리 오류와 관련된 예외이다.
- 잘못된 입력, `null` 참조, 배열 인덱스 초과 등으로 발생한다.

### 트랜잭션 커밋, 롤백
Spring의 기본 설정에서는 예외의 종류에 따라 트랜잭션의 커밋 또는 롤백을 결정

**언체크 예외 (Unchecked Exception)**
- 기본적으로 언체크 예외가 발생하면 트랜잭션을 롤백합니다.
- 예: `NullPointerException`, `IllegalArgumentException`
  
**체크 예외 (Checked Exception)**
- 기본적으로 체크 예외가 발생해도 트랜잭션을 롤백하지 않고 커밋합니다.
- 예: `IOException`, `SQLException`
