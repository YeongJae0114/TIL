## JDBC의 동적 쿼리


검색 조건이 없음
```sql
select id, item_name, price, quantity from item
```
상품명( `itemName` )으로 검색 
```sql
 select id, item_name, price, quantity from item
  where item_name like concat('%',?,'%')
```
최대 가격( `maxPrice` )으로 검색 
```sql
 select id, item_name, price, quantity from item
  where price <= ?
```
상품명( `itemName` ), 최대 가격( `maxPrice` ) 둘다 검색 
```sql
 select id, item_name, price, quantity from item
  where item_name like concat('%',?,'%')
and price <= ?

