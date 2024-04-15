# 열거형 - ENUM

## 문자열과 타입 안전성
열거형이 만들어진 이유와 사용 방법을 예제를 통해 알아보자
**비즈니스 요구사항**
고객은 3등급으로 나누고, 상품 구매시 등급별로 할인을 적용한다. 할인시 소수점 이하는 버린다. 
- `BASIC` 10% 할인
- `GOLD` 20% 할인 
- `DIAMOND` 30% 할인

**DiscountService**
```java
public class DiscountService {
    public  int discount(String grade, int price){
        int discountPercent = 0;
        if (grade.equals("BASIC")){
            discountPercent = 10;
        } else if (grade.equals("GOLD")) {
            discountPercent = 20;
        }else if (grade.equals("DIAMOND")){
            discountPercent = 30;
        }else {
            System.out.println(grade + ": 할인 X");
        }
        return price * discountPercent / 100;
    }
}
```
- 등급별로 할인 금액을 리턴하는 서비스 클래스이다. 

**StringGradeEx0_1**
```java
public class StringGradeEx0_1 {
    public static void main(String[] args) {
        int price = 10000;

        DiscountService discountService = new DiscountService();
        int basic = discountService.discount("BASIC", price);
        int gold = discountService.discount("GOLD", price);
        int diamond = discountService.discount("DIAMOND", price);

        System.out.println(basic);
        System.out.println(gold);
        System.out.println(diamond);
    }
}
```
- 각각의 회원 등급에 맞는 할인이 적용
- 그러나 단순히 문자열을 입력하는 방식은 오타가 발생하기 쉽고, 유효하지 않은 값이 입력될 수 있다.
- 오류 시나리오
	- 존재하지 않은 등급 입력
	- 오타
	- 대소문자 구분 X
	- **컴파일 시 오류 감지 불가** 

