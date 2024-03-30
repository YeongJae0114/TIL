## 회원 도메인 개발

### 회원 리포지토리 개발
**MemberRepository**
```java
@Repository
public class MemberRepository{
    @PersistenceContext
    private EntityManager em;

    public void save(Member member){
        em.persist(member);
    }
    public Member findOne(Long id){
        return em.find(Member.class, id);
    }

    public List<Member>findAll(){
        return em.createQuery("select m from Member m", Member.class)
                .getResultList();
    }
    public List<Member>findByName(String name){
        return em.createQuery("select m from Member m where m.name = :name", Member.class)
                .setParameter("name", name)
                .getResultList();
    }
}
```
- `@Repository` : 스프링 빈으로 등록, JPA 예외를 스프링 기반 예외로 예외 변환 
- `@PersistenceContext` : 엔티티 메니저(`EntityManager`) 주입 
- `@PersistenceUnit` : 엔티티 메니터 팩토리(`EntityManagerFactory`) 주입


### 회원 서비스 개발
**MemberService**
```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    // 회원 가입
    @Transactional
    public Long join(Member member){
        validateDuplicateMember(member);
        memberRepository.save(member);
        return member.getId();
    }

    private void validateDuplicateMember(Member member) {
        List<Member> findMember = memberRepository.findByName(member.getName());
        if (!findMember.isEmpty()){
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        }
    }

    // 회원 전체 조회
    public List<Member>findMembers(){
        return memberRepository.findAll();
    }
    public Member findOne(Long memberId){
        return memberRepository.findOne(memberId);
    }
}
```
- `@Service`
- `@Transactional` : 트랜잭션, 영속성 컨텍스트
	- `readOnly=true` : 데이터의 변경이 없는 읽기 전용 메서드에 사용, 영속성 컨텍스트를 플러시 하지 않으므로 약간의 성능 향상(읽기 전용에는 다 적용)
	- 데이터베이스 드라이버가 지원하면 DB에서 성능 향상 
- `@Autowired` : 생성자 Injection 많이 사용, 생성자가 하나면 생략 가능



#### 생성자 주입 방법
- `@Autowired`
	- 생성자가 하나면 생략 가능
**Lombok 사용**
- `@AllArgsConstructor`
	- 생성자을 자동으로 만들어준다
```java
public MemberService(MemberRepository memberRepository) {
         this.memberRepository = memberRepository;
}
```

- `@RequiredArgsConstructor`
	- final 키워드가 있는 필드의 생성자 생성
		- 컴파일 시점에 `memberRepository` 를 설정하지 않는 오류를 체크 가능
```java
private final MemberRepository memberRepository;
```

### 회원 도메인 테스트 코드
```java
@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class MemberServiceTest {
    @Autowired MemberService memberService;
    @Autowired MemberRepository memberRepository;

    @Test
    public void 회원가입() throws Exception{
        //given
        Member member = new Member();
        member.setName("kim");
        //when
        Long saveId = memberService.join(member);
        //then
        Assert.assertEquals(member, memberRepository.findOne(saveId));
    }
    @Test
    public void 중복_회원_예외() throws Exception{
        //given
        Member member1 = new Member();
        member1.setName("kim");

        Member member2 = new Member();
        member2.setName("kim");
        //when
        memberService.join(member1);
        memberService.join(member2);

        //then
        Assert.fail("예외가 발생해야 한다");
    }
}
```