# JDBC 개발 (DB 연결)

> H2 데이터베이스를 사용하고, DB 서버를 실행시켜야함
> 

**ConnectionConst**

```java
package hello.jdbc.connection;

public abstract class ConnectionConst {
    public static final String URL = "jdbc:h2:tcp://localhost/~/test";
    public static final String USERNAME = "sa";
    public static final String PASSWORD="";

}
```

데이터베이스에 접근하는데 필요한 기본 정보를 저장

이를 이용해 DB에 접근한다.

**DBConnectionUtil**

```java
package hello.jdbc.connection;

import lombok.extern.slf4j.Slf4j;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import static hello.jdbc.connection.ConnectionConst.*;

@Slf4j
public class DBConnectionUtil {
    public static Connection getConnection() {
        try {
            Connection connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
            log.info("get connection={}, class={}", connection, connection.getClass());
            return connection;
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        }
    }
}
```

데이터베이스 연결을 위해 DriverManager.getConnection  로 데이터베이스 드라이버를 찾아 해당 드라이버가 제공하는 커넥션을 반환한다. (어떤 DB를 사용하는지 판단, 여기서는 H2 데이터베이스 커넥션을 반환)

## JDBC 개발 - 등록

데이터를 데이터베이스에 관리하는 기능

**Member**

```java
package hello.jdbc.domain;

import lombok.Data;

@Data
public class Member {
    private String memberId;
    private int money;
    public Member(){}
    public Member(String memberId, int money){
        this.memberId = memberId;
        this.money = money;
    }
}
```

회원 ID 와, 소지한 금액을 표현하는 클래스

**MemberRepositoryV0**

```java
package hello.jdbc.repository;

import hello.jdbc.connection.DBConnectionUtil;
import hello.jdbc.domain.Member;
import lombok.extern.slf4j.Slf4j;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.NoSuchElementException;

@Slf4j
public class MemberRepositoryV0 {
    public Member save(Member member) throws SQLException {
        String sql = "insert into member(member_id, money) values(?, ?)";

        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, member.getMemberId());
            pstmt.setInt(2, member.getMoney());
            pstmt.executeUpdate();
            return member;

        }catch (SQLException e){
            log.info("db error",e );
            throw e;
        }finally {
            close(con, pstmt, null);
        }
    }
 }
    private void close(Connection con , Statement stmt, ResultSet rs){
        if (rs != null){
            try {
                rs.close();
            }catch (SQLException e){
                log.info("error",e);
            }
        }

        if (stmt != null){
            try {
                stmt.close();
            }catch (SQLException e){
                log.info("error", e);
            }
        }

        if (con != null){
            try {
                con.close();
            }catch (SQLException e){
                log.info("error", e);
            }
        }
    }
    private Connection getConnection(){
        return DBConnectionUtil.getConnection();
    }
}
```

**커넥션 획득** 

- getConnection()  →  return DBConnectionUtil.getConnection();
    - H2 DB 커넥션 획득

**save()**

- sql : 데이터베이스에 전달할 SQL (데이터를 저장하는 insert 문 사용)
- con.prepareStatement(sql); **(데이터베이스에 전달할 SQL과 파라미터로 전달할 데이터를 준비)**
    - slq : String sql = "insert into member(member_id, money) values(?, ?)";
    - pstmt.setString(1, member.getMemberId());
        - SQL의 첫 번째 ? 에 값을 지정한다. (문자이므로 setString)
    - pstmt.setInt(2, member.getMoney());
        - SQL의 두 번째 ? 에 값을 지정한다. (Int형 이므로 setInt)
    - pstmt.executeUpdate();
        - Satatement를 통해 준비된 SQL을 커녁션을 통해 실제 DB에 전달한다.
        - Int 형으로 영향을 받은 DB row 수를 반환
    

**close() : 리소스 정리**

- 쿼리를 실행하고 나면 리소스를 정리해야한다.
- 사용한 리소스
    1. Connection
    2. PreparedStatement
    3. ResultSet (위 코드에선 사용하지 않은)
- 리소스를 정리할 때는 역순으로 종료 해야한다.
    - 때문에 rs → pstmt → con 순으로 리소스 반환
    
    ### 주의
    
    > 리소스 정리는 꼭! 해주어야 한다. 따라서 예외가 발생하든, 하지 않든 항상 수행되어야 하므로 `finally` 구문에 주의해서 작성해야한다. 만약 이 부분을 놓치게 되면 커넥션이 끊어지지 않고 계속 유지되는 문제가 발생할 수 있다. 이런 것을 리소스 누수라고 하는데, 결과적으로 커넥션 부족으로 장애가 발생할 수 있다.
    > 
    
    ### 참고
    
    > `PreparedStatement` 는 `Statement` 의 자식 타입인데, `?` 를 통한 파라미터 바인딩을 가능하게 해준다. 참고로 SQL Injection 공격을 예방하려면 `PreparedStatement` 를 통한 파라미터 바인딩 방식을 사용해야 한다.
    > 

## JDBC 개발 - 조회

**MemberRepositoryV0 -** findById()

```java
public Member findById(String memberId) throws SQLException {
        String sql = "select * from member where member_id = ?";

        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try{
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, memberId);

            rs = pstmt.executeQuery();
            if (rs.next()){
                Member member = new Member();
                member.setMemberId(rs.getString("member_id"));
                member.setMoney(rs.getInt("money"));
                return member;
            }else{
                throw new NoSuchElementException("member not found memberId="+memberId);
            }
        }catch(SQLException e){
            log.info("error", e);
            throw e;
        }finally {
            close(con,pstmt,rs);
        }
    }
```

**findById() - 쿼리 실행**

- **sql :** 데이터 조회를 위한 Selct SQL 준비
- **rs :** pstmt.executeQuery() : 데이터를 조회
    - 결과를 ResultSet에 담아서 반환

**executeQuery()**

- ResultSet executeQuery() throws SQLException;

**ResultSet**

- ResultSet :  select member_id, money 라고 지정하면 member_id , money 라는 이름으로 데이터
가 저장
- ResultSet 내부에 있는 커서를 이동시켜 다음 데이터를 조회할 수 있다.
- rs.next() : 최초 한번은 호출되어야 데이터를 조회할 수 있다.
    - rs.next() 의 결과가 true 면  커서의 이동 결과 데이터가 있다는 뜻이다.

## JDBC 개발 - 수정, 삭제

**MemberRepositoryV0 -** update()

```java
// 수정
public void update(String memberId, int money) throws SQLException {
        String sql = "update member set money=? where member_id=?";

        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);

            pstmt.setInt(1, money);
            pstmt.setString(2,memberId);

            int resultSize = pstmt.executeUpdate();
            log.info("resultSize={}",resultSize);

        }catch (SQLException e){
            log.error("db error",e );
            throw e;
        }finally {
            close(con, pstmt, null);
        }
    }
```

executeUpdate() 를 사용해 데이터 수정

**MemberRepositoryV0 -** delete()

```java
    public void delete(String memberId) throws SQLException {
        String sql = "delete from member where member_id=?";

        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = getConnection();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, memberId);
            pstmt.executeUpdate();

        }catch (SQLException e){
            log.info("db error",e );
            throw e;
        }finally {
            close(con, pstmt, null);
        }
    }
```