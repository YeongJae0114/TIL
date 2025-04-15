## 기본적인 Spring Boot 프로젝트 셋팅하기
### version
- Spring Boot는 3.x.x 버전
- MySQL 8.x 버전
- JDK 17

### 의존성 추가 
Dependencies는 Spring Boot DevTools, Spring Web, Spring Data JPA, MySQL Driver 추가 
- implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
- implementation 'org.springframework.boot:spring-boot-starter-web'
- implementation 'org.springframework.boot:spring-boot-starter-data-redis'
- runtimeOnly 'com.mysql:mysql-connector-j' 


### DB 연결 설정 application.yml
```yml
# local 환경
spring:
  profiles:
    default: local
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: dudwo
    hikari:
      driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

  data:
    redis:
      host: localhost
      port: 6379

logging:
  level:
    org.springframework.cache: trace

```
- 기본적인 mysql 설정과 JPA 설정을 해줬다.
- Redis 설정, 포트번호를 추가 (6379)
- Cache 가 잘 작동하는지 로그를 추적

### 0. Redis 관련 설정
**RedisCacheConfig**
```java
@Configuration
@EnableCaching
public class RedisCacheConfig {
    @Bean
    public CacheManager boardCacheManager(RedisConnectionFactory redisConnectionFactory) {
        RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration
                .defaultCacheConfig()
                // Redis에 Key를 저장할 때 String으로 직렬화(변환)해서 저장
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new StringRedisSerializer()))
                // Redis에 Value를 저장할 때 Json으로 직렬화(변환)해서 저장
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new Jackson2JsonRedisSerializer<Object>(Object.class)
                        )
                )
                // 데이터의 만료기간(TTL) 설정
                .entryTtl(Duration.ofMinutes(1L));

        return RedisCacheManager
                .RedisCacheManagerBuilder
                .fromConnectionFactory(redisConnectionFactory)
                .cacheDefaults(redisCacheConfiguration)
                .build();
    }
```
- @EnableCaching : pring 캐시 기능을 활성화
- 이 설정은 Redis에 Key는 문자열, Value는 JSON으로 저장하고,
- 1분 TTL을 가진 캐시 매니저를 등록해서
- @Cacheable("board") 같은 식으로 캐시를 사용할 수 있게 해주는 설정이다.


**RedisConfig**
```java
@Configuration
public class RedisConfig {
    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.port}")
    private int port;

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        // Lettuce라는 라이브러리를 활용해 Redis 연결을 관리하는 객체를 생성하고
        // Redis 서버에 대한 정보(host, port)를 설정한다.
        return new LettuceConnectionFactory(new RedisStandaloneConfiguration(host, port));
    }
```
- application.yml 에서 설정했던 경로를 주입받는다.
  - Redis의 host, port 값
- **Redis와 연결을 관리하는 객체 (LettuceConnectionFactory)**를 만들어서 빈으로 등록
  - Spring의 Redis 기능이 Redis 서버와 연결
  - Lettuce는 Netty 기반의 Redis 클라이언트 라이브러리이다.
   
> 이 설정은 host와 port 정보를 이용해서 Redis와 연결하는 Lettuce 클라이언트 설정이야. RedisTemplate, RedisCacheManager 같은 기능들이 이 연결을 사용함.

### 1.Board 엔티티 만들기
```java
@Entity
@Getter
@Table(name = "boards")
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title ;

    private String content;

    @CreatedDate
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime createdAt;
}
```
- Board 정보를 저장하기 위해서 엔티티를 생성
- 페이지네이션으로 데이터를 createdAt을 기준으로 가져오기 위해 createdAt 필드 추가

### 2.기본 Controller, Service, Repository 만들기
**BoardController**
```java
@RestController
@RequestMapping("boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;
    
    @GetMapping()
    public List<Board> getBoards(
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size
    ) {
        return boardService.getBoards(page, size);
    }
}
```


**BoardService**
```java
@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;

    @Cacheable(cacheNames = "getBoards", key = "'boards:page' + #page + 'size' + #size", cacheManager = "boardCacheManager")
    public List<Board> getBoards(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Board> pageOfBoards = boardRepository.findAllByOrderByCreatedAtDesc(pageable);
        return pageOfBoards.getContent();
    }
}
```
- Redis 관련 로직은 Service 계층에서 구현된다. 

**BoardRepository**
```java
@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    Page<Board> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
```
