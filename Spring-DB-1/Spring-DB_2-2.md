# 2-2. DataSource 적용

애플리케이션에 DataSource 적용

**MemverRepositoryV1**

```java
package hello.jdbc.repository;

import hello.jdbc.domain.Member;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.support.JdbcUtils;

import javax.sql.DataSource;
import java.sql.*;
import java.util.NoSuchElementException;

// JDBC DataSource 사용
@Slf4j
public class MemberRepositoryV1 {
   private final DataSource dataSource;

    public MemberRepositoryV1(DataSource dataSource) {
        this.dataSource = dataSource;
    }

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

    private void close(Connection con , Statement stmt, ResultSet rs){
        JdbcUtils.closeResultSet(rs);
        JdbcUtils.closeStatement(stmt);
        JdbcUtils.closeConnection(con);

    }
    private Connection getConnection() throws SQLException {
        Connection con = dataSource.getConnection();
        log.info("get connection={} class = {}", con, con.getClass());
        return con;
    }
}

```

- DataSource 의존관계 주입
- JdbcUtils.close() : 편의 메서드를 이용해 커넥션 반환

```java
   private final DataSource dataSource;

...

...
    public MemberRepositoryV1(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private Connection getConnection() throws SQLException {
        Connection con = dataSource.getConnection();
        log.info("get connection={} class = {}", con, con.getClass());
        return con;
    }
```

- 외부에서 DataSource를 주입 받아서 사용

**MemberRepositoryV1Test**

```java
package hello.jdbc.repository;
import static hello.jdbc.connection.ConnectionConst.*;

import com.zaxxer.hikari.HikariDataSource;
import hello.jdbc.domain.Member;
import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.SQLException;
import java.util.NoSuchElementException;

@Slf4j
class MemberRepositoryV1Test {

    MemberRepositoryV1 memberRepositoryV1;
    @BeforeEach
    void beforeEach(){
        // 기본 DriverManagerDataSource 사용
        //DriverManagerDataSource dataSource = new DriverManagerDataSource(URL, USERNAME, PASSWORD);

        // 커넥션 풀링
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(URL);
        dataSource.setUsername(USERNAME);
        dataSource.setPassword(PASSWORD);

        memberRepositoryV1 = new MemberRepositoryV1(dataSource);
    }

    @Test
    void crud() throws SQLException {
        //save
        Member member = new Member("memberV3", 10000);
        memberRepositoryV1.save(member);

        // findById
        Member findMember = memberRepositoryV1.findById(member.getMemberId());
        log.info("findMember={}",findMember);
        Assertions.assertThat(findMember).isEqualTo(member);

        // update
        memberRepositoryV1.update(member.getMemberId(),20000);
        Member updateMember = memberRepositoryV1.findById(member.getMemberId());
        Assertions.assertThat(updateMember.getMoney()).isEqualTo(20000);

        // delete
        memberRepositoryV1.delete(member.getMemberId());
        Assertions.assertThatThrownBy(()->memberRepositoryV1.findById(member.getMemberId()))
                .isInstanceOf(NoSuchElementException.class);
    }
}
```

### DI

> DriverManagerDataSource → HikariDataSource 로 변경해도 MemberRepositoryV1 의 코드는 전혀 변경하지 않아도 된다.  MemberRepositoryV1 는 DataSource 인터페이스에만 의존하기 때문이다. 이것이 DataSource 를 사용하는 장점이다.(DI + OCP)
>