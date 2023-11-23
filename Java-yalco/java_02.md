## 1. 자료형과 연산자


### 1) 정수 자료형

#### 자료형의 크기
  | 자료형 | 크기 | 표현 범위 |
  | --- | --- | --- |
  | byte | 1바이트 (8비트) | -128 ~ 127 (-2^7 ~ -2^7-1) |
  | short | 2바이트 | -32,768 ~ 32,767 |
  | int | 4바이트 | -2,147,483,648 ~ 2,147,483,647 |
  | long | 8바이트 | -9,223,372,036,854,775,808 ~ 9,223,372,036,854,775,807 |
</br>

```java
byte _1b_byte = 1;
short _2b_short = 2;
int _4b_int = 3; // ⭐️ 일반적으로 널리 사용
long _8b_long = 4;

//  ⚠️ 자료형의 범주 외의 수를 담을 수 없음
byte overByte2 = 128;
byte overByte4 = -129;

//  큰 자료형에 작은 자료형의 값을 넣을 수 있음
//  💡 묵시적(암시적) 형변환
_2b_short = _1b_byte;
_4b_int = _1b_byte; _4b_int = _2b_short;
_8b_long = _1b_byte; _8b_long = _2b_short; _8b_long = _4b_int;

//  ⚠️ 작은 자료형에 큰 자료형의 값을 '그냥' 넣을 수 없음
//  들어있는 값의 크기와 무관
_1b_byte = _2b_short; _1b_byte = _4b_int; _1b_byte = _8b_long;
_2b_short = _4b_int; _2b_short = _8b_long;
_4b_int = _8b_long;

//  ⭐ int의 범위를 벗어나는 수에는 리터럴에도 명시 필요
//  끝에 l 또는 L을 붙여 볼 것
long _8b_long1 = 123456789123456789;

//  💡 가독성을 위해 아래와 같이 표현 가능 (자바7부터)
int _4b_int2 = 123_456_789;
long _8b_long2 = 123_456_789_123_456_789L;

//  명시적(강제) 형변환
int smallIntNum = 123;
_1b_byte = (byte) smallIntNum;

// 이항 연산자
int a = 1 + 2;
int b = a - 1;
int c = b * a;
int d = a + b * c / 3; 
int e = (a + b) * c / 3;
int f = e % 4; // 나머지

// 복합 연산자
int x = 3;
x += 2;
x -= 3; 
x *= 12;
x /= 3;
x %= 5;

// 단항 연산자
int int1 = 3;

int int2 = int1++; // 🔴
int int3 = ++int1;
int int4 = -(int2-- * --int3);

// 비교연산자
boolean bool1 = int1 == int2;
boolean bool2 = int1 != int2;
boolean bool3 = int1 > int2;

```
##### int를 널리 사용하는 기타 이유들
- 메모리를 크게 절약해야 하는 상황이 아닌 이상 int 널리 사용
- 자바 (및 다수 언어들) 에서 기본 자료형으로 지정됨
- 다른 언어들과 호환 (널리 사용되는 자료형)
- 연산 속도가 타 자료형보다 빠름
	- 32비트 *( 4바이트 )* : 대부분의 CPU에서 처리하기 적합한 크기

</br>

---

</br>

### 2) 실수 자료형

#### 실수형 자료형의 크기
| 자료형 | 크기 |
| --- | --- |
| float | 4바이트 |
| double | 8바이트 |


```java
//  float은 뒤에 f 또는 F를 붙여 표현
float flt1 = 3.14f;
double dbl1 = 3.14;

//  ⚠️ float에는 double을 담을 수 없음
float flt2 = dbl1;
//  반대는 가능
double dbl2 = flt1;

int int1 = 5;
float flt1 = 2f;
double dbl1 = 3;
double dbl2 = 7;

//  💡 정수 자료형과 실수 자료형의 계산은 실수 반환
int flt2 = int1 / flt1; // ⚠️ 불가
double dbl3 = int1 / dbl1;
double dbl4 = dbl2 / int1;

//  💡 리터럴로 작성시 double임을 명시하려면 .0을 붙여줄 것
double dbl5 = 5 / 2;
double dbl6 = 5.0 / 2;
double dbl7 = (double) 5 / 2;
```

- double : float 보다 단순히 범위가 넓은 것이 아니라, 보다 정밀하게 표현 가능

