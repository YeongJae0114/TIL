# 데이터 접근 기술 - 테스트
## 데이터 베이스 롤백
>DB에 데이터를 저장하고 조회하는 테스트 코드를 작성 한다 이때 여러가지 외부 조건에 의해서 테스트 코드의 결과가 다르게 나오는데 이런 문제를 해결하려면 테스트를 다른 환경과 철저하게 분리해야 한다.

- 가장 간단한 방법은 테스트 전용 데이터베이스를 별도로 운영하는 것이다.
  - H2 데이터베이스를 용도에 따라 2가지로 구분하면 된다.
    - `jdbc:h2:tcp://localhost/~/test` local에서 접근하는 서버 전용 데이터베이스
    - `jdbc:h2:tcp://localhost/~/testcase` test 케이스에서 사용하는 전용 데이터베이스

데이터베이스를 분리했지만 테스트 도중에 남긴 데이터가 다른 테스트 진행 중 오류를 발생 시킬수 있다.

테스트에서 매우 중요한 원칙은 다음과 같다. 
- **테스트는 다른 테스트와 격리해야 한다.**
- **테스트는 반복해서 실행할 수 있어야 한다.**

이런 문제를 해결하기 위해서 데이터 롤백을 사용한다.

### 테스트 - 데이터 롤백 
**트랜잭션과 롤백 전략**
- 테스트가 끝나고 나서 트랜잭션을 강제로 롤백해버리면 데이터가 깔끔하게 제거된다.
- 테스트를 하면서 데이터를 이미 저장했는데, 중간에 테스트가 실패해서 롤백을 호출하지 못해도 괜찮다.
  - 트랜잭션을 커밋하지 않았기 때문에 데이터베이스에 해당 데이터가 반영되지 않는다.
- 동작 순서
```text
1. 트랜잭션 시작
2. 테스트 A 실행
3. 트랜잭션 롤백

4. 트랜잭션 시작
5. 테스트 B 실행
6. 트랜잭션 롤백
```

테스트는 각각의 테스트 실행 전 후로 동작하는 `@BeforeEach` , `@AfterEach` 를 사용해 롤백을 적용 시킬 수 있다.

```java
package hello.itemservice.domain;

import hello.itemservice.repository.ItemRepository;
import hello.itemservice.repository.ItemSearchCond;
import hello.itemservice.repository.ItemUpdateDto;
import hello.itemservice.repository.memory.MemoryItemRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ItemRepositoryTest {

    @Autowired
    ItemRepository itemRepository;


    @Autowired
    PlatformTransactionManager transactionManager;
    TransactionStatus status;

    @BeforeEach
    void before(){
        // 트랜잭셔 시작
        status = transactionManager.getTransaction(new DefaultTransactionDefinition());
    }

    @AfterEach
    void afterEach() {
        //MemoryItemRepository 의 경우 제한적으로 사용
        if (itemRepository instanceof MemoryItemRepository) {
            ((MemoryItemRepository) itemRepository).clearStore();
        }

        transactionManager.rollback(status);
    }

    @Test
    void save() {
        //given
        Item item = new Item("itemA", 10000, 10);

        //when
        Item savedItem = itemRepository.save(item);

        //then
        Item findItem = itemRepository.findById(item.getId()).get();
        assertThat(findItem).isEqualTo(savedItem);
    }

    @Test
    void updateItem() {
        //given
        Item item = new Item("item1", 10000, 10);
        Item savedItem = itemRepository.save(item);
        Long itemId = savedItem.getId();

        //when
        ItemUpdateDto updateParam = new ItemUpdateDto("item2", 20000, 30);
        itemRepository.update(itemId, updateParam);

        //then
        Item findItem = itemRepository.findById(itemId).get();
        assertThat(findItem.getItemName()).isEqualTo(updateParam.getItemName());
        assertThat(findItem.getPrice()).isEqualTo(updateParam.getPrice());
        assertThat(findItem.getQuantity()).isEqualTo(updateParam.getQuantity());
    }

    @Test
    void findItems() {
        //given
        Item item1 = new Item("itemA-1", 10000, 10);
        Item item2 = new Item("itemA-2", 20000, 20);
        Item item3 = new Item("itemB-1", 30000, 30);

        itemRepository.save(item1);
        itemRepository.save(item2);
        itemRepository.save(item3);

        //둘 다 없음 검증
        test(null, null, item1, item2, item3);
        test("", null, item1, item2, item3);

        //itemName 검증
        test("itemA", null, item1, item2);
        test("temA", null, item1, item2);
        test("itemB", null, item3);

        //maxPrice 검증
        test(null, 10000, item1);

        //둘 다 있음 검증
        test("itemA", 10000, item1);
    }

    void test(String itemName, Integer maxPrice, Item... items) {
        List<Item> result = itemRepository.findAll(new ItemSearchCond(itemName, maxPrice));
        assertThat(result).containsExactly(items);
    }
}
```
- 트랜잭션 관리자는 `PlatformTransactionManager` 를 주입 받아서 사용하면 된다
- `@BeforeEach` : 각각의 테스트 케이스를 실행하기 직전에 호출된다.
- `@AfterEach` : 각각의 테스트 케이스가 완료된 직후에 호출된다.

`이제 이 테스트를 반복적으로 실행 시켜도 테스트가 성공한다!`😀
