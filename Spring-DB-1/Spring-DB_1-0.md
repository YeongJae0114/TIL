# JDBC 개념

## JDBC 등장 이유

애플리케이션 개발시 중요한 데이터는 데이터베이스에 보관한다.

클라이언트는 애플리케이션 서버를 통해 데이터를 저장하거나 조회하면, 애플리케이션 서버는 데이터베이스의 데이터를 전달한다.

## **애플리케이션 서버와 DB - 일반적인 사용법**
<img src="/img/Spring_DB/DB-1.png" alt="cookie2" width="800" height="300" />

## 옛날 DB의 단점

<img src="/img/Spring_DB/DB-2.png" alt="cookie2" width="800" height="300" />

- 데이터베이스마다 커넥션을 연결하는 방법이 다르기 때문에 DB 변경시 서버에 개발된 DB 사용 코드도 변경해야 한다.
- 이러한 문제를 해결하기 위해 JDBC라는 자바 표준이 등장한다.

## JDBC 표준 인터페이스

JDBC는 자바에서 데이터베이스에 접속할 수 있도록 하는 자바 API다. 이 인터페이스를 각각의 DB에 맞도록 구현해서 라이브러리로 제공한다. 이것을 JDBC 드라이버라고 한다.

<img src="/img/Spring_DB/DB-3.png" alt="cookie2" width="800" height="400" />

- java.sql.Connection : 연결
- java.sql.Statement : SQL을 담은 내용
- java.sql.ResultSet : SQL 요청 응답

## JDBC와 최신 데이터 접근 기술

- JDBC 직접 사용
- SQL Mapper
    - JDBC를 편리하게 사용하도록 도와준다.
        - SQL 응답 결과를 객체로 변환
        - JDBC의 반복 코드를 제거
    - 단점 : 개발자가 SQL을 직접 작성해야한다
        - JdbcTemplate, MyBatis
    
- ORM 기술
    - 객체를 관계형 데이터베이스 테이블과 매핑 해주는 기술
    - SQL을 동적으로 만들어 실행
        - JPA, 하이버네이트, 이클립스링크
