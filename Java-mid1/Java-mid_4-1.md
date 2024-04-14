# 래퍼 클래스
**기본형의 한계**
자바 안에 객체가 아닌 것으로는 바로 `int` , `double` 같은 가본형이 있다.
기본형은 객체가 아님으로 다음과 같은 한계가 있다.
- 객체가 아님으로 유용한 메서드를 제공할 수 없다.
- null 값을 가질 수 없다.

## 기본형의 한계 1
**기본형 사용**
```java
public class MyIntegerMethodMain0 {
    public static void main(String[] args) {
        int value = 10;
        int i1 = compareTo(value, 5);
        int i2 = compareTo(value, 10);
        int i3 = compareTo(value, 20);
        System.out.println("i1 = " + i1);
        System.out.println("i2 = " + i2);
        System.out.println("i3 = " + i3);
    }
    public static int compareTo(int value, int target) {
        if (value < target) {
            return -1;
        } else if (value > target) {
            return 1;
        } else {
            return 0;
        }
    }
}
```
- `value` 와 비교 대상 값을 `compareTo()` 라는 외부 메서드를 사용해서 비교

**래퍼 클래스 사용**
래퍼 클래스 : 특정 기본형을 감싸서(Wrap) 만드는 클래스
```java
public class MyInteger {
    private int value;

    public MyInteger(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public int compareTo(int target) {
        if (value < target) {
            return -1;
        } else if (value > target) {
            return 1;
        } else {
            return 0; }
    }
    @Override
    public String toString() {
        return String.valueOf(value);
    }
}
```

```java
public class MyIntegerMethodMain1 {
    public static void main(String[] args) {
        MyInteger myInteger = new MyInteger(5);
        int i1 = myInteger.compareTo(5);
        int i2 = myInteger.compareTo(10);
        int i3 = myInteger.compareTo(20);

        System.out.println("i1 = " + i1);
        System.out.println("i2 = " + i2);
        System.out.println("i3 = " + i3);
    }
}
```
- `myInteger.compareTo()` 는 자기 자신의 값을 외부의 값과 비교
- `MyInteger` 는 객체이므로 자신이 가진 메서드를 편리하게 호출
	- `int` 는 기본형이기 때문에 스스로 메서드를 가질 수 없다.


## 기본형의 한계 2
**기본형과 null**
기본형은 항상 값을 가져야 한다. 하지만 때로는 데이터가 '없음'이라는 상태가 필요할 수 있다.
```java
public class MyIntegerNullMain0 {
    public static void main(String[] args) {
        int intArr[] = {-1, 0, 1,2,3,};
        
        System.out.println("intArr = " + findValue(intArr,-1));
        System.out.println("intArr = " + findValue(intArr,-0));
        System.out.println("intArr = " + findValue(intArr,1));
        System.out.println("intArr = " + findValue(intArr,100));


    }
    public  static int findValue(int[]intArr, int target){
        for (int value : intArr) {
            if (value == target) {
                return value;
            }
        }
        return -1;
    }
}
```

- `findValue()` 는 배열에 찾는 값이 있으면 해당 값을 반환하고, ****찾는 값이 없으면** `-1` **을 반환**
- 하지만 반환 값은 항상 integer 형태만 가능
  - 데이터가 없다는 null 이라는 표현을 사용할 수 없음


```java
public class MyIntegerNullMain1 {
    public static void main(String[] args) {
        MyInteger[] intArr = {new MyInteger(-1)
                , new MyInteger(0), new MyInteger(1)};

        System.out.println("intArr = " + findValue(intArr,-1));
        System.out.println("intArr = " + findValue(intArr,-0));
        System.out.println("intArr = " + findValue(intArr,1));
        System.out.println("intArr = " + findValue(intArr,100));


    }
    public static MyInteger findValue(MyInteger[] intArr, int target){
        for (MyInteger myInteger : intArr) {
            if (myInteger.getValue() == target) {
                return myInteger;
            }
        }
        return null;
    }
}
```

- 앞서 만든 `MyInteger` 래퍼 클래스를 사용
- 실행 결과를 보면 `-1` 을 입력했을 때는 `-1` 을 반환
- `100` 을 입력했을 때는 값이 없다는 `null` 을 반환