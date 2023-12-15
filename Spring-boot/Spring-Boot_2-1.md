## 회원 관리 예제
### 1.비즈니스 요구사항 정리
- 데이터 : 회원ID, 이름
- 기능 : 회원 등록, 조회
- DB : 데이터 저장소가 선정되지 않음.

**클래스 의존 관계**

<img src="/img/Spring-boot/ClassDependency.png" alt="ClassDependency" width="500" height="300" />

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
- @Override : 어노테이션 상위 클래스나 인터페이스의 메서드를 재정의
- Map<Long, Member> : Map은 인터페이스를 구현하는 객체로 key와 value로 데이터를 저장하는 구조
	- key의 타입은 Long value의 타입은 Member이다. 
- 0L : long 타입의 0 
**save**
```java
    @Override
    public Member save(Member member) {
        member.setId(++sequence);
        store.put(member.getId(),member);

        return member;
```
- store.put() : 데이터 입력
- 데이터를 입력한 member 객체 반환

**findById**
```java
    @Override
    public Optional<Member> findById(Long id) {

        return Optional.ofNullable(store.get(id));
    }
```
- Optional.ofNullable() : 만약 값이 존재하지 않으면 빈 Optional을 반환
- store.get() : 원하는 데이터 출력 

**findByName**
```java
    @Override
    public Optional<Member> findByName(String name) {

        return store.values().stream()
                .filter(member -> member.getName().equals(name))
                .findAny();
    }
```
- store.values() 저장된 모든 값을 컬렉션 행태로 반환
	- 컬렉션(collection) : 많은 수의 데이터를 그 사용 목적에 적합한 자료구조로 묶어 하나로 그룹화한 객체
- Stream() : filter, map, reduce, find, match, sort등의 함수형 프로그래밍 언어에서 일반적으로 지원하는 연산과 데이터베이스와 비슷한 연산을 지원
	- filter() : 특정 조건을 만족하는 데이터만 걸러낸다
	- 람다식(Lambda) : `(매개변수, ...) -> { 실행문 ... }` 기호는 매개 변수를 이용해서 중괄호 { } 바디를 실행
	- findAny() : filter 조건에 일치하는 element 1개를 Optional로 리턴

**findAll**
```java
    @Override
    public List<Member> findAll() {
        return new ArrayList<>(store.values());
    }
```
- 메서드의 반환 타입은 List이며, 그 안에는 Member 객체가 들어간다.
- new ArrayList<>(store.values()): store 맵에 저장된 모든 회원 정보







