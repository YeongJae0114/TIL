# 열거형 - ENUM

## 열거형 - Enum Type
**ENUM - 주요 메서드**
- **values()**: 모든 ENUM 상수를 포함하는 배열을 반환한다.
- **valueOf(String name)**: 주어진 이름과 일치하는 ENUM 상수를 반환한다.
- **name()**: ENUM 상수의 이름을 문자열로 반환한다.
- **ordinal()**: ENUM 상수의 선언 순서(0부터 시작)를 반환한다.
- **toString()**: ENUM 상수의 이름을 문자열로 반환한다. `name()` 메서드와 유사하지만, `toString()` 은 직접 오버라이드 할 수 있다.

>**열거형 정리** 
열거형은 `java.lang.Enum` 를 자동(강제)으로 상속 받는다. 열거형은 이미 `java.lang.Enum` 을 상속 받았기 때문에 추가로 다른 클래스를 상속을 받을 수 없다. 열거형은 인터페이스를 구현할 수 있다. 열거형에 추상 메서드를 선언하고, 구현할 수 있다. 이 경우 익명 클래스와 같은 방식을 사용한다. 익명 클래스는 뒤에서 다룬다.


**Grade**
```java
public enum Grade {
    BASIC(10), GOLD(20), DIAMOND(30);

    private final int discountPercent;

    Grade(int discountPercent) {
        this.discountPercent = discountPercent;
    }

    public int getDiscountPercent() {
        return discountPercent;
    }
}
```
- discountPercent` 필드를 추가하고, 생성자를 통해서 필드에 값을 저장
- `BASIC(10)` 과 같이 상수 마지막에 괄호를 열고 생성자에 맞는 인수를 전달하면 적절한 생성자가 호출
- 값을 조회하기 위해 `getDiscountPercent()` 메서드를 추가했다. 열거형도 클래스이므로 메서드를 추가

**DiscountService**
```java
public class DiscountService {
    public  int discount(Grade grade, int price){
        return price * grade.getDiscountPercent() / 100;
    }
}
```

**EnumRefMain2**
```java
public class EnumRefMain2 {
    public static void main(String[] args) {
        int price = 10000;

        DiscountService discountService = new DiscountService();

        int BASIC = discountService.discount(Grade.BASIC, price);
        int GOLD = discountService.discount(Grade.GOLD, price);
        int DIAMOND = discountService.discount(Grade.DIAMOND, price);

        System.out.println("BASIC = " + BASIC);
        System.out.println("GOLD = " + GOLD);
        System.out.println("DIAMOND = " + DIAMOND);
    }
}
```