# Object 클래스

## equals() - 동일성과 동등성
자바는 두 객체가 같다라는 표현을 2가지로 분리해서 제공한다.

- 동일성(Identity) : `==` 연산자를 사용해서 두 객체의 참조가 동일한 객체를 가리키고 있는지 확인
- 동등성(Equality) : `equals()`	 메서드를 사용해서 두 객체가 논리적으로 동등한지 확인 

**UserV1**
```java
package lang.object.equals;

public class UserV1 {
    private String id;

    public UserV1(String id) {
        this.id = id;
    }
}
```

**EqualsMain**
```java
package lang.object.equals;

public class EqualsMain {
    public static void main(String[] args) {
        UserV1 user1 = new UserV1("asd-1");
        UserV1 user2 = new UserV1("asd-1");

        System.out.println("identity = " + (user1 == user2));
        System.out.println("equality = " + user1.equals(user2));
    }
}
```
**출력**
```text
identity = false
equality = false
```
**동일성 비교**
```
user1 == user2
x001 == x002
false //결과
```
- `Object` 가 기본으로 제공하는 `equals()` 는 `==` 으로 동일성 비교를 제공한다.
- 따라서 동등성 비교를 사용하고 싶으면 `equals()` 메서드를 재정의해야 한다. 
- 그렇지 않으면 `Object` 는 동일성 비교를 기본으로 제공한다.

## equals() - 동등성 구현
**UserV2**
```java
package lang.object.equals;

import java.util.Objects;

public class UserV2 {
    private String id;

    public UserV2(String id) {
        this.id = id;
    }


/*    @Override
    public boolean equals(Object obj) {
        UserV2 user = (UserV2)obj;
        return id.equals(user.id);
    }*/

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserV2 userV2 = (UserV2) o;
        return Objects.equals(id, userV2.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
```
- `Object` 의 `equals()` 메서드를 재정의했다.
- `UserV2` 의 동등성은 `id` (고객번호)로 비교한다.
- `equals()` 는 `Object` 타입을 매개변수로 사용한다. 
	- 따라서 객체의 특정 값을 사용하려면 다운캐스팅이 필요하다.
- 여기서는 현재 인스턴스( `this` )에 있는 `id` 문자열과 비교 대상으로 넘어온 객체의 `id` 문자열을 비교한다.
- `UserV2` 에 있는 `id` 는 `String` 이다. 문자열 비교는 `==` 이 아니라 `equals()` 를 사용해야 한다.

- 정확한 equals() 구현은 IDE 자동 생성했다

**EqualsMain2**
```java
package lang.object.equals;

public class EqualsMain2 {
    public static void main(String[] args) {
        UserV2 user1 = new UserV2("asd-1");
        UserV2 user2 = new UserV2("asd-1");

        System.out.println("identity = " + (user1 == user2));
        System.out.println("equality = " + user1.equals(user2));
    }
}
```
**실행 결과**
```
identity = false
equality = true
```
