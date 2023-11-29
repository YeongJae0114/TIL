## 대원칙

1. 자바는 항상 변수의 값을 복사해서 대입한다.
2. 기본형이든 참조형이든 변수의 값을 대입하는 방식은 같다. 하지만 기본형과 참조형에 따라 동작하는 방식이 달라진다.

## 기본형 vs 참조형
- 자바의 데이터 타입은 기본형과 참조형으로 나뉜다.

### 기본
- 기본형 변수 : 값을 직접 저장
	- 산술 연산이 가능
    - null 할당 불가
- 참조형 변수 : 참조(주소)를 저장
	- 산술 연산 불가능
    - null 할당 가능
### 대입
- 기본형과 참조형 모두 대입시 변수 안에 있는 값을 읽고 복사해서 전달
- 기본형 : 값을 복사해서 전달
- 참조형 : 참조값을 복사해서 전달
	- 하나의 인스턴스를 여러곳에서 참조 가능

### 메서드 호출
- 메서드 호출시 기본형은 메서드 내부에서 매개변수(파라미터)의 값을 변경해도 호출자의 변수 값에는 영향이 없다
	- 다른 주소에 값을 복사했기 때문
```java
public class MethodChange1 {
     public static void main(String[] args) {
         int a = 10;
		 System.out.println("메서드 호출 전: a = " + a); 
		 changePrimitive(a); 
		 System.out.println("메서드 호출 후: a = " + a);
}
public static void changePrimitive(int x) {
         x = 20;
	}
    // 출력  
	// 메서드 호출 전: a = 10
    // 메서드 호출 전: a = 10
 }   
```
- 메서드 호출시 참조형은 메서드 내부에서 매개변수(파라미터)로 전달된 객체의 멤버 변수를 변경하면, 호출자의 객체도 변경
```java
public class Main {
    public static void main(String[] args) {
        int[] a = new int[1];
        a[0]=10;
        
        System.out.println("메서드 호출 전: a = " + a[0]);
        changePrimitive(a);
        System.out.println("메서드 호출 후: a = " + a[0]);
    }
    public static void changePrimitive(int[] x) {
        x[0] = 20;
    }
}
```	
- 배열은 참조형 타입이므로 인스턴스의 주소를 복사해 전달



