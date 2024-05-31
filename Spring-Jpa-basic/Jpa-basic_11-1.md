## JPQL 경로 표현식
-  .(점)을 찍어 객체 그래프를 탐색하는 것
```java
select m.username -> 상태 필드
	from Member m
		join m.team t -> 단일 값 연관 필드
		join m.orders o -> 컬렉션 값 연관 필드
where t.name = '팀A'
```
**경로 표현식 용어 정리**
- 상태 필드(state field): 단순히 값을 저장하기 위한 필드
	- (ex: m.username)
- 연관 필드(association field): 연관관계를 위한 필드
	- 단일 값 연관 필드:
		- @ManyToOne, @OneToOne, 대상이 엔티티(ex: m.team)
	- 컬렉션 값 연관 필드:
		- @OneToMany, @ManyToMany, 대상이 컬렉션(ex: m.orders)

**경로 표현식 특징**
- 상태 필드(state field): 경로 탐색의 끝, 탐색 X
- 단일 값 연관 경로 : 묵시적 내부 조인 발생, 탐색 O
	- 표현식에서 알기 어려운 join 발생 -> 실무에서 사용 X
- 컬렉션 값 연관 경로 : 묵시적 내부 조인 발생, 탐색 X

**경로 탐색을 사용한 묵시적 조인 시 주의사항**
- 항상 내부 조인
- 컬렉션은 경로 탐색의 끝, 명시적 조인을 통해 별칭을 얻어야함
- 경로 탐색은 주로 SELECT, WHERE 절에서 사용하지만 묵시적 조인으로 인해 SQL의 FROM (JOIN) 절에 영향을 줌



