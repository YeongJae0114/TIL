## 엔티티 클래스 개발

**회원 엔티티**
```java
@Entity
@Getter @Setter
public class Member {
    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    private String name;

    @Embedded
    private Address address;

    @OneToMany(mappedBy="member")
    private List<Order> orders = new ArrayList<>();
}
```
- @Entity : JPA 엔티티, 데이터베이스와 테이블 매핑
- @Id : 기본키(PK)를 지정
- @GeneratedValue : 식별자 값을 자동 생성
- @Column(name = "member_id")
	- DB 테이블에서 이 필드가 member_id 컬럼과 매핑
- @Embedded : 타입을 멤버 엔티티의 일부로 포함 
	- 멤버 테이블에 Address 객체 필드가 저장 
- @OneToMany(mappedBy="member")
	- 멤버는 여러 주문을 가질 수 있다. 일대다 관계
	- `mappedBy` 속성 : 속성은 양방향 관계에서 연관된 엔티티의 필드 이름을 지정
		- Order 엔티티의 member 필드를 사용하여 양방향 관계를 매핑한다는 것을 의미

**주문 엔티티**
```java
@Entity
@Table(name = "orders")
@Getter @Setter
public class Order {
    @Id @GeneratedValue
    @Column(name = "order_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL) // order
    private List<OrderItem> orderItems = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    //==연관관계 메서드 ==//
    public void setMember(Member member) {
        this.member = member;
        member.getOrders().add(this);
    }
    public void addOrderItem(OrderItem orderItem){
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }
    public void setDelivery(Delivery delivery){
        this.delivery = delivery;
        delivery.setOrder(this);
    }
}
```
- @Table(name = "orders") : 해당 엔티티가 "orders"라는 이름의 DB 테이블과 매핑
- @Column(name = "order_id") : 이 필드가 "order_id" 컬럼과 매핑
- @ManyToOne(fetch = FetchType.LAZY)
	- `@ManyToOne` : 주문은 여러 멤버에 속할 수 있다. : 다대일 관계
	- `fetch = FetchType.LAZY` : 지연 로딩을 사용하여 연관된 멤버를 필요할 때까지 로딩하지 않음을 지정 -> `지정하지 않으면 n+1 문제가 발생`
- @JoinColumn(name = "member_id") : 
	- `@JoinColumn` : 어노테이션을 사용하여 외래 키를 지정
	- `name` 속성은 외래 키가 가리키는 대상 테이블의 컬럼 이름을 지정
- @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
	- 주문은 여러 주문 상품을 갖을 수 있다. : 일대다 관계
	- `mappedBy = "order"` : "order"라는 필드는 OrderItem 엔티티에 있으며, 주문(Order) 엔티티를 참조

- @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	- `@OneToOne` : 주문은 하나의 배송 정보를 가질 수 있다. : 일대일 관계
	- `cascade = CascadeType.ALL` 
		- cascade : 연관된 엔티티 간의 영속성 전이(persistence cascade)를 설정
		- CascadeType.ALL 속성은 모든 상태 변경이 자식 엔티티에게 전파되도록 설정

- @Enumerated(EnumType.STRING)
	- `@Enumerated` : JPA에서 열거형(Enum) 타입을 데이터베이스에 매핑할 때 사용	- `EnumType.STRING` : 그 자체로 문자열로 저장


- **연관관계 메서드**
	- mappedBy를 통해 연관관계의 주인을 지정해 양방향이라는 것을 표현.
	- 이때 연관관계의 주인에게 관계를 설정해야한다. 양쪽으로 모두 관계 설정
		- 이 두 과정을 하나에 메서드로 하나의 것처럼 사용하는 구조이다.

**주문 상태**
```java
public enum OrderStatus {
    ORDER, CANCEL
}
```

