## 조인
- 둘 이상의 테이블을 연결해서 데이터를 검색하는 방법
	- 내부 조인:
		- `SELECT m FROM Member m [INNER] JOIN m.team t`
	- 외부 조인:
		- `SELECT m FROM Member m LEFT [OUTER] JOIN m.team t`
	- 세타 조인:
		- `select count(m) from Member m, Team t where m.username = t.name`

**조인 - ON 절**
- ON절을 활용한 조인(JPA 2.1부터 지원)
- 1. 조인 대상 필터링
- 2. 연관관계 없는 엔티티 외부 조인(하이버네이트 5.1부터)

### 1. 조인 대상 필터링**
**예) 회원과 팀을 조인하면서, 팀 이름이 A인 팀만 조인**
- JPQL:
	- `SELECT m, t FROM Member m LEFT JOIN m.team t on t.name = 'A'`
- SQL:
	- `SELECT m.*, t.* FROM Member m LEFT JOIN Team t ON m.TEAM_ID=t.id and t.name='A'`

### 2. 연관관계 없는 엔티티 외부 조인
**예) 회원의 이름과 팀의 이름이 같은 대상 외부 조인**
- JPQL:
 - `SELECT m, t FROM Member m LEFT JOIN Team t on m.username = t.name`
- SQL:
 - `SELECT m.*, t.* FROM Member m LEFT JOIN Team t ON m.username = t.name`


## 서브 쿼리
- 다른 테이블의 값을 기준으로 한 테이블에서 데이터를 검색할 수 있도록 다른 쿼리 내부에 중첩된 쿼리
	- 나이가 평균보다 많은 회원
		- `select m from Member m where m.age > (select avg(m2.age) from Member m2)`
	- 한 건이라도 주문한 고객
		- `select m from Member m where (select count(o) from Order o where m = o.member) > 0`

### 서브 쿼리 지원 함수
- [NOT] EXISTS (subquery): 서브쿼리에 결과가 존재하면 참
	- {ALL | ANY | SOME} (subquery)
	- ALL 모두 만족하면 참
	- ANY, SOME: 같은 의미, 조건을 하나라도 만족하면 참
- [NOT] IN (subquery): 서브쿼리의 결과 중 하나라도 같은 것이 있으면 참

### JPA 서브 쿼리 한계
- JPA는 WHERE, HAVING 절에서만 서브 쿼리 사용 가능
- SELECT 절도 가능(하이버네이트에서 지원)
- FROM 절의 서브 쿼리는 현재 JPQL에서 불가능
	- 조인으로 풀 수 있으면 풀어서 해결
