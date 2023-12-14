## 회원 관리 예제
### 1.비즈니스 요구사항 정리
- 데이터 : 회원ID, 이름
- 기능 : 회원 등록, 조회
- DB : 데이터 저장소가 선정되지 않음.

**클래스 의존 관계**

<img src="/img/Spring-boot/ClassDependency.png" alt="ClassDependency" width="300" height="300" />

- 데이터 저장소가 선정되지 않았기 때문에
- 인터페이스로 구현 클래스를 변경할 수 있도록 설계

### 2.회원 도메인과 리포지토리 만들기

#### 회원 객체
```java
package hello.hellospring.domain;

public class Member {
    private Long id;
    private String name;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
}

```
- 데이터 : 회원ID, 이름을 담을 변수 선언 (private로 보호)
- getter와 setter로 캡슐화

#### 회원 리포지토리 인터페이스
```java
package hello.hellospring.repositort;

import hello.hellospring.domain.Member;
import java.util.List;
import java.util.Optional;

public interface MemberRepository {
    Member save(Member member);
    Optional<Member> findById(Long id);
    Optional<Member> findByName(String name);
    List<Member> findAll();

}

```

- save() `추상 메서드`를 생성 : member 객체에 id, name 저장
- findById() `추상 메서드` 생성 : 
	- Optional : 값이 없는 경우를 표현하기 위한 클래스
	- Optional 객체에 접근하기 위해서는 get() 메서드를 사용
- findByName() `추상 메서드` 생성 : 
- findAll() 
	- List : 배열과 비슷하지만 편리한 기능이 더 많은 자료형


#### 회원 리포지토리 메모리 구현체
```java
package hello.hellospring.repositort;
import hello.hellospring.domain.Member;
import java.util.*;

public class MemoryMemberRepository implements MemberRepository {
    private static Map<Long, Member> store = new HashMap<>();
    private static long sequence = 0L;

    @Override
    public Member save(Member member) {
        member.setId(++sequence);
        store.put(member.getId(),member);

        return member;
    }

    @Override
    public Optional<Member> findById(Long id) {

        return Optional.ofNullable(store.get(id));
    }

    @Override
    public Optional<Member> findByName(String name) {

        return store.values().stream()
                .filter(member -> member.getName().equals(name))
                .findAny();
    }

    @Override
    public List<Member> findAll() {
        return new ArrayList<>(store.values());
    }
}

```
- 

