# 스프링 트랜잭션 
**트랜잭션이란?**
>트랜잭션(Transaction)은 데이터베이스나 시스템에서 하나의 작업 단위를 의미한다. 
일반적으로 트랜잭션은 일련의 데이터 조작 작업을 모아 하나의 작업으로 실행하며, 이 작업이 모두 성공하거나 모두 실패하는 원자성을 가진다. 
트랜잭션은 금융 거래나 주문 처리 등 여러 단계의 작업이 하나의 논리적 단위로 처리되어야 할 때 유용하다.

## 트랜잭션 추상화

### 트랜잭션 추상화가 필요한 이유
- JDBC 기술과 JPA 기술은 트랜잭션 을 사용하는 코드 자체가 다르다.
- 이 문제는 JDBC를 사용중 일 때 DB 접근 기술을 JPA로 변경할 때 트랜잭션을 사용하는 모든 코드를 수정해야 하는 문제가 발생한다.
  
**JDBC 기술**
```java
public void accountTransfer(String fromId, String toId, int money) throws
 SQLException {
     Connection con = dataSource.getConnection();
     try {
        con.setAutoCommit(false); //트랜잭션 시작 //비즈니스 로직
        bizLogic(con, fromId, toId, money); con.commit(); //성공시 커밋
      } catch (Exception e) {
        con.rollback(); //실패시 롤백
        throw new IllegalStateException(e);
     } finally {
         release(con);
  }
}
```
- JDBC 사용: 직접 데이터베이스 커넥션을 획득하고, Connection 객체의 setAutoCommit(false)를 통해 트랜잭션을 시작


**JPA 기술**
```java
public static void main(String[] args) {
    //엔티티 매니저 팩토리 생성
    EntityManagerFactory emf = Persistence.createEntityManagerFactory("jpabook");
    EntityManager em = emf.createEntityManager(); //엔티티 매니저 생성 EntityTransaction tx = em.getTransaction(); //트랜잭션 기능 획득
    try {
      tx.begin(); //트랜잭션 시작
      logic(em); //비즈니스 로직
      tx.commit();//트랜잭션 커밋
    } catch (Exception e) {
        tx.rollback(); //트랜잭션 롤백
    } finally {
        em.close(); //엔티티 매니저 종료
  }
  e mf.close(); //엔티티 매니저 팩토리 종료
}
```
- JPA 사용: JDBC와 다르게 JPA를 통해 데이터베이스와의 상호작용을 관리.
- EntityManager와 EntityTransaction을 사용해 트랜잭션을 관리


### 트랜잭션 추상화 - 인터페이스
스프링은 `PlatformTransactionManager` 라는 인터페이스를 통해 트랜잭션을 추상화한다.

<img width="621" alt="image" src="https://github.com/user-attachments/assets/68cffcfc-f356-493e-81f2-0888c74124ad">

### 스프링 트랜잭션 사용 방식
**선언적 트랜잭션 관리 vs 프로그래밍 방식 트랜잭션 관리**
- 선언적 트랜잭션 관리(Declarative Transaction Management)
  - `@Transactional` 애노테이션 하나만 선언해서 매우 편리하게 트랜잭션을 적용하는 것을 선언적 트랜잭 션 관리라 한다.
  - 선언적 트랜잭션 관리는 과거 XML에 설정하기도 했다.
  - 이름 그대로 해당 로직에 트랜잭션을 적용하겠다 라고 어딘가에 선언하기만 하면 트랜잭션이 적용되는 방식 이다.
- 프로그래밍 방식의 트랜잭션 관리(programmatic transaction management)
  - 트랜잭션 매니저 또는 트랜잭션 템플릿 등을 사용해서 트랜잭션 관련 코드를 직접 작성하는 것을 프로그래 밍 방식의 트랜잭션 관리라 한다.
  - 프로그래밍 방식의 트랜잭션 관리를 사용하게 되면, 애플리케이션 코드가 트랜잭션이라는 기술 코드와 강하게 결 합된다.
  - 선언적 트랜잭션 관리가 프로그래밍 방식에 비해서 훨씬 간편하고 실용적이기 때문에 실무에서는 대부분 **선언적 트랜잭션 관리를 사용한다.**
 

### 선언적 트랜잭션과 AOP
**프록시 도입 전**
<img width="621" alt="image" src="https://github.com/user-attachments/assets/4c914037-fb80-4dbf-af41-00dff532c615">
- 트랜잭션을 처리하기 위한 프록시를 도입하기 전에는 서비스의 로직에서 트랜잭션을 직접 시작

**프록시 도입 후**
<img width="721" alt="image" src="https://github.com/user-attachments/assets/3b991ebc-60db-4c61-b444-75860bd9ee8b">
- 트랜잭션을 처리하기 위한 프록시를 적용하면 트랜잭션을 처리하는 객체와 비즈니스 로직을 처리하는 서비스 객체를 명 확하게 분리

### 프록시 도입 후 전체 과정
<img width="760" alt="image" src="https://github.com/user-attachments/assets/1b6ad8a3-ee9f-4aed-aadf-a734f4e1044b">
- 트랜잭션은 커넥션에 `con.setAutocommit(false)` 를 지정하면서 시작한다. 
- 같은 트랜잭션을 유지하려면 같은 데이터베이스 커넥션을 사용해야 한다.
- 이것을 위해 스프링 내부에서는 트랜잭션 동기화 매니저가 사용된다.
- `JdbcTemplate` 을 포함한 대부분의 데이터 접근 기술들은 트랜잭션을 유지하기 위해 내부에서 트랜잭션 동기 화 매니저를 통해 리소스(커넥션)를 동기화 한다.

## 스프링이 제공하는 트랜잭션 AOP
개발자는 트랜잭션 처리가 필요한 곳에 `@Transactional` 애노테이션만 붙여주면 된다. 스프링의 트랜잭션 AOP는 이 애노테이션을 인식해서 트랜잭션을 처리하는 프록시를 적용해준다.