</br>

---

</br>

### 3) 불리언 자료형
| a && b | AND | a와 b가 모두 true일때만 true 반환 |
| --- | --- | --- |
| a || b | OR | a와 b 중 하나만 true면 true 반환 |

```java
boolean bool1 = true;
boolean bool2 = false;
// ! : boolean 의 값을 반전
boolean bool3 = !true;
boolean bool4 = !false;

//  💡 &&가 ||보다 우선순위 높음
boolean boolA = (num % 3 == 0) && (num % 2 == 0) || (num > 0) && (num > 10);
boolean boolB = (num % 3 == 0) && ((num % 2 == 0) || (num > 0)) && (num > 10);

// 삼항 연산자
int num1 = 3, num2 = 4;

char num1OE = num1 % 2 == 1 ? '홀' : '짝';
char num2OE = num2 % 2 == 1 ? '홀' : '짝';

```
#### 단축평가

- `&&` : 앞의 것이 `false`면 뒤의 것을 평가할 필요 없음
- `||` : 앞의 것이 `true`면 뒤의 것을 평가할 필요 없음
- **평가는 곧 실행** - 이 점을 이용한 간결한 코드
- 💡 **연산 부하가 적은 코드를 앞에** - 리소스 절약


</br>

---

</br>

### 4) 문자, 문자열 자료형
#### 문자

```java
//  각 문자는 상응하는 정수를 가짐
char ch1 = 'A';
char ch2 = 'B';
char ch3 = 'a';
char ch4 = 'a' + 1;
char ch5 = '가';
char ch6 = '가' + 1;
char ch7 = '가' + 2;
char ch8 = '가' + 3;
char ch9 = '나';

int ch1Int = (int) ch1;
int ch9Int = (int) ch9;

// 문자 리터럴과 숫자, 유니코드로 표현 가능
char ch10 = 'A';
char ch11 = 65;
char ch12 = '\u0041';

char ch_a1 = 'A';
int int_a1 = (int) ch_a1;

//  정수값을 얻는 다른 방법들 - 정수값과 연산하기
int int_a2 = ch_a1 + 0;
int int_a3 = ch_a1 - 0;

//  💡 리터럴에 더할 때와 변수에 더할 때 반환 자료형이 다름
char ch_a2 = 'A' + 1;
//char ch_a3 = ch_a1 + 1; // ⚠️ 불가
int int_a4 = ch_a1 + 1;

//  💡 아래의 기능으로 문자가 의미하는 정수로 변환
int int_d1 = Character.getNumericValue('1');
int int_d2 = Character.getNumericValue('2');
```

### 문자열
#### `String` : 문자열 자료형
```java
//  리터럴 방식
String str1 = "Hello World!";
String str2 = "안녕하세요";
        
// 빈 문자열 가능
String str3 = "";

//  인스턴스 생성 방식
String str4 = new String("안녕하세요");

String hl1 = "Hello";
String hl2 = "Hello";
String wld = "World";

//  리터럴끼리는 == 을 사용하여 비교 가능
boolean bool1 = hl1 == hl2;
boolean bool2 = hl1 == wld;

String hl3 = new String("Hello");
String hl4 = new String("Hello");
String hl5 = hl4;

//   인스턴스와 비교하려면 .equals 메소드를 사용해야 함
//   특별한 경우가 아니면 문자열은 .equals로 비교할 것
boolean bool3 = hl3 == hl4;

boolean bool4 = hl1.equals(hl2);
boolean bool5 = hl1.equals(hl3);
boolean bool6 = hl3.equals(hl4);
boolean bool7 = wld.equals(hl2);

//  같은 곳을 참조하는 인스턴스들
boolean bool8 = hl4 == hl5;

// 문자열에 다른 자료형을 더하면 문자열로 이어붙여짐
String str_d2 = str_d1 + intNum + fltNum + bool + character;


```
#### = 과 equals의 차이
- `==` : 같은 종이인가?
- `equals` : 같은 글이 적혀있는가?


</br>

---

</br>

