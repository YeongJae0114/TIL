## JPQL 페치 조인(fetch join)
**페치 조인(fetch join)**
- SQL 조인 종류X
- JPQL에서 성능 최적화를 위해 제공하는 기능
- 연관된 엔티티나 컬렉션을 SQL 한 번에 함께 조회하는 기능
- join fetch 명령어 사용
- 페치 조인 ::= [ LEFT [OUTER] | INNER ] JOIN FETCH 조인경로

### 엔티티 페치 조인
- 회원을 조회하면서 연관된 팀도 함께 조회(SQL 한 번에)
- SQL을 보면 회원 뿐만 아니라 팀도 함께 SELECT
- [JPQL]
	- `Select m form Member m join fetch m.team`
- [SQL]
	- `Select M.*, T.* From Member M INNER JOIN Team T ON M.TEAM_ID = T.ID`

**페치 조인 사용 코드**
```java
String jpql = "select m from Member m join fetch m.team";
List<Member> members = em.createQuery(jpql, Member.class).getResultList();
for (Member member : members) {
	//페치 조인으로 회원과 팀을 함께 조회해서 지연 로딩X
	System.out.println("username = " + member.getUsername() + ", " +
		"teamName = " + member.getTeam().name());
}
```
**결과**
```username = 회원1, teamname = 팀A 
username = 회원2, teamname = 팀A
username = 회원3, teamname = 팀B
```


### 컬렉션 페치 조인
- 일대다 관계, 컬렉션 페치 조인
- [JPQL]
	- `select t from Team t join fetch t.members where t.name = ‘팀A'`
- [SQL]
	- ` SELECT T.*, M.* FROM TEAM T INNER JOIN MEMBER M ON T.ID=M.TEAM_ID WHERE T.NAME = '팀A'`

**페치 조인 사용 코드**
```java
String jpql = "select t from Team t join fetch t.members where t.name = '팀A'"
List<Team> teams = em.createQuery(jpql, Team.class).getResultList();
for(Team team : teams) {
System.out.println("teamname = " + team.getName() + ", team = " + team);
for (Member member : team.getMembers()) {
//페치 조인으로 팀과 회원을 함께 조회해서 지연 로딩 발생 안함
System.out.println(“-> username = " + member.getUsername()+ ", member = " + member);
}
}
```
**결과**
```teamname = 팀A, team = Team@0x100
-> username = 회원1, member = Member@0x200
-> username = 회원2, member = Member@0x300
teamname = 팀A, team = Team@0x100
-> username = 회원1, member = Member@0x200
-> username = 회원2, member = Member@0x300
```

**페치 조인과 DISTINCT**
- select distinct t from Team t join fetch t.members where t.name = ‘팀A’
- SQL에 DISTINCT를 추가하지만 데이터가 다르므로 SQL 결과에서 중복제거 실패
- DISTINCT가 추가로 애플리케이션에서 중복 제거시도
- 같은 식별자를 가진 Team 엔티티 제거

### 페치 조인과 일반 조인의 차이
- 일반 조인 실행시 연관된 엔티티를 함께 조회하지 않음
-  [JPQL]
```JPQL
select t
from Team t join t.members m
where t.name = ‘팀A'
```
- [SQL] 
```sql
SELECT T.*
FROM TEAM T
INNER JOIN MEMBER M ON T.ID=M.TEAM_ID
WHERE T.NAME = '팀A'
```
- JPQL은 결과를 반환할 때 연관관계 고려X
- 단지 SELECT 절에 지정한 엔티티만 조회할 뿐
- 여기서는 팀 엔티티만 조회하고, 회원 엔티티는 조회X
- 페치 조인을 사용할 때만 연관된 엔티티도 함께 조회(즉시 로딩)
- 페치 조인은 객체 그래프를 SQL 한번에 조회하는 개념

### 페치 조인의 특징과 한계
- 페치 조인 대상에는 별칭을 줄 수 없다.
	- 하이버네이트는 가능, 가급적 사용X
- 둘 이상의 컬렉션은 페치 조인 할 수 없다.
- 컬렉션을 페치 조인하면 페이징 API(setFirstResult, setMaxResults)를 사용할 수 없다.
	- 일대일, 다대일 같은 단일 값 연관 필드들은 페치 조인해도 페이징 가능
	- 하이버네이트는 경고 로그를 남기고 메모리에서 페이징(매우 위험)
- 연관된 엔티티들을 SQL 한 번으로 조회 - 성능 최적화
- 엔티티에 직접 적용하는 글로벌 로딩 전략보다 우선함
	- `@OneToMany(fetch = FetchType.LAZY) //글로벌 로딩 전략`
- 실무에서 글로벌 로딩 전략은 모두 지연 로딩
- 최적화가 필요한 곳은 페치 조인 적용

**페치 조인 - 정리**
- 모든 것을 페치 조인으로 해결할 수 는 없음
- 페치 조인은 객체 그래프를 유지할 때 사용하면 효과적
- 여러 테이블을 조인해서 엔티티가 가진 모양이 아닌 전혀 다른 결과를 내야 하면, 페치 조인 보다는 일반 조인을 사용하고 필요한 데이터들만 조회해서 DTO로 반환하는 것이 효과적

