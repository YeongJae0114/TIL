# JdbcTemplate 이름 지정 파라미터
>JdbcTemplate을 사용했을 때는 파라미터의 순서가 바뀌면 타입 오류가 발생하지 않는 이상 DB에 뒤바뀐 값이 저장되게 된다.
>이러한 문제를 해결하기 위해 JdbcTemplate에서는 이름을 지정해 파라미터를 입력받을 수 있는 기능을 제공한다.
>또한 입력 받을 때 각각의 파라미터를 쉽게 지정할 수 있는 편리한 메서드도 제공한다.

이름 지정 바인딩에서 자주 사용하는 파라미터를 살펴보자
- NamedParameterJdbcTemplate
- Map
- SqlParameterSource
  - MapSqlParameterSource
  - BeanPropertySqlParameterSource
- BeanPropertyRowMapper
## 1. NamedParameterJdbcTemplate

**NamedParameterJdbcTemplate**
```java
    private final NamedParameterJdbcTemplate template;

    public JdbcTemplateItemRepositoryV2(DataSource dataSource){
        this.template = new NamedParameterJdbcTemplate(dataSource);
    }
```
- JdbcTemplate은 이런 문제를 보완하기 위해 `NamedParameterJdbcTemplate` 라는 이름을 지정해서 파라미터를 바인딩 하는 기능을 제공한다.

**save**
```java
    @Override
    public Item save(Item item) {
        String sql = "insert into item(item_name, price, quantity) "+
                     "values (:itemName,:price,:quantity)";

        BeanPropertySqlParameterSource param = new BeanPropertySqlParameterSource(item);
        KeyHolder keyHolder = new GeneratedKeyHolder();
        template.update(sql, param, keyHolder);

        Long key = keyHolder.getKey().longValue();
        item.setId(key);
        return item;
    }
```
- BeanPropertySqlParameterSource : 자바빈 프로퍼티 규약을 통해서 자동으로 파라미터 객체를 생성한다.
- 예를 들어서 `getItemName()` , `getPrice()` 가 있으면 다음과 같은 데이터를 자동으로 만들어낸다.
  - `key=itemName, value=상품명 값`
  - `key=price, value=가격 값`

**update**
```java
    @Override
    public void update(Long itemId, ItemUpdateDto updateParam) {
        String sql = "update item " +
                "set item_name=:itemName, price=:price, quantity=:quantity " +
                "where id=:id";

        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("itemName",updateParam.getItemName())
                .addValue("price", updateParam.getPrice())
                .addValue("quantity",updateParam.getQuantity())
                .addValue("id", itemId);

        template.update(sql, param);
    }
```
- SqlParameterSource : SQL 타입을 지정할 수 있는 등 SQL에 좀 더 특화된 기능을 제공
- MapSqlParameterSource : Map 과 유사하고 메서드 체인을 통해 편리한 사용법도 제공
  - SqlParameterSource 인터페이스의 구현체 

**findById**
```java
    @Override
    public Optional<Item> findById(Long id) {
        String sql = "select id, item_name, price, quantity from item where id=:id";

        try {
            Map<String, Object>param = Map.of("id", id);
            Item item = template.queryForObject(sql, param, itemRowMapper());
            return Optional.of(item);
        }catch (EmptyResultDataAccessException e){
            return Optional.empty();
        }
    }
```
- 단순히 Map을 사용

**itemRowMapper**
```java
    private RowMapper<Item> itemRowMapper() {
        return BeanPropertyRowMapper.newInstance(Item.class); //camel 변환 지원
    }
```
- `BeanPropertyRowMapper` 는 `ResultSet` 의 결과를 받아서 자바빈 규약에 맞추어 데이터를 변환한다.
- 예를 들어서 데이터베이스에서 조회한 결과가 `select id, price` 라고 하면 다음과 같은 코드를 작성해준다. (실제로는 리플렉션 같은 기능을 사용한다.)
```java
Item item = new Item();
item.setId(rs.getLong("id"));
item.setPrice(rs.getInt("price"));
```
- 데이터베이스에서 조회한 결과 이름을 기반으로 `setId()` , `setPrice()` 처럼 자바빈 프로퍼티 규약에 맞춘 메서드 를 호출하는 것이다.

**findAll**
```java
@Override
    public List<Item> findAll(ItemSearchCond cond) {
        Integer maxPrice = cond.getMaxPrice();
        String itemName = cond.getItemName();
        SqlParameterSource param = new BeanPropertySqlParameterSource(cond);
        String sql = "select id, item_name, price, quantity from item"; //동적 쿼리
        if (StringUtils.hasText(itemName) || maxPrice != null) {
            sql += " where";
        }
        boolean andFlag = false;
        if (StringUtils.hasText(itemName)) {
            sql += " item_name like concat('%',:itemName,'%')";
            andFlag = true;
        }
        if (maxPrice != null) {
            if (andFlag) {
                sql += " and";
            }
            sql += " price <= :maxPrice";
        }
        log.info("sql={}", sql);
        return template.query(sql, param, itemRowMapper());
    }
```
## 2. SimpleJdbcInsert
>impleJdbcInsert는 Spring에서 제공하는 간단한 데이터 삽입을 위한 JDBC 추상화 클래스이다.
>이 클래스는 SQL INSERT문을 작성할 필요 없이, 테이블 이름과 컬럼-값 쌍을 전달하는 것만으로도 데이터를 삽입할 수 있게 해준다.
>복잡한 SQL을 작성할 필요가 없으므로 코드가 간결해지고, 특히 CRUD가 반복되는 경우 유용하다.

자동으로 INSERT SQL 생성: 테이블 이름과 컬럼-값만 설정하면 SimpleJdbcInsert가 자동으로 INSERT SQL을 생성하여 실행한다. 
수동으로 쿼리를 작성하지 않아도 되므로 코드가 간결해진다.

**의존관계 주입**
```java
  private final NamedParameterJdbcTemplate template;
  private final SimpleJdbcInsert jdbcInsert;
  public JdbcTemplateItemRepositoryV3(DataSource dataSource) {
      this.template = new NamedParameterJdbcTemplate(dataSource);
      this.jdbcInsert = new SimpleJdbcInsert(dataSource)
            .withTableName("item")
            .usingGeneratedKeyColumns("id");
            .usingColumns("item_name", "price", "quantity"); //생략 가능
}
```
- `withTableName` : 데이터를 저장할 테이블 명을 지정한다.
- `usingGeneratedKeyColumns` : `key` 를 생성하는 PK 컬럼 명을 지정한다.
- `usingColumns` : INSERT SQL에 사용할 컬럼을 지정한다. 특정 값만 저장하고 싶을 때 사용한다. 생략할 수 있다.

**save**
```java
@Override
public Item save(Item item) {
    SqlParameterSource param = new BeanPropertySqlParameterSource(item);
    Number key = jdbcInsert.executeAndReturnKey(param);
    item.setId(key.longValue());
        return item;
    }
```
- 자동 키 지원: 자동 생성 키 컬럼을 쉽게 처리
- insert 쿼리를 작성할 때만 도움이 된다. 
