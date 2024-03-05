# 스프링과 문제 해결 - 트랜잭션

## 문제점들
- 트랜잭션 문제
- 예외 누수 문제
- JDBC 반복 문제

### 트랜잭션 문제
- 트랜잭션을 적용하면서 서비스 계층에 JDBC 구현 기술이 사용되었다.
	- 이렇게 되면 서비스 계층은 JDBC 기술에 종속되기 기술이 바뀌면 계속 변경해야한다.
- 트랜잭션 동기화 문제
	- 같은 트랜잭션을 유지하기 위해 커넥션을 파라미터로 넘겨야한다
		- 트랜잭션용 기능과 트랜쟉션을 유지하지 않아도 되는 기능으로 분리해야한다.
- 트랜잭션 적용 반복 문제
	- 트랜잭션 적용 코드를 보면 반복이 많다. `try` , `catch` , `finally` 


### 예외 누수
- 데이터 접근 계층의 JDBC 구현 기술 예외가 서비스 계층으로 전파된다.
- SQLException` 은 체크 예외이기 때문에 데이터 접근 계층을 호출한 서비스 계층에서 해당 예외를 잡아서 처리 하거나 명시적으로 `throws` 를 통해서 다시 밖으로 던져야한다.
- `SQLException` 은 JDBC 전용 기술이다. 향후 JPA나 다른 데이터 접근 기술을 사용하면, 그에 맞는 다른 예외 로 변경해야 하고, 결국 서비스 코드도 수정해야 한다.

### JDBC 반복 문제
- 유사한 코드의 반복이 너무 많다. 
	- `try` , `catch` , `finally`
- 커넥션을 열고, `PreparedStatement` 를 사용하고, 결과를 매핑하고... 실행하고, 커넥션과 리소스를 정리한다.

## 해결 - 트랜잭션 추상화
스프링은 이미 이런 고민을 다 해두었다. 우리는 스프링이 제공하는 트랜잭션 추상화 기술을 사용하면 된다.

<img src="/img/Spring_DB/DB-3_1.png" alt="Tx" width="600" height="350" />

**PlatformTransactionManager 인터페이스**

```java
package org.springframework.transaction;
 public interface PlatformTransactionManager extends TransactionManager {
     TransactionStatus getTransaction(@Nullable TransactionDefinition definition)
             throws TransactionException;
     void commit(TransactionStatus status) throws TransactionException;
     void rollback(TransactionStatus status) throws TransactionException;
}
```
- `getTransaction()` : 트랜잭션을 시작한다.
	- 이름이 `getTransaction()` 인 이유는 기존에 이미 진행중인 트랜잭션이 있는 경우 해당 트랜잭션에 참여할 수 있기 때문이다.
	- 참고로 트랜잭션 참여, 전파에 대한 부분은 뒤에서 설명한다. 지금은 단순히 트랜잭션을 시작하는 것으로 이해하면 된다.
- `commit()` : 트랜잭션을 커밋
- `rollback()` : 트랜잭션을 롤백


## 트랜잭션 동기화
**트랜잭션 매니의 2가지 역할**
- 트랜잭션 추상화
- 리소스 동기화
	- 트랜잭션을 유지하려면 트랜잭션의 시작부터 끝까지 같은 데이터베이스 커넥션을 유지

<img src="/img/Spring_DB/DB-3_2.png" alt="Tx" width="600" height="350" />
