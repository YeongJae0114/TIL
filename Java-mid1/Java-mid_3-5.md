# String 클래스

## 메서드 체이닝 - Method Chaining
```java
public class ValueAdder {
    private int value;

    public ValueAdder add(int value){
        this.value += value;
        return this;
    }

    public int getValue() {
        return value;
    }
}
```
- 단순히 값을 누적해서 더하는 기능을 제공하는 클래스
- `add()` 메서드를 호출할 때 마다 내부의 `value` 에 값을 누적
- `add()` 메서드를 보면 자기 자신( `this` )의 참조값을 반환.


```java
public class MethodChainingMain1 {
    public static void main(String[] args) {
        ValueAdder adder = new ValueAdder();
        ValueAdder adder1 = adder.add(1);
        ValueAdder adder2 = adder.add(2);
        ValueAdder adder3 = adder.add(3);


        int result = adder.getValue();
        System.out.println("result : " + result);
        System.out.println("adder : " + adder);
        System.out.println("adder1 : " + adder1);
        System.out.println("adder2 : " + adder2);
        System.out.println("adder3 : " + adder3);
    }
}
```
- add()` 메서드를 여러번 호출해서 값을 누적해서 더하고 출력한다.
- `add()` 메서드의 반환값은 사용하지 않았다.


```java
public class MethodChainingMain2 {
    public static void main(String[] args) {
        ValueAdder adder = new ValueAdder();
        int result = adder.add(1).add(2).add(3).getValue();

        System.out.println("result : " + result);
    }
```
- `add()` 메서드는 자기 자신( `this` )의 참조값을 반환한다. 이 반환값을 `adder1` , `adder2` , `adder3` 에 보관 했다.
- 따라서 `adder` , `adder1` , `adder2` , `adder3` 은 모두 같은 참조값을 사용