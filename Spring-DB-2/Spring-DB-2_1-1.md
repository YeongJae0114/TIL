# 데이터 접근 기술 JdbcTemplate
## JdbcTemplate 소개
>JdbcTemplate은 Spring Framework에서 제공하는 JDBC(Java Database Connectivity) 추상화 클래스로, JDBC 프로그래밍을 간편하게 사용할 수 있게 한다.
JdbcTemplate은 복잡한 예외 처리나 리소스 관리를 자동으로 처리해 주어, SQL 질의 실행 및 데이터베이스 작업을 간편하고 안전하게 수행할 수 있도록 도와준다.

![image](https://github.com/user-attachments/assets/13307043-11b8-452a-b53c-c0b68e028d6e)


**장점**
- 설정이 편리함
  - spring-jdbc 라이브러리에 포함되어 있기 때문에 jdbc를 사용한다면 기본적으로 사용할 수 있다.
- 반복 문제 해결
  - JdbcTemplate은 템플릿 콜백 패턴을 사용해서, JDBC를 직접 사용할 때 발생하는 대부분의 반복작업을 대신 처리해준다.
  - 개발자는 SQL을 작성하고, 전달할 파리미터를 정의하고, 응답 값을 매핑하기만 하면 된다.
  - 우리가 생각할 수 있는 대부분의 반복 작업을 대신 처리해준다.
    - 커넥션 획득
    - statement 를 준비하고 실행
    - 결과를 반복하도록 루프를 실행
    - 커넥션 종료, statement , resultset 종료
    - 트랜잭션 다루기 위한 커넥션 동기화
    - 예외 발생시 스프링 예외 변환기 실행

**단점**
- 동적 쿼리문을 해결하기 어렵다.

다음 코드로 이해 해보자

**ItemRepositoryV1**
```java
@Slf4j
@RequiredArgsConstructor
public class ItemRepositoryV1 implements ItemRepository {

    private final JdbcTemplate jdbcTemplate;

    // 아이템 저장 메서드
    @Override
    public Item save(Item item) {
        String sql = "insert into item(item_name, price, quantity) values (?,?,?)";
        
        // 자동 생성된 ID를 받기 위한 KeyHolder 생성
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        // 데이터 삽입 후 자동 생성된 키 값 저장
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, new String[]{"id"});
            ps.setString(1, item.getItemName());
            ps.setInt(2, item.getPrice());
            ps.setInt(3, item.getQuantity());
            return ps;
        }, keyHolder);
        
        // 반환된 키 값 설정 후 객체 반환 (실제 코드에서는 아이템 반환할 필요 있음)
        return null; 
    }

    // 아이템 정보 업데이트 메서드
    @Override
    public void update(Long itemId, ItemUpdateDto updateParam) {
        String sql = "update item set item_name=?, price=?, quantity=?";
        
        // 파라미터로 전달받은 아이템 정보를 업데이트
        jdbcTemplate.update(sql,
                updateParam.getItemName(),
                updateParam.getPrice(),
                updateParam.getQuantity(),
                itemId);
    }

    // ID로 아이템 조회
    @Override
    public Optional<Item> findById(Long id) {
        String sql = "select id, item_name, price, quantity from item where id=?";
        
        try {
            // 아이템 조회 후, 없는 경우 EmptyResultDataAccessException 예외 처리
            Item item = jdbcTemplate.queryForObject(sql, itemRowMapper(), id);
            return Optional.of(item);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty(); // 결과가 없는 경우 빈 Optional 반환
        }
    }

    // RowMapper: 쿼리 결과를 Item 객체로 매핑
    private RowMapper<Item> itemRowMapper(){
        return ((rs, rowNum) -> {
            Item item = new Item();
            item.setId(rs.getLong("id"));
            item.setItemName(rs.getString("item_name"));
            item.setPrice(rs.getInt("price"));
            item.setQuantity(rs.getInt("quantity"));
            return item;
        });
    }

    // 조건에 따라 아이템 목록 조회
    @Override
    public List<Item> findAll(ItemSearchCond cond) {
        String itemName = cond.getItemName();
        Integer maxPrice = cond.getMaxPrice();
        String sql = "select id, item_name, price, quantity from item";

        // 조건에 따라 동적 쿼리 구성
        if (StringUtils.hasText(itemName) || maxPrice != null) {
            sql += " where";
        }
        
        boolean andFlag = false; // and 여부 플래그
        List<Object> param = new ArrayList<>();
        
        if (StringUtils.hasText(itemName)) {
            sql += " item_name like concat('%',?,'%')";
            param.add(itemName);
            andFlag = true; // 조건 추가 후 AND 연결 여부 설정
        }
        
        if (maxPrice != null) {
            if (andFlag) {
                sql += " and"; // AND 추가
            }
            sql += " price <= ?";
            param.add(maxPrice);
        }
        
        // 쿼리 로그 기록 및 실행
        log.info("sql={}", sql);
        return jdbcTemplate.query(sql, itemRowMapper(), param.toArray());
    }
}
```
### 주요 메서드 요약
- save 메서드: KeyHolder를 통해 자동 생성된 ID를 받음.
- update 메서드: 파라미터로 전달된 정보로 특정 아이템을 업데이트.
- findById 메서드: ID로 단일 아이템 조회, 없으면 Optional.empty() 반환.
- itemRowMapper 메서드: ResultSet을 Item 객체로 변환하는 매퍼.
- findAll 메서드: 조건에 따른 동적 쿼리 생성 후 아이템 리스트 반환.


