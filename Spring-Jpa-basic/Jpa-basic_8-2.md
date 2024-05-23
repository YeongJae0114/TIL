## 즉시로딩과 지연로딩
**Member를 조회할 때 Team도 함께 조회해야 할까?**
- 즉시로딩 : Member를 조회할 때 Team도 바로 조회하는 퀴리 생성 
- 지연로딩 : Member를 조회할 때 Team은 프록시 객체로 조회 (db 조회를 미룸)

## 지연로딩 LAZY을 사용해서 프록시로 조회
```java
@Entity
public class Member {
	@Id
	@GeneratedValue
	private Long id;

	@Column(name = "USERNAME")
	private String name;

	@ManyToOne(fetch = FetchType.LAZY) //**
	@JoinColumn(name = "TEAM_ID")
	
	private Team team;
	..
}
```

<img src="/img/Jpa-basic/jpa8-2_1.png" alt="jpa" width="560" height="260" />


## 즉시로딩 EAGER를 사용해서 프록시로 조회
```java
@Entity
public class Member {
	@Id
	@GeneratedValue
	private Long id;

	@Column(name = "USERNAME")
	private String name;

	@ManyToOne(fetch = FetchType.EAGER) //**
	@JoinColumn(name = "TEAM_ID")
	
	private Team team;
	..
}
```

<img src="/img/Jpa-basic/jpa8-2_2.png" alt="jpa" width="530" height="130" />

## 프록시와 즉시로딩 주의
- 가급적 지연 로딩만 사용(특히 실무에서)
- 즉시 로딩을 적용하면 예상하지 못한 SQL이 발생
- 즉시 로딩은 JPQL에서 N+1 문제를 일으킨다.
- @ManyToOne, @OneToOne은 기본이 즉시 로딩 -> LAZY로 설정
- @OneToMany, @ManyToMany는 기본이 지연 로딩

## 지연로딩 활용 - 실무
- 모든 연관관계에 지연 로딩을 사용해라!
- 실무에서 즉시 로딩을 사용하지 마라!
- JPQL fetch 조인이나, 엔티티 그래프 기능을 사용해라! 
- 즉시 로딩은 상상하지 못한 쿼리가 나간다.