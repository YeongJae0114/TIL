## 주문 도메인 개발
### 주문 검색 기능 개발

JPA에서 **동적 쿼리**를 어떻게 해결

**OrderSearch(검색 조건 파라미터)**
```java
@Getter @Setter
public class OrderSearch {
    private String memberName;
    private OrderStatus orderStatus;
}
```

**OrderRepository**
```java

@Repository
@RequiredArgsConstructor
public class OrderRepository {
    private final EntityManager em;

    public void save(Order order){
        em.persist(order);
    }

    public Order findOne(Long id){
        return em.find(Order.class, id);
    }

    public List<Order>findAll(OrderSearch orderSearch){
        return em.createQuery("select o from Order o join o.member m"+" where o.status = :status " +
                " and m.name like :name", Order.class)
                .setParameter("status", orderSearch.getOrderStatus())
                .setParameter("name", orderSearch.getMemberName())
                .setMaxResults(1000) // 최대 1000건
                .getResultList();
    }
}
```