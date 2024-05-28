# JPQL - 기본 문법과 기능

## JPQL 정리
- JPQL은 객체지향 쿼리 언어다.따라서 테이블을 대상으로 쿼리 하는 것이 아니라 엔티티 객체를 대상으로 쿼리한다.
- JPQL은 SQL을 추상화해서 특정데이터베이스 SQL에 의존하지 않는다.
- JPQL은 결국 SQL로 변환된다.

<img src="/img/Jpa-basic/jpa10-2_1.png" alt="jpa" width="470" height="480" />

## JPQL 문법
```text
select_문 :: =
	select_절
	from_절
	[where_절]
	[groupby_절]
	[having_절]
	[orderby_절]

update_문 :: = update_절 [where_절]
delete_문 :: = delete_절 [where_절]
```
**JPQL 문법**
- select m from Member as m where m.age > 18
- 엔티티와 속성은 대소문자 구분O (Member, age)
- JPQL 키워드는 대소문자 구분X (SELECT, FROM, where)
- 엔티티 이름 사용, 테이블 이름이 아님(Member)
- 별칭은 필수(m) (as는 생략가능)

**TypeQuery, Query**
- TypeQuery: 반환 타입이 명확할 때 사용
- Query: 반환 타입이 명확하지 않을 때 사용

```java
TypedQuery<Member> query =
	em.createQuery("SELECT m FROM Member m", Member.class);

Query query =
	em.createQuery("SELECT m.username, m.age from Member m");
```
**결과 조회 API**

- query.getResultList(): 결과가 하나 이상일 때, 리스트 반환
	- 결과가 없으면 빈 리스트 반환
- query.getSingleResult(): 결과가 정확히 하나, 단일 객체 반환
	- 결과가 없으면: javax.persistence.NoResultException
	- 둘 이상이면: javax.persistence.NonUniqueResultException


**파라미터 바인딩 - 이름 기준, 위치 기준**
```java
//사용 권장
SELECT m FROM Member m where m.username=:username
query.setParameter("username", usernameParam);


SELECT m FROM Member m where m.username=?1
query.setParameter(1, usernameParam);
```