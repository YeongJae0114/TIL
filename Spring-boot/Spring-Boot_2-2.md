### 테스트 케이스 작성

#### 회원 리포지토리 메모리 구현체 테스트

`src/test/java` 하위 폴더에 생성
```java
package hello.hellospring.repository;

import hello.hellospring.domain.Member;
import hello.hellospring.repositort.MemoryMemberRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
class MemoryMemberRepositoryTest {
    MemoryMemberRepository repository = new MemoryMemberRepository();

    @AfterEach
    public void afterEach(){
        repository.clearStore();
    }

    @Test
    public void save(){
        Member member = new Member();
        member.setName("spring");

        repository.save(member);

        Member result = repository.findById(member.getId()).get();
        // System.out.println(result==member);
        // 검증하기(메모리에서 꺼낸 것과 member가 같은가 검증)
        //Assertions.assertEquals(member, result);
        assertThat(result).isEqualTo(member);
    }

    @Test
    public void findByName(){
        Member member1 = new Member();
        member1.setName("spring1");
        repository.save(member1);

        Member member2 = new Member();
        member2.setName("spring2");
        repository.save(member2);

        Member result = repository.findByName("spring1").get();
        assertThat(result).isEqualTo(member1);
    }

    @Test
    public void findAll(){
        Member member1 = new Member();
        member1.setName("spring1");
        repository.save(member1);

        Member member2 = new Member();
        member2.setName("spring2");
        repository.save(member2);

        List<Member> result = repository.findAll();
        assertThat(result.size()).isEqualTo(2);
    }

}

```
- assertThat() : actual 인자에 검증대상(실행 단계의 결과)을 넣고, 이와 비교하는 로직(matcher)을 주입받아 검증 단계를 수행
	- `import static org.assertj.core.api.Assertions.*;`으로 Assertions 생략

**MemoryMemberRepository.java**
```java
    public void clearStore(){
        store.clear();
    }
```

**@AfterEach**
```java
    @AfterEach
    public void afterEach(){
        repository.clearStore();
    }
```
- @AfterEach 어노테이션이 명시된 메서드는 테스트 메서드 실행 후에 무조건 실행
	- 한번에 여러 테스트를 진행하면 메모리 DB에 직전의 테스트 결과가 남을 수 있기 때문에 (메모리를 비워준다)
- 테스트는 각각 독립적으로 실행되어야 한다. 테스트 순서에 의존관계가 있는 것은 좋지 않다
- **Test주도계발 (TDD)** 이라고 한다
	- 설계 단계에서 프로그래밍 목적을 반드시 미리 정의하고, 테스트해야할 테스트 케이스를 작성
	- 큰 프로젝트에서 많이 사용되는 계발 과정




