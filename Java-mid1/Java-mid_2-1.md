# 불변 객체

## 공유 참조와 사이드 이펙트
사이드 이펙트는 프로그래밍에서 어떤 계산이 주된 작업 외에 추가적인 부수효과를 일으키는 것을 말한다.
**Address**
```java
package lang.immutable.address;

public class Address {
    private String value;

    public Address(String value) {
        this.value = value;
    }

// getter, setter

//@Override toString() 
 }
```

**사이드 이펙트 발생**
```java
package lang.immutable.address;

public class RefMain1_1 {
    public static void main(String[] args) {
        Address a = new Address("서울");
        Address b = a;

        System.out.println("a = " + a);
        System.out.println("b = " + b);

        b.setValue("부산");
        System.out.println("부산 -> b");
        System.out.println("a = " + a);
        System.out.println("b = " + b);
    }
}
```

**출력**
```text
a = Address{value='서울'}
b = Address{value='서울'}
부산 -> b
a = Address{value='부산'}
b = Address{value='부산'}
```

**사이드 이펙트 해결**
```java
package lang.immutable.address;

public class RefMain1_2 {
    public static void main(String[] args) {
        Address a = new Address("서울");
        Address b = new Address("서울");

        System.out.println("a = " + a);
        System.out.println("b = " + b);

        b.setValue("부산");
        System.out.println("부산 -> b");
        System.out.println("a = " + a);
        System.out.println("b = " + b);
    }
}
```
**출력**
```text
a = Address{value='서울'}
b = Address{value='서울'}
부산 -> b
a = Address{value='서울'}
b = Address{value='부산'}
```

#### 여러 변수가 하나의 객체를 공유하는 것을 막을 방법은 없다
`Address a = new Address("서울"); Address b = a;` 부분에서 a, b 가 함께 공유 되기 때문에 사이드 이펙트가 발생했다. 객체를 공유하지 않으면 문제가 발생하지 않지만 객체를 공유하는 것은 java 문법엔 아무런 문제가 없으므로 프로그래머의 주의가 필요하다. 공유하면 안되는 객체를 만드는 방법을 소개하겠다.
