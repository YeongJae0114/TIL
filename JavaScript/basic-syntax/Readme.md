# 📘 JavaScript 학습 정리

이 폴더는 내가 JavaScript를 처음부터 학습하면서 작성한 개념과 예제를 정리한 공간이다.  
각 항목은 주요 문법 주제별로 구분되어 있으며, 개념 이해에 집중했다.

---

## 1. variables (`1_variables.html`)

### 1.1 var / let / const 차이
- `var`는 함수 스코프, 재선언/재할당 가능. 호이스팅 시 undefined.
- `let`은 블록 스코프, 재선언 불가, 재할당 가능. TDZ 존재.
- `const`는 블록 스코프, 재선언/재할당 불가. 단, 객체 내부 수정은 가능.

### 1.2 스코프(Scope)
- 스코프는 변수가 유효한 범위.
- `var`는 함수 스코프, `let`/`const`는 블록 스코프를 가짐.

### 1.3 호이스팅(Hoisting)
- 변수/함수 선언이 실행 전에 메모리에 등록되는 개념.
- `var`는 undefined로 초기화되어 접근 가능, `let`/`const`는 ReferenceError.

### 1.4 const는 진짜 불변일까?
- const는 재할당만 막는다.
- 객체나 배열의 내부 값은 수정 가능.
---

## 2. types (`2_types.html`)
자바스크립트의 타입 시스템은 동적(dynamic)이며, 정수/실수, 객체/배열 등의 세부 구분이 Java 같은 정적 언어와 다르다.  
이를 이해하면 typeof, null 처리, 배열 확인 등에서 혼란을 줄일 수 있다.

### 2.1 자바스크립트의 기본 타입 체계
자바스크립트의 타입은 크게 두 가지로 나뉜다.
#### ✅ 1) 원시 타입 (Primitive Types)
- `number`: 정수/실수 구분 없이 모두 같은 타입
- `string`: 문자열
- `boolean`: true 또는 false
- `undefined`: 변수는 선언되었지만 값이 없는 상태
- `null`: 의도적으로 "값이 없음"을 나타낼 때 사용
- `symbol`: 유일한 식별자 (ES6)
- `bigint`: 아주 큰 정수 처리용 타입 (ES2020)

> 💡 숫자는 전부 `number` 타입으로 처리된다.  
> 즉, `10`도 `3.14`도 typeof는 `"number"`이다.

#### ✅ 2) 참조 타입 (Reference Types)
- `object`: 일반 객체 `{}`, 배열 `[]`, 함수 등 모든 참조형이 포함된다
- `array`: `typeof`로는 object로 나와 구분이 안 되며, `Array.isArray()`로 구분해야 한다
- `function`: typeof 결과는 `"function"`으로 특별 취급된다

### 2.2 typeof 연산자 주의점
| 값 | typeof 결과 | 주의사항 |
|-----|--------------|------------|
| `null` | `"object"` | ❗ JS 초기 설계 오류, 여전히 명세에 포함 |
| `[]` | `"object"` | 배열도 객체의 일종 |
| `function() {}` | `"function"` | 함수는 특별한 object로 취급 |
| `undefined` | `"undefined"` | 변수에 아무 값도 없을 때 기본값 |

> 💡 null은 `typeof`로 확인하지 말고 `value === null`처럼 비교하는 것이 안전하다.

### 2.3 null vs undefined
| 비교 항목 | null | undefined |
|-----------|------|-----------|
| 의미 | 의도적으로 "비어 있음" | 변수에 값이 없는 초기 상태 |
| typeof | `"object"` (버그) | `"undefined"` |
| 엄격 비교 | `null === undefined` → `false` | `null == undefined` → `true` (느슨한 비교)


### 2.4 배열 확인 시 주의
```js
const arr = [1, 2, 3];
typeof arr; // "object"
Array.isArray(arr); // true ✅
```

- `typeof`만으로는 배열과 객체를 구분할 수 없음
- 항상 `Array.isArray()`로 배열 여부를 판별할 것


---

## 3. operators (`3_operators.html`)
자바스크립트의 연산자는 단순 계산을 넘어서, **조건 분기**, **타입 판별**, **로직 제어** 등 다양한 영역에서 핵심적으로 사용된다.

### 3.1 산술 연산자 (Arithmetic Operators)
- `+`, `-`, `*`, `/`, `%`, `**` 등 수학 연산에 사용
- `**`는 거듭제곱: `2 ** 3` → `8`
- `+`는 숫자 더하기 외에도 문자열 결합 기능 포함

### 3.2 할당 연산자 (Assignment Operators)
- `=`, `+=`, `-=`, `*=`, `/=`, `%=` 등 변수에 값을 할당할 때 사용
    ```js
    let x = 5;
    x += 3; // x는 8이 된다
    ```

---