## 2. 문자열의 메소드
```java
// 문자열의 길이
int a = "Hello".length();

// 빈 문자열 여부
String str1 = "";
String str2 = " \t\n";

// isEmpty : 문자열의 길이가 0인지 여부
boolean bool1 = str1.isEmpty();
boolean bool2 = str2.isEmpty();

// isBlank : 공백(white space)을 제외한 문자열의 길이가 0인지 여부
boolean bool3 = str1.isBlank();
boolean bool4 = str2.isBlank();

String str1 = "안녕하세요";

char ch1 = str1.charAt(0);
char ch2 = str1.charAt(3);

//  마지막 문자 얻기
char ch3 = str1.charAt(str1.length() - 1);


String str2 = "얄리 얄리 얄라셩 얄라리 얄라";

//  💡 indexOf/lastIndexOf : 일치하는 첫/마지막 문자열의 위치
//  앞에서부터 카운트해서 int로 반환
                
//  두 번째 인자 : ~번째 이후/이전부터 셈
int int1 = str2.indexOf('얄');
int int2 = str2.indexOf('얄', 4);

int  int3 = str2.indexOf("얄라");
int  int4 = str2.lastIndexOf("얄라");
int  int5 = str2.lastIndexOf("얄라", 12);

//  포함되지 않은 문자는 -1 반환
int int6 = str2.indexOf('욜');


// 포함 여부 확인
String str_b1 = "안녕하세요";
boolean bool_b1 = str_b1.contains("안녕");

// 문자열 비교
//  💡 compareTo : 사전순 비교에 따라 양수 또는 음수 반환
//  같은 문자열이면 0 반환
String str_a1 = "ABC";
int int_a1 = str_a1.compareTo(str_a1);

// 대소문자 변환
String str_a1 = "Hello, World!";
// 💡 toUpperCase / toLowerCase : 모두 대문자/소문자로 변환
String str_a2 = str_a1.toUpperCase();
String str_a3 = str_a1.toLowerCase();
```


</br>

---

</br>

## 3. 문자열 포매팅
| %b | 불리언 |
| --- | --- |
| %d | 10진수 정수 |
| %f | 실수 |
| %c | 문자 |
| %s | 문자열 |
| %n | (포맷 문자열 내 바꿈) |

```java
String str1 = "%s의 둘레는 반지름 X %d X %f입니다.";

String circle = "원";
int two = 2;
double PI = 3.14;

//  💡 formatted : 주어진 형식에 따라 문자열 생성
//  ⭐️ 13+버전에 추가됨. 편의상 강의에서 많이 사용할 것
String str2 = str1.formatted(circle, two, PI);

//  💡 이전 버전에서의 방식. 실무에서 사용하려면 기억
String str3 = String.format(str1, circle, two, PI);

//  ⭐️ 시스템의 printf 메소드 : String.format과 같은 형식으로 출력
//  줄바꿈을 하지 않으므로 직접 넣어줘야 함
System.out.printf("%s의 둘레는 반지름 X %d X %f입니다.%n", circle, two, PI);

```

</br>

---

</br>

## 4. 배열
```java
// 방법1. 사용할 자료형 뒤에 []를 붙여 선언
char[] han = {'가', '나', '다', '라', '마'};
// 방법2. 선언만 먼저 한 상태에서는 두 번째 방법만 가능
char[] han = new char [] {'가', '나', '다', '라', '마'};

char first = han[0];
char last = han[han.length - 1];

//  초기화하지 않고 일단 선언하기
//  어떤 값으로 초기화되는지 확인
boolean[] boolAry = new boolean[3];
int[] intAry = new int[3];
double[] dblAry = new double[3];
char[] chrAry = new char[3]; // 아래 확인
String[] strAry = new String[3];

//  아스키 코드의 0번 글자. 문자열의 끝을 표시하는데 사용
char NUL = chrAry[0];
```

</br>

---

</br>

## 5. 타입 추론
#### var : 연산자로 변수 선언 - 타입을 명시하지 않음
- 대입된 값을 통해 컴파일러가 추론
- 지역 변수에서만 사용 가능
    - 이후 배울 클래스의 필드로는 불가
```java
var intNum = 1;
var doubleNum = 3.14;
var charLet = 'A';
var StringWord = "안녕하세요";

//  ⚠️ 아래와 같이는 사용 불가
//  컴파일러가 타입을 추론할 수 없는 상황
var notInit; // 초기화가 안 됨
var nullVar = null; // null로 초기화

//  이후 배울 반복문에서 편리하게 사용
for (var i = 0; i < 10; i++) {
System.out.println(i);
}
```