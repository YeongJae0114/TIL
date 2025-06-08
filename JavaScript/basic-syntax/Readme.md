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

### 3.1 산술/비교/논리 연산자


### 3.2 삼항 연산자


---

## 4. conditionals (`4_conditionals.html`)

### 4.1 if / else


### 4.2 switch


---

## 5. loops (`5_loops.html`)

### 5.1 반복문 종류


### 5.2 배열 전용 반복

---

## 6. functions (`6_functions.html`)

### 6.1 함수 선언 vs 표현식

### 6.2 화살표 함수 (Arrow Function)


---

## 7. template literal (`7_template-literal.html`)

### 7.1 템플릿 리터럴


---

## 🧠 느낀 점 (공통)



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