### 3.3 비교 연산자 (Comparison Operators)
- `==`: 값만 비교 (타입 자동 변환 발생 → 위험)
- `===`: 값과 타입 모두 비교 (엄격 동등 연산자, **권장**)
- `!=`, `!==`: 같지 않음 (역시 `!==` 사용 권장)
```js
1 == "1";   // true ❌ (자동 형변환 발생)
1 === "1";  // false ✅ (타입까지 비교)
```

---

### 3.4 논리 연산자 (Logical Operators)
- `&&`: AND, 둘 다 true여야 true
- `||`: OR, 하나라도 true면 true
- `!`: NOT, 논리 반전
```js
true && false; // false
true || false; // true
!true;         // false
```

> 💡 단축 평가(SHORT-CIRCUIT) 개념도 적용됨:  
> `true || expr` → expr은 실행되지 않음

---

### 3.5 삼항 연산자 (Ternary Operator)
```js
const msg = (age >= 19) ? "성인" : "미성년자";
```
- if문을 간결하게 표현할 수 있음
- 읽기 쉬운 조건 표현에 유용

---

### 3.6 typeof 연산자
- 변수의 **데이터 타입을 문자열로 반환**
```js
typeof 42;          // "number"
typeof "hello";     // "string"
typeof null;        // "object" ❗ (자바스크립트 설계상의 오래된 버그)
typeof [1, 2, 3];   // "object"
typeof function(){} // "function"
```

> 💡 `typeof null === "object"`는 JS의 유명한 설계 오류로, `null === null`로 체크해야 정확하다


## 4. conditionals (`4_conditionals.html`)

JavaScript의 조건문은 코드의 흐름을 상황에 따라 분기하는 데 사용된다.  
대표적으로 `if`, `else if`, `else`, `switch`, 그리고 삼항 연산자가 있다.

---

### 4.1 if / else if / else

- 조건식은 `true` 또는 `false`로 평가된다.
- 가장 먼저 `true`가 되는 조건 블록만 실행되며, 나머지는 건너뛴다.
- `else`는 모든 조건이 `false`일 때 실행된다.

> 조건은 위에서 아래로 순차적으로 평가됨

---

### 4.2 중첩 조건문 (nested if)

- if 블록 안에 또 다른 if문을 작성할 수 있다.
- 로직이 복잡해지면 가독성이 떨어질 수 있으므로 주의가 필요하다.

---

### 4.3 switch 문

- 특정 값에 대해 여러 경우를 분기할 때 사용.
- `break` 키워드를 사용하지 않으면 **fall-through** 현상 발생.
- `default`는 모든 case에 해당하지 않을 때 실행된다.

> 값이 정확히 일치(`===`)하는 경우에만 해당 case가 실행됨

---

### 4.4 truthy / falsy 개념

JavaScript의 조건식에는 불리언이 아닌 값도 사용되며, 암묵적으로 평가된다.

- **Falsy 값**: `false`, `0`, `""`, `null`, `undefined`, `NaN`
- 이외의 값은 모두 **truthy**로 간주

> 의도하지 않은 동작을 피하려면 Boolean 강제 형변환을 사용하는 것이 좋다

---

### 4.5 삼항 연산자 (ternary)

- `조건 ? 참일 경우 : 거짓일 경우`
- 한 줄로 간단한 조건 분기를 표현할 수 있지만, 중첩 사용은 피하는 것이 좋다.

---

### 4.6 정리

- 조건문은 JS 흐름 제어의 핵심 문법
- 복잡한 로직은 `if`, 간단한 값 비교는 `switch`
- 조건식에서의 truthy/falsy 평가를 명확히 이해해야 실수를 줄일 수 있음


---
## 5. 반복문 (loops)

자바스크립트에서 반복문은 **동일한 작업을 여러 번 반복해야 할 때** 사용하는 제어 구조입니다. 반복문의 종류에 따라 사용 용도와 특징이 다르기 때문에 적절한 상황에 맞게 선택하는 것이 중요합니다.

---

### 5.1 `for` 문

- 반복 횟수가 명확할 때 가장 많이 사용하는 구조입니다.
- 초기값, 조건식, 증감식을 한 줄에 작성할 수 있어 직관적입니다.
- `i++` 대신 `i--`, `i += 2` 같은 다양한 증감 패턴도 사용 가능.

### 5.2 `while` 문

- 반복 조건만 주어지기 때문에, 반복 횟수가 명확하지 않은 경우에 적합합니다.
- 조건을 만족하지 않으면 한 번도 실행되지 않을 수 있음에 유의해야 합니다.

### 5.3 `do...while` 문

- `while`과 비슷하지만, **조건을 나중에 검사**하므로 **최소 한 번은 실행됩니다**.
- 사용자 입력을 한 번 이상 받아야 할 때 유용합니다.

---

### 5.4 `for...of` 문

