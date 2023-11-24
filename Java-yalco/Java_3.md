## 1.if / else

_주어진 boolean 값에 따라 명령문 실행 여부를 결정_

```
int score = 85;

//  else if : 첫 if문이 false일 때 다른 조건을 연속 사용
//  else만 사용하는 것은 맨 마지막에
if (score > 90) {
System.out.println('A');
} else if (score > 80) {
System.out.println('B');
} else if (score > 70) {
System.out.println('C');
} else if (score > 60) {
System.out.println('D');
} else {
System.out.println('F');
}
```

-   위 코드는 가독성이 떨어져 지양된다

_지향하는 코드 (보다 가독성 좋은 방식)_

```
int score = 85;

//  return문: 해당 메소드를 종료하고 빠져나옴        
if (score > 90) {
    System.out.println('A');
    return;
}
if (score > 80) {
    System.out.println('B');
    return;
}
if (score > 70) {
    System.out.println('C');
    return;
}
if (score > 60) {
    System.out.println('D');
    return;
}
System.out.println('F');
```

-   위처럼 독립적으로 동작하는 코드가 좀 더 가독성이 좋다

---

## 2.switch

```
byte fingersOut = 2;

//  switch : 괄호 안에 기준이 될 변수를 받음
//  가능한 자료형: byte, short, int, char, String, enum(이후 배움)

switch (fingersOut) {

//  case : 기준에 일치하는 case로 바로 이동
//  break : switch문 실행을 종료
//  default: 해당하는 case가 없을 때 - 마지막에 작성

case 2:
    System.out.println("가위");
    break;
case 0:
    System.out.println("바위");
    break;
case 5:
    System.out.println("보");
    break;
default:
    System.out.println("무효");
        }
```

-   case : 기준에 일치하는 case로 바로 이동
-   break : switch문 실행을 종료
-   default: 해당하는 case가 없을 때 - 마지막에 작성

---

## 3.for & for-each

_주어진 조건이 충족되는 동안 특정 작업을 반복_

```
for (int i = 0; i < 10; i++) {
    System.out.println(i); 
        }
```

-   실행 과정
    1.  루프 안에서 사용할 변수 초기화
    2.  루프를 실행하기 위한 조건 확인
    3.  조건을 충족시 실행할 내용
    4.  각 루프가 끝날때마다 이행할 내용
-   1번 이후 2를 충족할 동안 2~4 반복
-   변수명은 원하는대로 사용 가능
    -   일반적으로 기본형에는 `i` 를 많이 사용 - \*문맥에 따라 index를 뜻함

---

_배열의 원소를 반복_

```
int[] multiOf4 = new int[] {1,2,3,4,5};

int sumOfArray = 0;
    for (int num : multiOf4) {
        sumOfArray += num;
    }
```

-   IntelliJ IDEA 단축어 : foreach
    
    ```
    for (int i = 0; i < 100; i++) {
    
      //  continue : 한 루프만 건너뜀
      if (i % 3 == 0) continue;
    
      //  break : 블록 전체를 종료
      if (i == 10) break;
    
      System.out.println(i);
      }
    ```
    
-   _continue와 break_
-   continue : 한 루프만 건너뜀
-   break : 블록 전체를 종료

---

## 4.while & do while

_while : 조건이 true일 동안 반복 수행_

```
int i = 0;

//  while 문의 괄호에는 종료조건만
while (i < 10) {
    // 종료조건 충족을 위한 값 변화는 외적으로 
    System.out.println(i++);
}
```

_do ... while : 일단 수행하고 조건을 봄_

```
int enemies = 0;

System.out.println("일단 사격");

do {
    System.out.println("탕");
    if (enemies > 0) enemies--;
} while (enemies > 0);

System.out.println("사격중지 아군이다");
```

---

## 5.메소드

-   타 언어의 함수 function 과 같은 개념
-   자바는 모든 것이 클래스의 요소이므로 메소드 method 라 부름

_의미 : 반복을 최소화_

```

public class Main {
    public static void main(String[] args) {
        double xx = 3, yy = 4;
        addSubtMultDiv(xx, yy);

        xx = 10; yy = 2;
        addSubtMultDiv(xx, yy);

        xx = 7; yy = 5;
        addSubtMultDiv(xx, yy);

    }
}
//  ⭐️ 메인 메소드 외부에 선언할 것
static void addSubtMultDiv (double a, double b) {
    System.out.printf("%f + %f = %f%n", a, b, a + b);
    System.out.printf("%f - %f = %f%n", a, b, a - b);
    System.out.printf("%f * %f = %f%n", a, b, a * b);
    System.out.printf("%f / %f = %f%n", a, b, a / b);
     }
```

