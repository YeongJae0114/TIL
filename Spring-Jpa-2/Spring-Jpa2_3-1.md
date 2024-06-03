## API 개발 고급 - 지연 로딩과 조회 성능 최적화

**간단한 주문 조회 V1: 엔티티를 직접 노출**
```java
@RestController
@RequiredArgsConstructor
public class OrderSimpleApiController {
    private final OrderRepository orderRepository;

/**
* V1. 엔티티 직접 노출
* - Hibernate5Module 모듈 등록, LAZY=null 처리 * - 양방향 관계 문제 발생 -> @JsonIgnore
*/

    @GetMapping("/api/v1/simple-orders")
    public List<Order> simpleOrders() {
        List<Order> all= orderRepository.findAllByString(new OrderSearch());
        for (Order order : all) {
            order.getMember().getName(); //Lazy 강제 초기화
            order.getDelivery().getAddress(); //Lazy 강제 초기화
        }
        return all;
    }
}
```
- `List<Order> all = orderRepository.findAllByString(new OrderSearch());` 를 사용해서 엔티티를 직접 가져와 return  (엔티티를 직접 노출)
- `order` `member` 와 `order` `delivery` 는지연로딩 이기 때문에
	- 엔티티가 아니라 프록시로 존재한다.
- 프록시 객체기 때문에 json 으로 어떻게 생성해야 하는지 모른다 -> 예외 발생
- Hibernate5Module` 을 스프링 빈으로 등록하면 해결	

**간단한 주문 조회 V2: 엔티티를 DTO로 반환**
```java
    @GetMapping("/api/v2/simple-orders")
    public List<SimpleOrderDto> ordersV2() {
        List<Order> orders= orderRepository.findAllByString(new OrderSearch());
        List<SimpleOrderDto> result =orders.stream()
                .map(o-> new SimpleOrderDto(o))
                .collect(Collectors.toList());
        return result;
    }
    @Data
    static class SimpleOrderDto {
        private Long orderId;
        private String name;
        private LocalDateTime orderDate;
        private OrderStatus orderStatus;
        private Address address;
        public SimpleOrderDto(Order order){
            orderId = order.getId();
            name = order.getMember().getName();
            orderDate = order.getOrderDate();
            orderStatus = order.getStatus();
            address = order.getDelivery().getAddress();
        }
    }
```
- 엔티티를 DTO로 변환하는 일반적인 방법이다.
- 쿼리가 총 1 + N + N번 실행된다. (v1과 쿼리수 결과는 같다.)
- `order` 조회 1번(order 조회 결과 수가 N이 된다.) `order -> member` 지연 로딩 조회 N 번
- `order -> delivery` 지연 로딩 조회 N 번
- 예) order의 결과가 4개면 최악의 경우 1 + 4 + 4번 실행된다.(최악의 경우) 
	- 지연로딩은 영속성 컨텍스트에서 조회하므로, 이미 조회된 경우 쿼리를 생략한다.

**간단한 주문 조회 V3: 엔티티를 DTO로 반환 - 페치 조인 최적화**
```java
    @GetMapping("/api/v3/simple-orders")
    public List<SimpleOrderDto> ordersV3() {
        List<Order> orders= orderRepository.findAllWithMemberDelivery();
        List<SimpleOrderDto> result = orders.stream().map(o -> new SimpleOrderDto(o))
                .collect(Collectors.toList());
        return result;
    }
```
- 엔티티를 페치 조인(fetch join)을 사용해서 쿼리 1번에 조회
- 페치 조인으로 `order -> member` , `order -> delivery` 는 이미 조회 된 상태 이므로 지연로딩X

**OrderRepository - 추가**
```java
public List<Order> findAllWithMemberDelivery() {
        return em.createQuery(
                "select o from Order o"+
                        " join fetch o.member m"+
                        " join fetch o.delivery d", Order.class
        ).getResultList();
    }
```

**결과**
```text
select
        o1_0.order_id,
        d1_0.delivery_id,
        d1_0.city,
        d1_0.street,
        d1_0.zipcode,
        d1_0.status,
        m1_0.member_id,
        m1_0.city,
        m1_0.street,
        m1_0.zipcode,
        m1_0.name,
        o1_0.order_date,
        o1_0.status 
    from
        orders o1_0 
    join
        member m1_0 
            on m1_0.member_id=o1_0.member_id 
    join
        delivery d1_0 
            on d1_0.delivery_id=o1_0.delivery_id
```
- **쿼리가 1번으로 줄었다 -> 성능 최적화 성공**

**간단한 주문 조회 V4: JPA에서 DTO로 바로 조회**
```java
    @GetMapping("/api/v4/simple-orders")
    public List<OrderSimpleQueryDto> ordersV4() {
        return orderRepository.findOrderDtos();
    }
```


**OrderSimpleQueryDto**
```java
@Data
public class OrderSimpleQueryDto {
    private Long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;
    
    public OrderSimpleQueryDto(Long orderId, String name, LocalDateTime orderDate, OrderStatus orderStatus, Address address){
        this.orderId = orderId;
        this.name = name;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.address = address;
    }
}
```

**OrderRepository**
```java
    public List<OrderSimpleQueryDto>findOrderDtos(){
        return em.createQuery(
                "select new jpabook.jpashop.repository.OrderSimpleQueryDto(o.id,m.name, o.orderDate, o.status, d.address)"+
                "from Order o"+
                " join o.member m" +
                " join o.delivery d", OrderSimpleQueryDto.class)
                .getResultList();
    }
```
- 일반적인 SQL을 사용할 때 처럼 원하는 값을 선택해서 조회
- `new` 명령어를 사용해서 JPQL의 결과를 DTO로 즉시 변환
- SELECT 절에서 원하는 데이터를 직접 선택하므로 DB 애플리케이션 네트웍 용량 최적화(생각보다 미비) 
- 리포지토리 재사용성 떨어짐, API 스펙에 맞춘 코드가 리포지토리에 들어가는 단점

### 정리
엔티티를 DTO로 변환하거나, DTO로 바로 조회하는 두가지 방법은 각각 장단점이 있다. 둘중 상황에 따라서 더 나은 방법을 선택하면 된다. 엔티티로 조회하면 리포지토리 재사용성도 좋고, 개발도 단순해진다. 따라서 권장하는 방법은 다음과 같다.

**쿼리 방식 선택 권장 순서**
1. 우선 엔티티를 DTO로 변환하는 방법을 선택한다.
2. 필요하면 페치 조인으로 성능을 최적화 한다. 대부분의 성능 이슈가 해결된다.
3. 그래도 안되면 DTO로 직접 조회하는 방법을 사용한다.
4. 최후의 방법은 JPA가 제공하는 네이티브 SQL이나 스프링 JDBC Template을 사용해서 SQL을 직접 사용한다.