- **배열, 문자열 등 반복 가능한(iterable)** 객체를 순회할 때 사용합니다.
- 값 자체에 접근하므로 배열 요소 처리에 매우 직관적입니다.

❗ 객체(object)에는 사용할 수 없습니다. 객체는 iterable이 아니기 때문에 `TypeError` 발생.

---

### 5.5 `for...in` 문

- **객체의 key(속성 이름)** 을 순회합니다.
- 객체의 모든 열거 가능한 속성을 순회하므로 객체 탐색에 적합합니다.

❗ 배열에도 사용할 수는 있지만, 순서를 보장하지 않기 때문에 **배열에는 적합하지 않습니다.**

---

### 5.6 흐름 제어: `break`, `continue`

- `break`: 반복문을 즉시 종료합니다.
- `continue`: 현재 반복을 건너뛰고 다음 반복으로 넘어갑니다.

---

### 5.7 주의할 점 요약

- `for...in`은 배열보다는 객체에 사용해야 안전합니다.
- `for...of`는 iterable한 값에만 사용 가능합니다.
- `while`이나 `do...while`은 **조건에 따라 무한 루프**가 될 수 있으니 주의해야 합니다.
- `break`, `continue`를 잘못 사용하면 로직이 꼬일 수 있으니 조건을 명확히 해야 합니다.

---

## 6. Functions (`6_functions.html`)

### 6.1 함수란?
JavaScript에서 함수는 **재사용 가능한 코드 블록**입니다. 특정 작업을 수행하고, 필요시 값을 반환합니다.

---

### 6.2 함수 선언 방식

1. **함수 선언식 (Function Declaration)**
```js
function sayHello() {
  console.log("Hello!");
}
```

2. **함수 표현식 (Function Expression)**
```js
const sayHi = function () {
  console.log("Hi!");
};
```

3. **화살표 함수 (Arrow Function)**
```js
const greet = () => {
  console.log("안녕하세요!");
};
```

> 🔍 주의: 화살표 함수는 `this` 바인딩이 없음

---

### 6.3 매개변수와 인자

```js
function add(a, b) {
  return a + b;
}
add(1, 2); // 3
```

- 매개변수(Parameter): 함수 정의 시 이름
- 인자(Argument): 함수 호출 시 실제 값

---

### 6.4 반환값 (return)

```js
function square(x) {
  return x * x;
}
```

- `return` 키워드를 사용하여 값을 반환
- 반환이 없으면 `undefined`를 반환

---

### 6.5 함수는 1급 객체

함수는 변수에 할당, 인자로 전달, 반환이 가능함 → **고차 함수** 구현 가능

```js
function greet(callback) {
  callback();
}

greet(() => console.log("Hi")); // 함수 자체를 인자로 전달
```

---

### 주의할 점

- 함수 선언식은 **호이스팅됨**
- 화살표 함수는 `this`, `arguments`, `super`를 바인딩하지 않음

---

## 7. Template Literal (`7_template-literal.html`)

### 7.1 템플릿 리터럴이란?

- 백틱(``` ` ```) 기호를 사용하여 문자열을 생성하는 방식
- 기존의 문자열 연결(`+`)보다 **가독성**과 **표현력**이 뛰어남

---

### 주요 특징

#### 1. **변수 삽입 (Interpolation)**
```js
const name = "Jay";
console.log(`안녕하세요, ${name}님!`);
```

#### 2. **줄바꿈 (Multi-line)**
```js
const msg = `이렇게
여러 줄도
그대로 표현 가능`;
```

#### 3. **표현식 계산 가능**
```js
const a = 10;
const b = 20;
console.log(`${a} + ${b} = ${a + b}`);
```

---

### ⚠️ 주의할 점

- 문자열 시작/끝은 **백틱(`)** 으로만 가능 (`'`, `"`와 다름)
- `${}` 내부에는 **표현식(계산식, 함수 호출 등)** 을 넣을 수 있음

---

### 💡 템플릿 리터럴을 언제 쓰면 좋을까?

| 상황 | 템플릿 리터럴 추천 여부 |
|------|-------------------------|
| HTML 조각 만들기 | ✅ 매우 추천 |
| 복잡한 문자열 조합 | ✅ 추천 |
| 단순한 문자열 | 🔸 선택 사항 |
---

## 📁 관련 파일 목록

| 파일명 | 설명 |
|--------|------|
| `1_variables.html` | 변수 선언, 스코프, 호이스팅, const 예제 |
| `2_types.html` | 기본 타입과 참조 타입 실습 |
| `3_operators.html` | 연산자와 표현식 실습 |
| `4_conditionals.html` | 조건문 if/switch 연습 |
| `5_loops.html` | 반복문과 배열 순회 |
| `6_functions.html` | 함수 선언과 화살표 함수 비교 |
| `7_template-literal.html` | 템플릿 리터럴 사용법 |

