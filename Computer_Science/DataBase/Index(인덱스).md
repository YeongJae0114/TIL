# Index(인덱스)

## 🔎 인덱스란?

인덱스는 데이터베이스에 검색 속도를 향상시켜준다. <key, value> 형태로 정렬되어 책의 목차처럼 빠르게 어떤 정보에 접근할 수 있도록 도와준다.

## 🔎 **인덱스의 장단점**

**장점**

- 정렬되어 있기 때문에 데이터를 찾을 때 테이블 전체를 풀 스캔 할 필요 없이 정렬된 인덱스에서 원하는 데이터를 찾을 수 있다.
- 특정 범위, 최대, 최소 값을 찾는데도 유리하다.

그렇다면 모든 테이블의 컬럼에 인덱스를 지정하면 엄청 빨라지려나?? `실제로 그렇게 데이터베이스를 디자인 하지 않는다.`

왜일까??

- 인덱스 자체를 저장할 추가 공간이 필요하기 때문에 인덱스가 많으면 해당 테이블의 용량이 커지게 된다.
- 인덱스 자체가 정렬되어 있기 때문에 데이터를 추가, 삭제하는데에 있어서 관리 리소스가 들어간다.
    - 특정한 목적을 가지고 사용되어야 한다.

## 🔎 인덱스의 자료구조

인덱스는 몇 가지 자료구조를 통해 만들어진다. 그 중 가장 대표적인 3가지인 `해시 테이블`, `B-Tree`, `B+Tree` 가 있다.

### **해시 테이블**

- 해시 테이블은 key, value 형태로 데이터를 저장한다. key를 통해 값에 바로 접근하므로 검색 시 O(1)의 복잡도로 빠르게 데이터를 찾을 수 있다.
- 그러나 key의 등호 연산에만 유리하고 쿼리에서 자주 사용되는 부등호 연산에는 불리하다.

### Tree가 아닌 B-Tree를 사용할까?

<img width="234" alt="image" src="https://github.com/user-attachments/assets/9c400f36-129b-4cdf-8ab3-640a6022e31d">

일반적인 트리이다.

인덱스는 정렬이 되어 있기 때문에 분할정복 방식으로 `평균 O(logN)`의 시간 복잡도로 트리 내에서 데이터를 찾을 수 있다.

- 하지만 어떤 데이터가 추가되고 삭제 될지 모른다. 최악의 경우 테이블은 이런 형태가 될 수도 있다.

<img width="234" alt="image" src="https://github.com/user-attachments/assets/eb789a00-991f-40e3-8c5d-715851e9065b">

이렇게 한쪽으로 편향된 트리가 만들어진다.

- 이렇게 한 쪽으로 편향된 트리는 검색을 위해 모든 노드를 순회 해야하므로검색 성능이 O(N)까지 떨어질 수 밖에 없다.

`→ 때문에 B Tree를 사용한다`

### B-Tree

<img width="640" alt="image" src="https://github.com/user-attachments/assets/f4e48625-4064-4fb9-b8f7-5413fc224b58">

값을 찾기 위해서 일반적인 트리처럼 좌, 우측만을 사용하지 않고 노드에 저장된 값 사이의 포인터를 통해 탐색한다.

### B+Tree

<img width="640" alt="image" src="https://github.com/user-attachments/assets/0d0860d0-d2b6-4ba7-8665-fb060b54ad4c">

- B+Tree는 리프 노드에만 데이터를 저장하고 모든 리프노드를 Linke List를 통해 연결한다.

## 🔎 Index 사용방법

### 인덱스 생성

```sql
CREATE [UNIQUE] INDEX 인덱스_이름
	ON 테이블_이름 (열 이름) [ASC | DESC]
```

![image](https://github.com/user-attachments/assets/7d898c19-4441-4373-9035-fb2a5a218bd8)

- 테이블 : `SCOUNTER`
- 칼럼명 : `ARPORT` 
- ARPORT 칼럼 값 : `LCY`  

**SQL 문**
```sql
Select *
From SCOUNTER
Where ARPORT = 'LCY'
```

SCOUNTER 테이블에 AIRPORT 칼럼에 대한 WHERE 문이 포함된 쿼리가 나갈 때 AIRPORT 인덱스 테이블에 저장된 Key-value 값을 참조해서 SCOUNTER 테이블에서 결과 값을 반환해온다.
