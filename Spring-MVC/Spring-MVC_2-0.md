## 회원관리 웹 애플리케이션 요구사항
- 회원 정보
	- 이름 : username
	- 나이 : age
- 기능 요구사항
	- 회원 저장
	- 회원 목록 조회

**회원 도메인 모델**
```java
package hello.servlet.domain.member;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Member {
    private Long id;
    private String username;
    private int age;

    public Member(){}

    public Member(String username, int age){
        this.username = username;
        this.age = age;
    }
}

```
- Lombok :Java 라이브러리로 반복되는 getter, setter, toString 등의 메서드 작성 코드를 줄여준다.


**회원 저장소**
```java
package hello.servlet.domain.member;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MemberRepository {
    private static Map<Long, Member> store = new HashMap<>();
    private static long sequence = 0L;

    private static MemberRepository instance = new MemberRepository();

    public static MemberRepository getInstance(){
        return instance;
    }
    private MemberRepository(){
    }

    public Member save(Member member){
        member.setId(++sequence);
        store.put(member.getId(), member);
        return member;
    }
    public Member findById(Long id){
        return store.get(id);
    }
    public List<Member> findAll(){
        return new ArrayList<>(store.values());
    }
    public void clearStore(){
        store.clear();
    }
}

```
- 싱글톤 : 객체의 인스턴스를 한개만 생성되게 하는 패턴
	- `private static`을 선언하고 getInstance 메서드를 만들고 이미 생성한 instance를 반환한다.

**회원 저장소 테스트 코드**
```java
package hello.servlet.domain.Member;

import hello.servlet.domain.member.Member;
import hello.servlet.domain.member.MemberRepository;

import org.junit.jupiter.api.AfterEach;
import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import java.util.List;

public class MemberRepositoryTest {
    MemberRepository memberRepository = MemberRepository.getInstance();

    @AfterEach
    void afterEach(){
        memberRepository.clearStore();
    }
    @Test
    void save(){
        // given
        Member member = new Member("hello",20);

        // when
        Member savedMember = memberRepository.save(member);

        //then
        Member findMember = memberRepository.findById(savedMember.getId());
        assertThat(findMember).isEqualTo(savedMember);
    }
    @Test
    void findAll(){
        //give
        Member member1 = new Member("member1", 20);
        Member member2 = new Member("member2", 30);

        memberRepository.save(member1);
        memberRepository.save(member2);
        // when
        List<Member> result = memberRepository.findAll();

        // then
        assertThat(result.size()).isEqualTo(2);
        assertThat(result).contains(member1, member2);
    }
}
```
- 테스트 코드로 잘 동작 하는지 확인
- AssertJ는 많은 assertion을 제공하는 자바 라이브러리
	- 에러 메세지와 테스트 코드의 가독성을 높임


