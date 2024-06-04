## API 개발 고급 - 컬렉션 조회 최적화

**주문 조회 V1: 엔티티를 직접 노출**
```java
    @GetMapping("/api/v1/orders")
    public List<Order> ordersV1() {
        List<Order> all = orderRepository.findAllByString(new OrderSearch());
        for (Order order : all) {
            order.getMember().getName();
            order.getDelivery().getAddress();

            List<OrderItem> orderItems = order.getOrderItems();
            orderItems.stream().forEach(o->o.getItem().getName());
        }
        return all;
    }
```
- orderItems, item 관계를 직접 초기화 하면 Hibernate5Module 설정에 의해 Json으로 생성
- 양방향 연관관계면 무한 루프에 걸리지 않게 한곳에 `@JsonIgnore` 를 추가
- 엔티티를 직접 노출하므로 좋은 방법은 아니다.


**주문 조회 V2: 엔티티를 DTO로 반환**
```java
    @GetMapping("/api/v2/orders")
    public List<OrderDto> ordersV2() {
        List<Order> orders = orderRepository.findAllByString(new OrderSearch());
        List<OrderDto> collect = orders.stream()
                .map(o-> new OrderDto(o))
                .collect(Collectors.toList());
        return collect;
    }
```
**OrderApiController - Dto 추가**
```java
    @Data
    static class OrderDto {
        private Long orderId;
        private String name;
        private LocalDateTime orderDate;
        private OrderStatus orderStatus;
        private Address address;
        private List<OrderItemDto> orderItems;

        public OrderDto(Order order) {
            orderId = order.getId();
            name = order.getMember().getName();
            orderDate = order.getOrderDate();
            orderStatus = order.getStatus();
            address = order.getDelivery().getAddress();
            orderItems = order.getOrderItems().stream()
                    .map(orderItem -> new OrderItemDto(orderItem))
                    .collect(Collectors.toList());
        }
    }
    @Data
    static class OrderItemDto{
        private String itemName;
        private int orderPrice;
        private int count;

        public OrderItemDto(OrderItem orderItems) {
            itemName = orderItems.getItem().getName();
            orderPrice = orderItems.getItem().getPrice();
            count = orderItems.getCount();
        }
    }
```
- 엔티티를 직접 노출하지 않고 Dto로 데이터 반환
- 하지만 지연로딩으로 SQL이 너무 많이 실행
- SQL 실행 수
	- `order` 1번
	- `member` , `address` N번(order 조회 수 만큼)
	- `orderItem` N번(order 조회 수 만큼)
	- `item` N번(orderItem 조회 수 만큼)

**주문 조회 V3: 엔티티를 DTO로 반환 - 페치 조인 최적화**
```java
    @GetMapping("/api/v3/orders")
    public List<OrderDto> ordersV3() {
        List<Order> orders = orderRepository.findAllWithTeam();
        List<OrderDto> result = orders.stream()
                .map(o-> new OrderDto(o))
                .collect(Collectors.toList());
        return result;
    }
```
**OrderRepository - 추가**
```java
    public List<Order> findAllWithTeam() {
        return em.createQuery(
                "select distinct o from Order o"+
                        " join fetch o.member m"+
                        " join fetch o.delivery d" +
                        " join fetch o.orderItems oi"+
                        " join fetch oi.item i", Order.class)
                .getResultList();
    }
```

- 페치 조인으로 SQL이 1번만 실행됨
- distinct 1대다 조인이 있기 때문에 데이터베이스 row가 증가한다
	- 결과적으로 order 엔티티가 증가하게 된다 
		- JPA의 distinct는 SQL에 distinct를 추가하고, 더해서 같은 엔티티가 조회되면, 애 플리케이션에서 중복을 걸러준다. (중복 조회 X)
- **단점**
	- 페이징 불가능

> 참고: 컬렉션 페치 조인을 사용하면 페이징이 불가능하다. 하이버네이트는 경고 로그를 남기면서 모든 데이터를 DB에서 읽어오고, 메모리에서 페이징 해버린다(매우 위험하다).

> 참고: 컬렉션 페치 조인은 1개만 사용할 수 있다. 컬렉션 둘 이상에 페치 조인을 사용하면 안된다. 데이터가 부정 합하게 조회될 수 있다. 