![img](https://file.notion.so/f/f/f5787b06-7575-49c2-8c2c-d197061c3d0f/ba681e29-01d9-4b92-b0e1-0563d466d5ef/%E1%84%83%E1%85%A2%E1%84%8C%E1%85%B5_9_%E1%84%89%E1%85%A1%E1%84%87%E1%85%A9%E1%86%AB.png?id=20fa01f4-cbe8-45d0-99ef-1a6e631c4f4d&table=block&spaceId=f5787b06-7575-49c2-8c2c-d197061c3d0f&expirationTimestamp=1700899200000&signature=qyAodrTreKi5Ap-hlCL2KtFsffV3b4cp-S2byA4fExA&downloadName=%E1%84%83%E1%85%A2%E1%84%8C%E1%85%B5+9+%E1%84%89%E1%85%A1%E1%84%87%E1%85%A9%E1%86%AB.png)

_메소드 오버로딩_

```
static int add(int a, int b) { return a + b; }

//  매개변수의 개수가 다름
static int add(int a, int b, int c) { return a + b + c; }

//  매개변수의 자료형이 다름
static double add(double a, double b) { return a + b; }

//  매개변수의 자료형 순서가 다름
static String add(String a, char b) { return a + b; }
static String add(char a, String b) { return a + b; }

//  반환 자료형이 다른 것은 오버로딩 안 됨 - 다른 함수명 사용
//  static double add(int a, int b) { return (double) (a + b); }
```

-   같은 메소드 이름, 다른 매개변수
-   다른 자료형의 값들로 같은 성질의 작업을 정의할 때

_재귀 메소드_

```
static void upTo5 (int start) {
    System.out.println(start);
    if (start < 5) {
        upTo5(++start);
    } else {
        System.out.println("-- 종료 --");
        }
}
```

-   스스로를 호출하는 메소드
-   호출시마다 메모리에 스택이 축적 - 초과시 스택오버플로우 _stack overflow_ 에러

![img2](https://file.notion.so/f/f/f5787b06-7575-49c2-8c2c-d197061c3d0f/cadf18e8-ffc5-4cef-808e-60cdfda287b3/Untitled.png?id=2662d560-af5a-451a-b8f4-ab0e3eda8b1e&table=block&spaceId=f5787b06-7575-49c2-8c2c-d197061c3d0f&expirationTimestamp=1700899200000&signature=s1IN9lk3CWOuZELzqfJtsFbqN8dwAabzBeHFk6AY40w&downloadName=Untitled.png)

-   다른 메소드를 호출한 메소드는 호출된 메소드가 종료될 때까지 메모리에 남아 있음
    -   호출이 반복될수록 위와 같이 메소드들이 쌓이게 됨
-   예시 (팩토리얼)\*  
    ![img3](https://file.notion.so/f/f/f5787b06-7575-49c2-8c2c-d197061c3d0f/0e3703e5-f8da-4e87-9407-0e5fca30d9db/Untitled.png?id=149b5676-cc0f-4f4a-9f58-623d8485fbf5&table=block&spaceId=f5787b06-7575-49c2-8c2c-d197061c3d0f&expirationTimestamp=1700899200000&signature=00m1_spU6-C8gOrDZjETh1s_NSmry6f70n6KeUnDLF4&downloadName=Untitled.png)

_꼬리 재귀 최적화_

-   재귀 코드를 내부적으로 루프 형태로 바꿔서 스택이 쌓이지 않도록 함
-   자바에서는 현재 기본적으로 제공하지 않음
-   반복 횟수가 너무 많아지는 작업에는 사용하지 말 것!

---

## 6.키보드 입력

_문자열 입력받기_

```
//  IDE가 최상단에 import java.util.Scanner 자동 작성
Scanner sc = new Scanner(System.in);
String str1 = sc.next();
String str2 = sc.next();
String str3 = sc.nextLine();

System.out.println("str1: " + str1);
System.out.println("str2: " + str2);
System.out.println("str3: " + str3);
```

-   next : 스페이스를 비롯한 공백 단위로 끊어서 _(토큰으로)_ 문자열을 받음
-   nextLine : 줄바꿈 단위로 끊어서 문자열을 받음