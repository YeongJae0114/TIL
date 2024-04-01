## 상품 도메인 개발

### 상품 엔티티 개발
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
	
	//추가
    //==비즈니스 로직== //
    /**
     * stoke 증가
     */
    public void addStoke(int quantity){
        this.stockQuantity += quantity;
    }
    /**
     * stoke 감소
     */
    public void removeStoke(int quantity){
        int restStoke = this.stockQuantity - quantity;
        if (restStoke < 0){
            throw new NotEnoughStokeException("need more stoke");
        }
        this.stockQuantity = restStoke;
    }
}
```
**비즈니스 로직 분석**
- `addStock()` 메서드는 파라미터로 넘어온 수만큼 재고를 늘린다. 이 메서드는 재고가 증가하거나 상품 주문을 취소해서 재고를 다시 늘려야 할 때 사용한다.

- `removeStock()` 메서드는 파라미터로 넘어온 수만큼 재고를 줄인다. 만약 재고가 부족하면 예외가 발생한다. 주로 상품을 주문할 때 사용한다.


### 상품 리포지토리 개발
```java
@Repository
@RequiredArgsConstructor
public class ItemRepository {
    private final EntityManager em;
    public void save(Item item){
        if(item.getId()==null){
            em.persist(item);
        }else {
            em.merge(item);
        }
    }
    public Item findOne(Long id){
        return em.find(Item.class, id);
    }
    public List<Item> findAll(){
        return em.createQuery("select i from Item i", Item.class)
                .getResultList();
    }
}
```
**기능 설명** 
- `save()`
	- `id` 가 없으면 신규로 보고 `persist()` 실행
	- `id` 가 있으면 이미 데이터베이스에 저장된 엔티티를 수정한다고 보고, `merge()` 를 실행


### 상품 서비스 개발
```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;

    @Transactional
    public void saveItem(Item item){
        itemRepository.save(item);
    }

    public List<Item>findItems(){
        return itemRepository.findAll();
    }
    public Item findOne(Long itemId){
        return itemRepository.findOne(itemId);
    }
}
```