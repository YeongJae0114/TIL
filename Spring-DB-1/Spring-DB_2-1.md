# 2-1. DataSource 이해, 예제

## 커넥션을 획득하는 방법

DriverManager : 직접 커넥션 생성

<img src="/img/Spring_DB/DB-2_6.png" alt="cookie2" width="800" height="300" />


## 커넥션을 획득 방법 추상화

<img src="/img/Spring_DB/DB-2_7.png" alt="cookie2" width="800" height="300" />


- 직접 커넥션 생성하는 코드에 커넥션 풀을 사용하려면 기존 애플리케이션 코드에 변경되는 부분이 발생한다
    - 이러한 변경을 위해 DataSource 를 통해 커넥션 획득 방법을 추상화 한다.
    - DataSource의 핵심 기능은 커넥션 조회이다.

## DataSource 예제1-DriverManager

기존 DriverManager을 통한 커넥션 획득

**ConnectionTest - 기존** DriverManager

```java
package hello.jdbc.connection;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import static hello.jdbc.connection.ConnectionConst.*;

@Slf4j
public class ConnectionTest {
    @Test
    void driverManager() throws SQLException {
        Connection con1 = DriverManager.getConnection(URL, USERNAME, PASSWORD);
        Connection con2 = DriverManager.getConnection(URL, USERNAME, PASSWORD);

        log.info("connection={}, class = {}", con1, con1.getClass());
        log.info("connection={}, class = {}", con2, con2.getClass());
    }
}
```

**ConnectionTest - DataManagerDataSource 사용**

```java
package hello.jdbc.connection;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import static hello.jdbc.connection.ConnectionConst.*;

@Slf4j
public class ConnectionTest {
    @Test
    void driverManager() throws SQLException {
        Connection con1 = DriverManager.getConnection(URL, USERNAME, PASSWORD);
        Connection con2 = DriverManager.getConnection(URL, USERNAME, PASSWORD);

        log.info("connection={}, class = {}", con1, con1.getClass());
        log.info("connection={}, class = {}", con2, con2.getClass());
    }

    @Test
    void dataSourceDriverManager() throws SQLException{
        DriverManagerDataSource driverDataSource = new DriverManagerDataSource(URL, USERNAME, PASSWORD);
        useDataSource(driverDataSource);
    }

    private void useDataSource(DataSource dataSource)throws SQLException{
        Connection con1 = dataSource.getConnection();
        Connection con2 = dataSource.getConnection();
        log.info("connection={}, class = {}", con1, con1.getClass());
        log.info("connection={}, class = {}", con2, con2.getClass());
    }
}

```

- 기존 코드와 비슷하지만, DriverManager 는 커넥션을 획득할 때 마다 파라미터를 계속 전달해야한다.
- DataSource 를 사용하면 단순히 dataSource.getConnection(); 만 호출하면 된다
    - DataSource 는 설정과 사용을 분리했기 때문에 향후 변경에 더 유연하게 사용가능

## DataSource 예제2-커넥션 풀

DataSource를 통해 커넥션 풀 사용

**ConnectionTest** - DataSource 커넥션 풀 추가

```java
package hello.jdbc.connection;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import static hello.jdbc.connection.ConnectionConst.*;

@Slf4j
public class ConnectionTest {
    @Test
    void dataSourceConnectionPool() throws SQLException, InterruptedException {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(URL);
        dataSource.setUsername(USERNAME);
        dataSource.setPassword(PASSWORD);
        dataSource.setMaximumPoolSize(10);
        dataSource.setPoolName("MyPoll");

        useDataSource(dataSource);
        // test code 가 끝나기 전에 커넥션 풀이 생성되지 않기 떄문에 대기
        Thread.sleep(1000);
    }
}
```

- HikariCP 커넥션 풀을 사용한다. HikariDataSource는 DataSource 인터페이스를 구현한다.
- 커넥션에서 사용할 파라미터를 설정(URL, USERNAME, PASSWORD)해주고
- 커넥션 풀 최대 사이즈 지정 (default = 10)
- 커넥션 풀 이름 지정
- 커넥션 풀이 생성될 시간을 동안 대기