## JdbcTemplate 사용법 정리
>JdbcTemplate에 대한 사용법은 스프링 공식 메뉴얼에 자세히 소개되어 있다. 여기서는 스프링 공식 메뉴얼이 제공하는 예제를 통해 JdbcTemplate의 기능을 간단히 정리해보자.

조회
**단건 조회 - 숫자 조회**
```java
int rowCount = jdbcTemplate.queryForObject("select count(*) from t_actor",
Integer.class);
```
- 하나의 로우를 조회할 때는 `queryForObject()` 를 사용하면 된다. 
- 지금처럼 조회 대상이 객체가 아니라 단순 데이터 하나라면 타입을 `Integer.class` , `String.class` 와 같이 지정해주면 된다.

**단건 조회 - 숫자 조회, 파라미터 바인딩** 
```java
int countOfActorsNamedJoe = jdbcTemplate.queryForObject(
"select count(*) from t_actor where first_name = ?", Integer.class, "Joe");
```
- 숫자 하나와 파라미터 바인딩 예시이다. 

**단건 조회 - 문자 조회**
```java
 String lastName = jdbcTemplate.queryForObject(
         "select last_name from t_actor where id = ?",
         String.class, 1212L);
```
- 문자 하나와 파라미터 바인딩 예시이다. 

**단건 조회 - 객체 조회**
```java
 Actor actor = jdbcTemplate.queryForObject(
         "select first_name, last_name from t_actor where id = ?",
         (resultSet, rowNum) -> {
            Actor newActor = new Actor();
            newActor.setFirstName(resultSet.getString("first_name"));
            newActor.setLastName(resultSet.getString("last_name"));
            return newActor;
        }, 1212L);
```
- 객체 하나를 조회한다. 결과를 객체로 매핑해야 하므로 `RowMapper` 를 사용해야 한다. 여기서는 람다를 사용했다.

**목록 조회 - 객체**
```java
 List<Actor> actors = jdbcTemplate.query(
         "select first_name, last_name from t_actor",
         (resultSet, rowNum) -> {
             Actor actor = new Actor();
             actor.setFirstName(resultSet.getString("first_name"));
             actor.setLastName(resultSet.getString("last_name"));
             return actor;
});
```
- 여러 로우를 조회할 때는 `query()` 를 사용하면 된다. 결과를 리스트로 반환한다.
- 결과를 객체로 매핑해야 하므로 `RowMapper` 를 사용해야 한다. 여기서는 람다를 사용했다.
