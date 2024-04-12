# String 클래스

## String 클래스 - 불변 객체
`String` 은 불변 객체이다. 따라서 생성 이후에 절대로 내부의 문자열 값을 변경할 수 없다.

```java
public class StringImmutable2 {
     public static void main(String[] args) {
         String str1 = "hello";
         String str2 = str1.concat(" java");
         System.out.println("str1 = " + str1);
         System.out.println("str2 = " + str2);
	}
}
```
- `String` 은 불변 객체이다. 따라서 변경이 필요한 경우 기존 값을 변경하지 않고, 대신에 새로운 결과를 만들어서 반환
	- `String.concat()` 은 내부에서 새로운 `String` 객체를 만들어서 반환

**String이 불변으로 설계된 이유**
문자열 풀에 있는 `String` 인스턴스의 값이 중간에 변경되면 같은 문자열을 참고하는 다른 변수의 값도 함께 변경 되기 때문이다.

<img src="/img/Java-mid/mid-1_1.png" alt="String" width="600" height="400" />


- `String` 은 자바 내부에서 문자열 풀을 통해 최적화를 한다.
- 만약 `String` 내부의 값을 변경할 수 있다면, 기존에 문자열 풀에서 같은 문자를 참조하는 변수의 모든 문자가 함께 변경되어 버리는 문제가 발생한다. 

- 다음의 경우 `str3` 이 참조하는 문자를 변경하면 `str4` 의 문자도 함께 변경되는 사이드 이펙트 문제가 발생한다.
	- `String str3 = "hello"`
	- `String str4 = "hello"`


`String` 클래스는 불변으로 설계되어서 이런 사이드 이펙트 문제 발생을 막는다.