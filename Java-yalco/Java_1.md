## 1\. 주석

-   컴퓨터는 무시하는 텍스트
    -   코드의 대한 설명
    -   주석처리 없이 텍스트 작성시 컴파일 오류
    -   주석의 양은 실행속도에 영향이 없음
    -   주석 없이도 알아보기 쉬운 코드를 권장
    -   단축키 (mac) command + /

```
package sec02.chap02;

public class Main {
    public static void main(String[] args) {
        System.out.println("hi");
        // 이건 주석 입니다.
        System.out.println("안녕");
    }
}
```

## 2\. 자료형과 변수

#### Ex01.java

-   자료형
    -   프로그래밍에서 사용되는 다양한 형태의 데이터
    -   각 종류마다 필요한 용량과 담는 방식이 다름

```
package sec02.chap03;

public class Ex01 {
        public static void main(String[] args) {
        //  참/거짓 - boolean
        System.out.println(true);
        System.out.println(false);

        //  숫자
        System.out.println(123); // int
        System.out.println(3.14); // double

        //  문자 - char
        System.out.println('A');
        System.out.println('가');
        System.out.println('⭐');

        //  문자열 - String
        System.out.println("동네형보다 많은 자료형");
    }
}
```

#### Ex02.java

-   변수
    -   데이터를 담는 주머니

```
package sec02.chap03;

public class Ex02 {
    public static void main(String[] args) {
        System.out.println("원주율: " + 3.14);
        System.out.println("원의 둘레: 지름 X " + 3.14);
        System.out.println("원의 넓이: 반지름의 제곱 X " + 3.14);
        System.out.println("구의 부피: 반지름의 세제곱 X 4/3 X " + 3.14);

        System.out.println("\n- - - - -\n"); // 💡 \n : 줄바꿈

        double pi = 3.14;

        System.out.println("원주율: " + pi);
        System.out.println("원의 둘레: 지름 X " + pi);
        System.out.println("원의 넓이: 반지름의 제곱 X " + pi);
        System.out.println("구의 부피: 반지름의 세제곱 X 4/3 X " + pi);

        System.out.println("\n- - - - -\n");

        int age = 24;

        System.out.println(age);

    }
}
```

#### Ex03.java

-   대입(할당)연산자

```
package sec02.chap03;
public class Ex03 {
    public static void main(String[] args) {
        String 대학 = "학생";

        //  일반적으로는 아래와 같이 선언과 초기화를 동시에
        int age = 20;
        boolean isMarried = false;
        double height = 179.99;
        char sex = 'M';
        String name = "홍길동";
    }
}
```

```
- 오른쪽의 값(변수가 아닌, 데이터 표현)들을 리터럴 literal 이라 부름
```

#### Ex04.java

```
package sec02.chap03;

public class Ex04 {
    public static void main(String[] args) {
        // 💡 쉼표를 사용하여 여럿을 한 줄에 선언 및 초기화 가능
        // 모두 같은 자료형으로 선언됨

        char ch1, ch2, ch3; // 선언만
        char ch4 = 'A', ch5 = 'B', ch6 = 'C'; // 초기화까지

        // ⚠️  같은 변수를 두 번 선언하는 것 불가
        int number = 1;
        // int number = 2;

        //  ⚠️  변수를 선언 & 초기화하기 전 사용 불가
        // System.out.println(letter);

        char letter = 'A';

        System.out.println(letter);

        int numberA = 1;

        // 주머니의 값을 다른 주머니에 넣기
        int numberB = numberA;

        //  💡 원시타입 데이터는 값을 복사해서 줌
        //  이후 참조타입과 비교하여 자세히 다룰 것
        numberA = 2;
    }
}
```

#### Ex05.java

```
package sec02.chap03;

public class Ex05 {
    public static void main(String[] args) {
        //  💡 final 연산자 : 변수의 값을 바꾸지 못하게 만듦
        final int INT_NUM = 1;
        //  INT_NUM = 2; // ⚠️ 불가
        //  사용 가능

        int yalco, _yalco, $yalco, 얄코;

        // 사용 불가
//        int 1yalco;
//        int yal co;
//        int #yalco;


    }
}
```