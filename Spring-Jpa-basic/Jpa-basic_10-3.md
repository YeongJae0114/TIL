## 프로젝션
**프로젝션**
- SELECT 절에 조회할 대상을 지정하는 것
- 프로젝션 대상: 엔티티, 임베디드 타입, 스칼라 타입(숫자, 문자등 기본 데이터 타입)
- SELECT m FROM Member m -> 엔티티 프로젝션
- SELECT m.team FROM Member m -> 엔티티 프로젝션
- SELECT m.address FROM Member m -> 임베디드 타입 프로젝션
- SELECT m.username, m.age FROM Member m -> 스칼라 타입 프로젝션
- DISTINCT로 중복 제거

**프로젝션-여러 값 조회**
- SELECT m.username, m.age FROM Member m
- 1. Query 타입으로 조회
- 2. Object[] 타입으로 조회
- 3. new 명령어로 조회
	- 단순 값을 DTO로 바로 조회
	- SELECT new jpabook.jpql.UserDTO(m.username, m.age) FROM Member m
	- 패키지 명을 포함한 전체 클래스 명 입력
	- 순서와 타입이 일치하는 생성자 필요

## 페이징 API
- JPA는 페이징을 다음 두 API로 추상화
- setFirstResult(int startPosition) : 조회 시작 위치 (0부터 시작)
- setMaxResults(int maxResult) : 조회할 데이터 수

```java
//페이징 쿼리
String jpql = "select m from Member m order by m.name desc";
List<Member> resultList = em.createQuery(jpql, Member.class)
	.setFirstResult(10)
	.setMaxResults(20)
	.getResultList();
```