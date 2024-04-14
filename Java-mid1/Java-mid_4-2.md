# 래퍼 클래스

## Java 래퍼 클래스
```java
public class WrapperClassMain {
    public static void main(String[] args) {
        Integer newInteger = new Integer(10);
        Integer integerObj = Integer.valueOf(10);
        Long longObj = Long.valueOf(100);
        Double doubleObj = Double.valueOf(10.5);

        System.out.println("newInteger = " + newInteger);
        System.out.println("integerObj = " + integerObj);
        System.out.println("longObj = " + longObj);
        System.out.println("doubleObj = " + doubleObj);

        System.out.println("내부 값 읽기");
        int intValue = integerObj.intValue();
        System.out.println("intValue = " + intValue);
        long longValue = longObj.longValue();
        System.out.println("longObj = " + longValue);

        System.out.println("비교");
        System.out.println("==: " + (newInteger == integerObj));
        System.out.println("equals: " + newInteger.equals(integerObj));
    }
}
```
- 기본형을 래퍼 클래스로 변경하는 것을 마치 박스에 물건을 넣은 것 같다고 해서 **박싱(Boxing)**이라 한다.
- `new Integer(10)` 은 직접 사용하면 안된다. 작동은 하지만, 향후 자바에서 제거될 예정
	- Integer.valueOf(10)` 를 사용
- `Integer.valueOf()` 에는 성능 최적화 기능이 있다.
	- 마치 문자열 풀과 비슷하게 자주 사용하는 숫자를 미리 생성해두고 재사용


- **intValue() - 언박싱(Unboxing)**
	- 래퍼 클래스에 들어있는 기본형 값을 다시 꺼내는 메서드
	- 박스에 들어있는 물건을 꺼내는 것 같다고 해서 **언박싱(Unboxing)**

## 래퍼 클래스 - 오토 박싱
자바에서 `int` 를 `Integer` 로 변환하거나, `Integer` 를 `int` 로 변환
다음과 같이 `valueOf()` , `intValue()` 메서드를 사용
```java
public class AutoboxingMain1 {
    public static void main(String[] args) {
        int value = 7;
        Integer boxedValue = Integer.valueOf(value);

        int unboxedValue = boxedValue.intValue();

        System.out.println("boxedValue = " + boxedValue);
        System.out.println("unboxedValue = " + unboxedValue);
    }
}
```
- 본형을 래퍼 클래스로 변환하거나 또는 래퍼 클래스를 기본형으로 변환하는 일이 자주 발생
- 오토 박싱 - Autoboxin 도입

**오토 박싱 - Autoboxing**
```java
public class AutoboxingMain2 {
    public static void main(String[] args) {
        int value = 7;
        Integer boxedValue = value; // 오토 박싱

        int unboxedValue = boxedValue; // 오토 언박싱

        System.out.println("boxedValue = " + boxedValue);
        System.out.println("unboxedValue = " + unboxedValue);
    }
}
```
- 오토 박싱과 오토 언박싱은 컴파일러가 개발자 대신 `valueOf` , `xxxValue()` 등의 코드를 추가해주는 기능이다.