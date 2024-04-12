# String 클래스

## String 클래스 기본
자바에서 문자를 다루는 대표적인 타입은 `char`와 `String` 2가지가 있다.
```java
public class CharArrayMain {
     public static void main(String[] args) {
         char[] charArr = new char[]{'h', 'e', 'l', 'l', 'o'};
         System.out.println(charArr);
         String str = "hello";
         System.out.println("str = " + str);
     }
}
```
- char : 문자 하나를 다룰 때 사용
- String : char[]을 편하게 다룰 수 있는 클래스
	- 객체 생성: `new String("hello");`

String은 클래스이다. int 와 같은 기본형이 아니라 참조형이다. 따라서 str 변수에는 String 인스턴스의 참조값만 들어가 수 있다. 매우 자주 사용되기 때문에 편의상 `String str = "hello";` 를 `new String("hello")`로 변경해준다.

### String 구조
```java
public final class String {
	//문자열 보관
	private final char[] value;// 자바 9 이전 
	private final byte[] value;// 자바 9 이후
	//여러 메서드
	public String concat(String str) {...} 
	public int length() {...}
	...
}
```
- 문자 데이터 자체는 `byte[]` 에 보관 // 자바 9 이후 

**기능(메서드)**
`String` 클래스는 문자열로 처리할 수 있는 다양한 기능을 제공한다. 기능이 방대하므로 필요한 기능이 있으면 검색하
거나 API 문서를 찾아보자. 주요 메서드는 다음과 같다.
- `length()` : 문자열의 길이를 반환한다.
- `charAt(int index)` : 특정 인덱스의 문자를 반환한다.
- `substring(int beginIndex, int endIndex)` : 문자열의 부분 문자열을 반환한다. 
- `indexOf(String str)` : 특정 문자열이 시작되는 인덱스를 반환한다.
- `toLowerCase()` , `toUpperCase()` : 문자열을 소문자 또는 대문자로 변환한다.
- `trim()` : 문자열 양 끝의 공백을 제거한다.
- `concat(String str)` : 문자열을 더한다.

### String 참조형
참조형은 변수에 계산할 수 있는 값이 들어있는 것이 아니라 `x001` 과 같이 계산할 수 없는 참조값이 들어있다.
```java
public class StringConcatMain {
     public static void main(String[] args) {
         String a = "hello";
         String b = " java";
         String result1 = a.concat(b);
         String result2 = a + b;
         System.out.println("result1 = " + result1);
         System.out.println("result2 = " + result2);
	} 
}
```
- `String` 이 제공하는 `concat()` 과 같은 메서드를 사용
- 편의상 특별히 `+` 연산을 제공

## String 클래스 - 비교
`String` 클래스 비교할 때는 `==` 비교가 아니라 항상 `equals()` 비교를 해야한다.
- **동일성(Identity)**: `==` 연산자를 사용해서 두 객체의 참조가 동일한 객체를 가리키고 있는지 확인 
- **동등성(Equality)**: `equals()` 메서드를 사용하여 두 객체가 논리적으로 같은지 확인

```java
public class StringEqualsMain1 {
    public static void main(String[] args) {
        String str1 = new String("hello");
        String str2 = new String("hello");
        System.out.println("new String() == 비교: " + (str1 == str2));
        System.out.println("new String() equals 비교: " + (str1.equals(str2)));

        String str3 = "hello";
        String str4 = "hello";
        System.out.println("리터럴 == 비교: " + (str3 == str4));
        System.out.println("리터럴 equals 비교: " + (str3.equals(str4)));
    }
}
```
**실행 결과** 
```
new String() == 비교: false
new String() equals 비교: true
리터럴 == 비교: true
리터럴 equals 비교: true
```
- str1 와 str2 : new 을 사용해 각각 인스턴스 생성
	- 서로 다른 인스턴스 이므로 `== 비교` : false
	- 다른 인스턴스이지만, 둘은 내부에서 같은 `hello`값을 가지고 있기 때문에 ` equals 비교` : true

- str3 과 str4 : 각각 인스턴스 생성 X, 문자열 리터럴을 사용하는 경우
	- 이때는 메모리 효율성과 성능 최적화를 위해 문자열 풀 사용
	- 문자열 풀 : 자바가 실행되는 시점에 클래스에 문자열 리터럴이 있으면 문자열 풀에 `String` 인스턴스를 미리 만들어둔다.
		- `String str3 = "hello"` 와 같이 문자열 리터럴을 사용하면 문자열 풀에서 `"hello"` 라는 문자를 가진 인스턴스를 찾는다. 그리고 인스턴스의 참조를 반환한다.
		- `String str4 = "hello"` 의 경우 문자열 풀에서 `"hello"` 라는 문자를 가진 인스턴스를 찾는다. 때문에 str3 과 같은 인스턴스의 참조를 반환한다.
