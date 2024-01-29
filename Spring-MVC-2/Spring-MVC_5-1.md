## Bean Validation - 시작

**Item - Bean Validation 애노테이션 적용**
```java
package hello.itemservice.domain.item;

import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class Item {
    private Long id;

    @NotBlank
    private String itemName;

    @NotNull
    @Range(min = 1000, max = 1000000)
    private Integer price;

    @NotNull
    @Max(9999)
    private Integer quantity;

    public Item() {
    }

    public Item(String itemName, Integer price, Integer quantity) {
        this.itemName = itemName;
        this.price = price;
        this.quantity = quantity;
    }
}
```
**검증 애노테이션**
- `@NotBlank` : 빈값 + 공백만 있는 경우를 허용하지 않는다.
- `@NotNull` : `null` 을 허용하지 않는다.
- `@Range(min = 1000, max = 1000000)` : 범위 안의 값이어야 한다.
- `@Max(9999)` : 최대 9999까지만 허용한다.


**BeanValidationTest - Bean Validation 테스트 코드 작성**
```java
package hello.itemservice.validation;

import hello.itemservice.domain.item.Item;
import org.junit.jupiter.api.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Set;

public class BeanValidationTest {
    @Test
    void beanValidation(){
		//검증기 생성
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();

        Item item = new Item();
        item.setItemName(" "); //공백
        item.setPrice(0);
        item.setQuantity(10000);

		//검증 실행
        Set<ConstraintViolation<Item>> violations = validator.validate(item);

        for (ConstraintViolation<Item> violation : violations) {
            System.out.println("violation=" + violation);
            System.out.println("violation.message=" + violation.getMessage());
        }
    }
}
```
**결과**
```
violation={interpolatedMessage='공백일 수 없습니다', propertyPath=itemName, rootBeanClass=class hello.itemservice.domain.item.Item, messageTemplate='{javax.validation.constraints.NotBlank.message}'} violation.message=공백일 수 없습니다
violation={interpolatedMessage='9999 이하여야 합니다', propertyPath=quantity, rootBeanClass=class hello.itemservice.domain.item.Item, messageTemplate='{javax.validation.constraints.Max.message}'} violation.message=9999 이하여야 합니다
violation={interpolatedMessage='1000에서 1000000 사이여야 합니다', propertyPath=price, rootBeanClass=class hello.itemservice.domain.item.Item, messageTemplate='{org.hibernate.validator.constraints.Range.message}'}
violation.message=1000에서 1000000 사이여야 합니다
```























