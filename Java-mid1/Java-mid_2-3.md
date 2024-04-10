# 불변 객체

## 불변 객체 - 값 변경
불변 객체를 사용하지만 그래도 값을 변경해야하는 메서드가 필요한 경우

### 변경 가능한 객체
```java
package lang.immutable.change;

public class MutableObj {
    private int value;

    public MutableObj(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
    public void add(int addValue){
        this.value += addValue;
    }
}
```

```java
package lang.immutable.change;

public class MutableMain {
    public static void main(String[] args) {

        MutableObj obj = new MutableObj(10);
        obj.add(20);
        System.out.println("obj = "+obj.getValue());
    }
}

```

**실행 결과**
```text
obj = 30
```
- `MutableObj` 을 `10` 이라는 값으로 생성
- 이후에 `obj.add(20)` 을 통해서 `10 + 20` 을 수행
	- 계산 이후에 기존에 있던 `10` 이라는 값은 사라진다.
	- `MutableObj` 의 상태(값)가 `10` `30` 으로 변경
- `obj.getValue()` 를 호출하면 `30` 이 출력

## 불변 객체 
```java
package lang.immutable.change;

public class ImmutableObj {
    private final int value;

    public ImmutableObj(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
    public ImmutableObj add (int addValue){
        return new ImmutableObj(value + addValue);
    }
}
```
- 불변 객체는 기존 값은 변경하지 않고 대신에 계산 결과를 바탕으로 새로운 객체를 만들어서 반환

```java
package lang.immutable.change;

public class ImmutableMain {
    public static void main(String[] args) {

        ImmutableObj obj1 = new ImmutableObj(10);
        ImmutableObj obj2 = obj1.add(20);
        System.out.println("obj1 = "+obj1.getValue());
        System.out.println("obj2 = "+obj2.getValue());
    }
}
```
**실행 결과**
```text
obj1 = 10
obj2 = 30
```

>**참고 - withXxx()**
불변 객체에서 값을 변경하는 경우 `withYear()` 처럼 "with"로 시작하는 경우가 많다.
예를 들어 "coffee with sugar"라고 하면, 커피에 설탕이 추가되어 원래의 상태를 변경하여 새로운 변형을 만든다는 것을 의미한다.
이 개념을 프로그래밍에 적용하면, 불변 객체의 메서드가 "with"로 이름 지어진 경우, 그 메서드가 지정된 수정사항을 포함하는 객체의 새 인스턴스를 반환한다는 사실을 뜻한다.
정리하면 "with"는 관례처럼 사용되는데, 원본 객체의 상태가 그대로 유지됨을 강조하면서 변경사항을 새 복사본에 포 함하는 과정을 간결하게 표현한다.