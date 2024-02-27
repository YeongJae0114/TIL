# 3-1.  트랜잭션 - 실습

### 기본 데이터 입력

![Untitled](3-1%20%E1%84%90%E1%85%B3%E1%84%85%E1%85%A2%E1%86%AB%E1%84%8C%E1%85%A2%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB%20-%20%E1%84%89%E1%85%B5%E1%86%AF%E1%84%89%E1%85%B3%E1%86%B8%208f4974e3ca4a475da5517e6889a810f9/Untitled.png)

```sql
//데이터 초기화
set autocommit true;
delete from member;
insert into member(member_id, money) values ('oldId',10000);
```

자동 커밋 모드를 사용했기 때문에 별도로 커밋을 호출하지 않아도 된다.

## 신규 데이터 추가

### 커밋 - 데이터 반영

세션 1에서 신규 데이터를 추가 한다. 커밋은 아직 하지 않는다.

```sql
//트랜잭션 시작
set autocommit false; //수동 커밋 모드
insert into member(member_id, money) values ('newId1',10000);
insert into member(member_id, money) values ('newId2',10000);
```

- 세션 1에서 임시로 데이터를 추가 했기 때문에 세션 2에서는 신규 데이터를 확인할 수 없다.
- 임시 데이터를 저장하려면 커밋을 호출 해야한다.

![Untitled](3-1%20%E1%84%90%E1%85%B3%E1%84%85%E1%85%A2%E1%86%AB%E1%84%8C%E1%85%A2%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB%20-%20%E1%84%89%E1%85%B5%E1%86%AF%E1%84%89%E1%85%B3%E1%86%B8%208f4974e3ca4a475da5517e6889a810f9/Untitled%201.png)

```sql
commit; // 데이터베이스에 반영
```

### 롤백 - rollback

![Untitled](3-1%20%E1%84%90%E1%85%B3%E1%84%85%E1%85%A2%E1%86%AB%E1%84%8C%E1%85%A2%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB%20-%20%E1%84%89%E1%85%B5%E1%86%AF%E1%84%89%E1%85%B3%E1%86%B8%208f4974e3ca4a475da5517e6889a810f9/Untitled%202.png)

- 세션 1 에서 신규 데이터가 추가 된후  세션 1에서 롤백을 호출하면
    - 데이터가 DB에 반영되지 않았다

![Untitled](3-1%20%E1%84%90%E1%85%B3%E1%84%85%E1%85%A2%E1%86%AB%E1%84%8C%E1%85%A2%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB%20-%20%E1%84%89%E1%85%B5%E1%86%AF%E1%84%89%E1%85%B3%E1%86%B8%208f4974e3ca4a475da5517e6889a810f9/Untitled%203.png)