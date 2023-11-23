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
```java


```


</br>

---

</br>

### 3) 불리언 자료형



</br>

---

</br>

### 4) 문자열 자료형



</br>

---

</br>

## 2. 문자열의 메소드



</br>

---

</br>

## 3. 문자열 포매팅



</br>

---

</br>

## 4. 배열



</br>

---

</br>

## 5. 타입 추론

