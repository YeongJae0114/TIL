# 불변 객체

## 불변 객체 도입
**ImmutableAddress**
```java
package lang.immutable.address;

public class ImmutableAddress {
    private final String value;

    public ImmutableAddress(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }


    @Override
    public String toString() {
        return "Address{" +
                "value='" + value + '\'' +
                '}';
    }
}
```
- 내부의 값이 변경되면 안되기 때문에 final 선언
- 값을 변경할 수 있는 setter 제거
- 생성자로만 값을 설정할 수 있고, 이후에는 불가

```java
package lang.immutable.address;

public class RefMain2 {
    public static void main(String[] args) {
        ImmutableAddress a = new ImmutableAddress("서울");
        ImmutableAddress b = a;

        System.out.println("a = " + a);
        System.out.println("b = " + b);

        // b.setValue("부산");
		b = new ImmutableAddress("부산");
        System.out.println("부산 -> b");
        System.out.println("a = " + a);
        System.out.println("b = " + b);
    }
}
```
- 단순한 제약을 사용해서 사이드 이펙트 문제를 해결
- b.setValue 메서드 자체가 제거
- ImmutableAddress 인스턴스의 값을 변경할 수 있는 방법은 없다.
- b.setValue 가 없기 때문에 프로그래머는 불변 객체임을 인지
