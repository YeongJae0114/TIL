# 열거형 - ENUM

## 타입 안전 열거형 패턴
**Type-Safe Enum Pattern**
여기서 영어인 `enum` 은 `enumeration` 의 줄임말인데, 번역하면 열거라는 뜻이고, 어떤 항목을 나열하는 것을 뜻한 다. 우리의 경우 회원 등급인 `BASIC` , `GOLD` , `DIAMOND` 를 나열하는 것이다.
**ClassGrade**
```java
public class ClassGrade {
    public static final ClassGrade BASIC = new ClassGrade();
    public static final ClassGrade GOLD = new ClassGrade();
    public static final ClassGrade DIAMOND = new ClassGrade();

    private ClassGrade(){}
}
```
- 회원 등급을 다루는 클래스 생성
	- 각각의 회원 등급별로 상수를 선언 
- `static` 을 사용해서 상수를 메서드 영역에 선언한다. 
- `final` 을 사용해서 인스턴스(참조값)를 변경할 수 없게 한다.
- `ClassGrade` 의 인스턴스를 생성을 막기위해 
	- 기본 생성자를 `private` 으로 변경
**ClassGradeEx2_1**
```java
package lang.enumeration.ex2;

public class ClassGradeEx2_1 {
    public static void main(String[] args) {
        int price = 10000;
        DiscountService discountService = new DiscountService();
        int BASIC = discountService.discount(ClassGrade.BASIC, price);
        int GOLD = discountService.discount(ClassGrade.GOLD, price);
        int DIAMOND = discountService.discount(ClassGrade.DIAMOND, price);

        System.out.println("BASIC = " + BASIC);
        System.out.println("GOLD = " + GOLD);
        System.out.println("DIAMOND = " + DIAMOND);
    }
}
```
- 각각의 상수는 모두 `ClassGrade` 타입을 기반으로 인스턴스를 만들었기 때문에 `getClass()` 의 결과는 모두 `ClassGrade` 이다.
- 각각의 상수는 모두 서로 각각 다른 `ClassGrade` 인스턴스를 참조하기 때문에 참조값이 다르게 출력된다.


**DiscountService**
```java
public class DiscountService {
    public int discount(ClassGrade classGrade, int price){
        int discountPercent = 0;
        if (classGrade == classGrade.BASIC){
            discountPercent = 10;
        } else if (classGrade == classGrade.GOLD) {
            discountPercent =20;
        } else if (classGrade==classGrade.DIAMOND) {
            discountPercent = 30;
        }else {
            discountPercent = 0 ;
        }
        return price * discountPercent / 100;
    }
}
```
- 값을 비교할 때는 `classGrade == ClassGrade.BASIC` 와 같이 `==` 참조값 비교를 사용

**타입 안전 열거형 패턴"(Type-Safe Enum Pattern)의 장점**
- **타입 안정성 향상**: 정해진 객체만 사용할 수 있기 때문에, 잘못된 값을 입력하는 문제를 근본적으로 방지할 수 있다.
- **데이터 일관성**: 정해진 객체만 사용하므로 데이터의 일관성이 보장된다.

**단점**
이 패턴을 구현하려면 다음과 같이 많은 코드를 작성해야 한다. 그리고 `private` 생성자를 추가하는 등 유의해야 하는 부분들도 있다.



