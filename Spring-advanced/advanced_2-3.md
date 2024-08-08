## 쓰레드 로컬 - 주의사항
쓰레드 로컬의 값을 사용 후 제거하지 않고 그냥 두면 WAS(톰캣) 처럼 쓰레드 풀을 사용하는 경우에 심각한 문제가 발생한다.

![image](https://github.com/user-attachments/assets/fd7bfdc7-afcd-4a08-be35-9ce2ce675adf)
1. 사용자A가 저장 HTTP를 요청했다.
2. WAS는 쓰레드 풀에서 쓰레드를 하나 조회한다.
3. 쓰레드 `thread-A` 가 할당되었다.
4. `thread-A` 는 `사용자A` 의 데이터를 쓰레드 로컬에 저장한다.
5. 쓰레드 로컬의 `thread-A` 전용 보관소에 `사용자A` 데이터를 보관한다.


![image](https://github.com/user-attachments/assets/76bd5ba7-a020-4501-8811-f7b42a82f4f8)
1. 사용자A의 HTTP 응답이 끝난다.
2. WAS는 사용이 끝난 `thread-A` 를 쓰레드 풀에 반환한다. 쓰레드를 생성하는 비용은 비싸기 때문에 쓰레 드를 제거하지 않고, 보통 쓰레드 풀을 통해서 쓰레드를 재사용한다.
3. `thread-A` 는 쓰레드풀에 아직 살아있다. 따라서 쓰레드 로컬의 `thread-A` 전용 보관소에 `사용자A` 데이 터도 함께 살아있게 된다.

![image](https://github.com/user-attachments/assets/78b102bc-ebc9-4098-b4aa-2c7a5062da59)
1. 사용자B가 조회를 위한 새로운 HTTP 요청을 한다.
2. WAS는 쓰레드 풀에서 쓰레드를 하나 조회한다.
3. 쓰레드 `thread-A` 가 할당되었다. (물론 다른 쓰레드가 할당될 수 도 있다.)
4. 이번에는 조회하는 요청이다. `thread-A` 는 쓰레드 로컬에서 데이터를 조회한다.
5. 쓰레드 로컬은 `thread-A` 전용 보관소에 있는 `사용자A` 값을 반환한다.
6. 결과적으로 `사용자A` 값이 반환된다.
7. 사용자B는 사용자A의 정보를 조회하게 된다.
