# String 클래스

## StringBuilder - 가변 String
불변인 `String` 의 내부 값은 변경할 수 없다. 따라서 변경된 값을 기반으로 새로운 `String` 객체를 생성
 
많은 문자를 더하는 경우 
```java
String str = "A" + "B" + "C" + "D";
String str = String("A") + String("B") + String("C") + String("D");
String str = new String("AB") + String("C") + String("D");
String str = new String("ABC") + String("D");
String str = new String("ABCD");
```
- 이 경우 총 3개의 `String` 클래스가 추가로 생성된다.
- 중간에 만들어진 `new String("AB")` , `new String("ABC")` 는 사용되지 않는다.

**단점**
- 불변인 `String` 클래스의 단점은 문자를 더하거나 변경할 때 마다 계속해서 새로운 객체를 생성
	- 자원을 더 많이 사용하게 된다.

**이런 문제를 해결하기 위해 자바는 `StringBuilder` 라는 가변 `String` 을 제공**

### StringBuilder 사용
```java
public class StringBuilderMain1_1 {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        sb.append("A");
        sb.append("B");
        sb.append("C");
        sb.append("D");
        System.out.println("sb = " + sb);

        sb.insert(4,"java");
        System.out.println("sb = " + sb);

        sb.delete(4,8);
        System.out.println("sb = " + sb);

        sb.reverse();
        System.out.println("sb = " + sb);

        String string = sb.toString();
        System.out.println(string);
    }
}
```
- StringBuilder` 객체를 생성한다.
- `append()` 메서드를 사용해 여러 문자열을 추가한다.
- `insert()` 메서드로 특정 위치에 문자열을 삽입한다. 
- `delete` () 메서드로 특정 범위의 문자열을 삭제한다. 
- `reverse()` 메서드로 문자열을 뒤집는다.
- 마지막으로 `toString` 메소드를 사용해 `StringBuilder` 의 결과를 기반으로 `String` 을 생성해서 반환한 다.

**주의**
- 메모리 사용을 줄이고 성능을 향상시킬 수 있다. 단 사이드 이펙트를 주의해야 한다.
- `StringBuilder` 는 보통 문자열을 변경하는 동안만 사용하다가 문자열 변경이 끝나면 안전한(불변) `String` 으로 변환하는 것이 좋다.


## String 최적화

**자바의 String 최적화**
자바 컴파일러는 다음과 같이 문자열 리터럴을 더하는 부분을 자동으로 합쳐준다.
**String 변수 최적화**
문자열 변수의 경우 그 안에 어떤 값이 들어있는지 컴파일 시점에는 알 수 없기 때문에 단순하게 합칠 수 없다. 
```java
String result = str1 + str2;
```
최적화 방식은 자바 버전에 따라 달라진다

### 최적화가 어려운 경우

다음과 같이 문자열을 루프안에서 문자열을 더하는 경우에는 최적화가 이루어지지 않는다.

```java
public class LoopStringMain {
    public static void main(String[] args) {
        Long startTime = System.currentTimeMillis();
        String result = "";
        for (int i = 0; i < 100000; i++) {
            result += "Hello Java ";
        }
        long endTime = System.currentTimeMillis();
        System.out.println("result = " + result);
        System.out.println("time = " + (endTime - startTime) + "ms");
    }
}

```
왜냐하면 대략 다음과 같이 최적화 되기 때문이다.
```java
String result = "";
 for (int i = 0; i < 100000; i++) {
     result = new StringBuilder().append(result).append("Hello Java
 ").toString();
}
```
- 반복문의 루프 내부에서는 최적화가 되는 것 처럼 보이지만, 반복 횟수만큼 객체를 생성하기 때문에 
- 100,000번의 `String` 객체를 생성했을 것이다.

**해결**

이럴 때는 직접 `StringBuilder` 를 사용하면 된다.
```java
public class LoopStringBuilderMain {
    public static void main(String[] args) {
        long startTime = System.currentTimeMillis();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 100000; i++) {
            sb.append("Hello Java ");
        }
        String result = sb.toString();
        long endTime = System.currentTimeMillis();
        System.out.println("result = " + result);
        System.out.println("time = " + (endTime - startTime) + "ms");
    }
}

```

