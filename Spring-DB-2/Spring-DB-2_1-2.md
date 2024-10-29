## JDBC의 동적 쿼리
>JDBC의 동적 쿼리는 조건에 따른 문자열 연결로 코드가 복잡해지고, SQL Injection의 위험성이 있으며, 유지보수가 어렵다는 단점이 있다. 또한, 매번 쿼리를 새로 생성하기 때문에 성능이 저하될 수 있고, 재사용이 어려워 코드 중복이 발생할 가능성이 크다. 이를 해결하기 위해 JPA나 MyBatis 같은 ORM 도구가 사용된다.

아래 코드는 JDBC 동적 쿼리를 문자열 연결로 동적 SQL을 짠 코드이다.

**검색 조건이 없음**
```sql
select id, item_name, price, quantity
from item
```

**상품명( `itemName` )으로 검색**
```sql
select id, item_name, price, quantity
from item
where item_name like concat('%',?,'%')
```

**최대 가격( `maxPrice` )으로 검색**
```sql
select id, item_name, price, quantity
from item
where price <= ?
```

**상품명( `itemName` ), 최대 가격( `maxPrice` ) 둘다 검색**
```sql
select id, item_name, price, quantity
from item
where item_name like concat('%',?,'%') and price <= ?
```


>**결론** : JDBC는 Java 애플리케이션에서 데이터베이스와 직접 통신하기 위한 표준 API로, SQL을 통해 데이터 조작을 세밀하게 제어할 수 있다. 실무에서는 JdbcTemplate이나 MyBatis 같은 프레임워크가 JDBC의 반복 작업을 줄여주고, ORM 도구인 JPA로 유지보수성과 개발 효율을 높여 주로 사용된다. JDBC는 SQL 제어가 필요한 경우와 단순한 DB 연동에 유용하지만, 복잡한 쿼리나 대규모 프로젝트에서는 ORM을 통해 더 높은 생산성을 얻는 것이 일반적이다.

-> 참고로 이후에 설명할 MyBatis의 가장 큰 장점은 SQL을 직접 사용할 때 동적 쿼리를 쉽게 작성할 수 있다는 점이다.