**주문 상품 엔티티**
```java
@Entity
@Getter @Setter
@Table(name = "order_item")
public class OrderItem {
    @Id @GeneratedValue
    @Column(name = "order_item_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oredr_id")
    private Order order;

    private int orderPrice;
    private int count;
}
```
- @JoinColumn(name = "item_id") : 
	- `@JoinColumn` : 어노테이션을 사용하여 외래 키를 지정
	- `name` 속성은 외래 키가 가리키는 대상 테이블의 컬럼 이름을 지정
- @ManyToOne(fetch = FetchType.LAZY)
	- `@ManyToOne` : 주문은 여러 멤버에 속할 수 있다. : 다대일 관계
	- `fetch = FetchType.LAZY` : 지연 로딩을 사용하여 연관된 멤버를 필요할 때까지 로딩


**상품 엔티티**
```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype")
@Getter @Setter
public abstract class Item {
    @Id @GeneratedValue
    @Column(name = "item_id")
    private Long id;

    private String name;
    private int price;
    private int stockQuantity;

    @ManyToMany(mappedBy = "items")
    private List<Category>categories = new ArrayList<Category>();
}
```
- @ManyToMany(mappedBy = "items")
	- `@ManyToMany` : 다대다 연습을 위한 카테고리와 상품의 관계 : 다대다
	- `mappedBy = "items"` : "items"는 Category 엔티티에 있는 필드로, 이 필드는 현재 엔티티를 참조
		- mappedBy 사용하여 연관관계의 주인을 지정


**상품 - 도서 엔티티**
```java
@Entity
@Getter
@Setter
@DiscriminatorValue("B")
public class Book extends Item{
    private String author;
    private String isbn;
}
```

**상품 - 음반 엔티티**
```java
@Entity
@DiscriminatorValue("A")
@Getter
@Setter
public class Album extends Item{
    private String artist;
    private String etc;
}
```


**상품 - 영화 엔티티**
```java
@Entity
@Getter @Setter
@DiscriminatorValue("M")
public class Movie extends Item{
    private String director;
    private String  actor;
}
```

**배송 엔티티**
```java
@Entity
@Getter @Setter
public class Delivery {
    @Id @GeneratedValue
    @Column(name = "delivery_id")
    private Long id;

    @OneToOne(mappedBy = "delivery", fetch = FetchType.LAZY)
    private Order order;

    @Embedded
    private Address address;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;
}
```
- @Embedded
	- Address 클래스를 내장(embedded)하고 있음을 나타낸다.
- @OneToMany(mappedBy="member")
- @Enumerated(EnumType.STRING)
	- DeliveryStatus 열거형(Enum)을 문자열 형태로 데이터베이스에 매핑

**배송 상태**
```java
public enum DeliveryStatus {
     READY, COMP
}
```

**카테고리 엔티티**
```java
@Entity
@Getter @Setter
public class Category {
    @Id @GeneratedValue
    @Column(name = "category_id")
    private Long id;
    private String name;

    @ManyToMany
    @JoinTable(name = "category_item",
        joinColumns = @JoinColumn(name = "category_id"),
        inverseJoinColumns = @JoinColumn(name = "item_id"))
    private List<Item>items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent")
    private List<Category>child  = new ArrayList<>();

    // ==연관관계 메서드== //
    public void addChildCategory(Category child){
        this.child.add(child);
        child.setParent(this);
    }
}
```
- @ManyToMany : 다대일 관계를 나타내며, 현재 엔티티(Category)가 부모 카테고리를 참조
- `@JoinTable(name = "category_item"` : category_item이라는 이름의 중간 테이블 생성
        - `joinColumns = @JoinColumn(name = "category_id")` : 현재 엔티티(Category)를 참조하는 외래 키를 지정
        - `inverseJoinColumns = @JoinColumn(name = "item_id"))` : 상대 엔티티(Item)를 참조하는 외래 키를 지정
- 연관관계 메서드

**주소 값 타입**
```java
@Embeddable
@Getter
public class Address {
    private String city;
    private String street;
    private String zipcode;

    protected Address(){}

    public Address(String city, String street, String zipcode){
        this.city = city;
        this.street = street;
        this.zipcode = zipcode;
    }
}
```