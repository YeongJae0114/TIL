# MyBatis - 데이터 접근 기술
## MyBatis 소개
>MyBatis는 앞서 설명한 JdbcTemplate보다 더 많은 기능을 제공하는 SQL Mapper 이다. 기본적으로 JdbcTemplate이 제공하는 대부분의 기능을 제공한다. 
JdbcTemplate과 비교해서 MyBatis의 가장 매력적인 점은 SQL을 XML에 편리하게 작성할 수 있고 또 동적 쿼리를 매우 편리하게 작성할 수 있다는 점이다.

### SQL 편리하게 작성
**JdbcTemplate - SQL 여러줄**
```java
 String sql = "update item " +
         "set item_name=:itemName, price=:price, quantity=:quantity " +
         "where id=:id";
```
- 문자 더하기에 대한 불편함이 있다. 공백에 유의하면며 `+` 사용해야함.

**MyBatis - SQL 여러줄** 
```xml
 <update id="update">
     update item
     set item_name=#{itemName},
         price=#{price},
         quantity=#{quantity}
     where id = #{id}
</update>
```
- MyBatis는 XML에 작성하기 때문에 라인이 길어져도 문자 더하기에 대한 불편함이 없다.

### 동적 쿼리를 편리하게 작성
**MyBatis - 동적 쿼리** 
```xml
 <select id="findAll" resultType="Item">
     select id, item_name, price, quantity
     from item
     <where>
         <if test="itemName != null and itemName != ''">
             and item_name like concat('%',#{itemName},'%')
         </if>
         <if test="maxPrice != null">
             and price &lt;= #{maxPrice}
         </if>
     </where>
 </select>
```

**설정의 장단점**
- JdbcTemplate은 스프링에 내장된 기능이고, 별도의 설정없이 사용할 수 있다는 장점이 있다.
- 반면에 MyBatis는 약 간의 설정이 필요하다.
