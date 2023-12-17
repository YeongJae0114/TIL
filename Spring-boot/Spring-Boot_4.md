## 스프링 DB 접근 기술

### Jdbc 리포지토리 구현

- JDBC API로 직접 코딩하는 것은 20년 전 이야기

### 스프링 JdbcTemplate
- 순수 Jdbc와 동일한 환경설정
- 스프링 JdbcTemplate과 MyBatis 같은 라이브러리는 JDBC API에서 본 반복 코드를 대부분 제거해준다. 하지 만 SQL은 직접 작성


### JPA
- JPA는 기존의 반복 코드는 물론이고, 기본적인 SQL도 JPA가 직접 만들어서 실행
- JPA를 사용하면, SQL과 데이터 중심의 설계에서 객체 중심의 설계로 패러다임을 전환을 할 수 있다. 
- JPA를 사용하면 개발 생산성을 크게 높일 수 있다

### 스프링 데이터 JPA
**스프링 데이터 JPA 제공 기능** 
- 인터페이스를 통한 기본적인 CRUD
- `findByName()` , `findByEmail()` 처럼 메서드 이름 만으로 조회 기능 제공 
- 페이징 기능 자동 제공

