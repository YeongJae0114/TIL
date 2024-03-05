## 스프링 부트의 자동 리소스 등록
**데이터소스 - 자동 등록**
- 스프링 부트는 데이터소스( `DataSource` )를 스프링 빈에 자동으로 등록한다. 
- 자동으로 등록되는 스프링 빈 이름: `dataSource`
- 참고로 개발자가 직접 데이터소스를 빈으로 등록하면 스프링 부트는 데이터소스를 자동으로 등록하지 않는다.

이때 스프링 부트는 다음과 같이 `application.properties` 에 있는 속성을 사용해서 `DataSource` 를 생성한다. 그리고 스프링 빈에 등록

**application.properties**
```properties
spring.datasource.url=jdbc:h2:tcp://localhost/~/test
spring.datasource.username=sa
spring.datasource.password=
```

### 데이터 소스, 트랜잭션 매니저 직접 등록
```java
@TestConfiguration
    static class TestConfig{
        @Bean
        DataSource dataSource(){
            return new DriverManagerDataSource(URL, USERNAME, PASSWORD);
        }
        @Bean
        PlatformTransactionManager transactionManager(){
            return new DataSourceTransactionManager(dataSource());
        }
        @Bean
        MemberRepositoryV3 memberRepositoryV3(){
            return new MemberRepositoryV3(dataSource());
        }
        @Bean
        MemberServiceV3_3 memberServiceV3_3(){
            return new MemberServiceV3_3(memberRepositoryV3());        }
    }

```


### 데이터 소스, 트랜잭션 매니저 자동 등록
```java
@TestConfiguration
    static class TestConfig {
        private final DataSource dataSource;
        public TestConfig(DataSource dataSource) {
            this.dataSource = dataSource;
        }
        @Bean
        MemberRepositoryV3 memberRepositoryV3() {
            return new MemberRepositoryV3(dataSource);
        }
        @Bean
        MemberServiceV3_3 memberServiceV3_3() {
            return new MemberServiceV3_3(memberRepositoryV3());
        }
    }

```


