# 2-0. 커넥션 풀 이해

<img src="/img/Spring_DB/DB-2_1.png" alt="cookie2" width="800" height="300" />


- 커넥션을 획득하기 위한 과정은 복잡하고 시간이 많이 소모되는 일이다
- 위 처럼 요청 마다 커넥션을 새로 생성한다면 응답 속도에 영향을 미친다.
- 이러한 문제를 해결하기 위해 커넥션 풀을 만들고 커넥션을 관리한다.

 

## 커넥션 풀 생성(초기화)

<img src="/img/Spring_DB/DB-2_2.png" alt="cookie2" width="800" height="300" />


커넥션 풀에 미리 필요한 만큼의 커넥션을 생성해 놓는다

기본값은 보통 10개이다.

## 커넥션 풀 연결 상태

<img src="/img/Spring_DB/DB-2_3.png" alt="cookie2" width="800" height="300" />


- 커넥션 풀에 들어있는 커넥션은 TCP/IP 로 DB와 커넥션이 연결되어 있는 상태이다
- 언제든지 SQL을 DB에 전달할 수 있다.

## 커넥션 풀 사용 획득

<img src="/img/Spring_DB/DB-2_4.png" alt="cookie2" width="800" height="300" />

- DB 드라이버를 통해서 새로운 커넥션을 획득
- 이미 생성된 커넥션을 가져다 쓴다

## 커넥션 풀 사용 반환

<img src="/img/Spring_DB/DB-2_5.png" alt="cookie2" width="800" height="300" />


- 커넥션을 사용해 SQL을 데이터베이스에 전달하고 결과를 처리한 후
    - 커넥션을 종료하지 않고 다음에 사용할 수 있도록 커넥션 풀에 반환한다.
    - 이때 커넥션은 종료되는 것이 아니라 커넥션 풀에 반환된다.