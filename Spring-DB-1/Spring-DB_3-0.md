# 3-0.  트랜잭션 - 개념

## 트랜잭션이란

데이터를 저장할 때 파일에 저장하지 않고 데이터베이스에 저장하는 이유는 트랜잭션 이라는 개념을 지원하기 때문이다. 트랜잭션은 거래라는 뜻으로 데이터베이스에서 나의 거래를 안전하게 처리하도록 보장해준다.

5000원 계좌이체 시 2개의 작업이 하나 처럼 동작해야한다.

1. A 의 잔고를 5000원 감소
2. B 의 잔고를 5000원 증가

1번은 성공했는데 2번에서 시스템에 문제가 발생하면 계좌이체는 실패하고, A의 잔고만 5000원 감소하는 심각한 문제가 발생

- 모든 작업이 성공해서 데이터베이스에 정상 반영하는 것이 커밋( `Commit` )
- 작업 중 하나라도 실패해서 거래 이전으로 되돌리는 것이 롤백( `Rollback` )

  

## 트랜잭션 ACID

**원자성**(Atomicity), **일관성**(Consistency), **격리성**(Isolation), **지속성**(Durability)을 보장해야 한다.

- **원자성 : 트랜젹션 내에 실행한 작업들은 하나의 작업인것 처럼 모두 성공하거나 실패해야 한다.**
- **일관성 : 모든 트랜잭션은 일관성 있는 데이터베이스 상태를 유지해야 한다.**
- **격리성 : 동시에 실행되는 트랜잭션은 서로 영향을 미치지 않게 격리한다.**
- **지속성 : 성공적으로 끝내면 그 결과가 항상 기록되어야 한다. 문제가 발생해도 트랜잭션 내용을 복구 해야한다.**

## 데이터베이스 연결 구조와 DB 세션
<img src="/img/Spring_DB/DB-3_0.png" alt="cookie2" width="800" height="300" />

- 사용자는 WAS나 DB 접근 툴로 데이터베이스에 접근한다
- 데이터베이스 서버에 연결을 요청하고 커넥션을 맺고 데이터베이스는 세션을 만들어 트랜잭션을 시작

## 트랜잭션 사용법

- 데이터 변경 쿼리를 실행하고 데이터베이스에 그 결과를 반영하려면 commit을 호출하고, 결과를 반영하고 싶지 않으면 rollback을 호출
- 커밋을 호출하기 전까지는 임시로 데이터를 저장, 트랜잭션을 시작한 세션(사용자)에만 변경 데이터가 보이고 다른 세션(다른 사용자)에게는 변경 데이터가 보이지 않는다.

<img src="/img/Spring_DB/DB_3-1.png" alt="cookie2" width="800" height="300" />


**커밋하지 않은 데이터를 다른 곳에서 조회할 수 있으면 어떤 문제가 발생할까?**

- 세션2가 세션1이 커밋하지 않은 데이터가 보인다면, 세션2는 신규 회원 2명의 정보가 추가 되었다고 인지 한다.
    - 이때 신규 회원 데이터를 이용한 로직이 실행될 수 있다.
- 이후 세션 1이 롤백을 했을 때 세션 2가 실행한 로직에 큰 문제가 발생할 수 있다.

## 트랜잭션 - 자동 커밋, 수동 커밋

### 자동 커밋

자동 커밋으로 설정하면 쿼리 실행 직후에 자동으로 커밋을 호출한다. 따라서 롤백을 직접 호출하지 않아도 되는 편리함이 있다. 하지만 쿼리를 하나하나 자동으로 커밋 되어버리기 때문에 원하는 트랜잭션 기능을 사용할 수 없다.

**자동 커밋 설정**

```sql
set autocommit true; //자동 커밋 모드 설정
insert into member(member_id, money) values ('data1',10000); //자동 커밋
insert into member(member_id, money) values ('data2',10000); //자동 커밋
```

따라서 `commit` , `rollback` 을 직접 호출하면서 트랜잭션 기능을 제대로 수행하려면 자동 커밋을 끄고 수동 커밋을 사용해야 한다.

**수동 커밋 설정**

```sql
set autocommit false; //수동 커밋 모드 설정
insert into member(member_id, money) values ('data3',10000);
insert into member(member_id, money) values ('data4',10000);
commit; //수동 커밋
```

보통 자동 커밋 모드가 기본으로 설정된 경우가 많기 때문에, **수동 커밋 모드로 설정하는 것을 트랜잭션을 시작**한다고 표현한다