## Bean Validation의 한계

다음 요구사항을 project에 적용 시켜보자

**수정시 요구사항**
- 등록시에는 `quantity` 수량을 최대 9999까지 등록할 수 있지만 **수정시에는 수량을 무제한으로 변경**할 수 있다.
- 등록시에는 `id` 에 값이 없어도 되지만, **수정시에는 id 값이 필수**이다.

```java
package hello.itemservice.domain.item;
 @Data
public class Item {
@NotNull //수정 요구사항 추가
     private Long id;
     @NotBlank
     private String itemName;
     @NotNull
     @Range(min = 1000, max = 1000000)
     private Integer price;
@NotNull
//@Max(9999) //수정 요구사항 추가 private Integer quantity;
//...
}
```
### 문제
- **수정은 잘 동작하지만 등록에서 문제가 발생**
	- 등록시에는 `id` 에 값도 없고, `quantity` 수량 제한 최대 값인 9999도 적용되지 않는 문제
- item` 은 등록과 수정에서 검증 조건의 충돌이 발생

### 해결 
- BeanValidation의 groups 기능을 사용한다.
- Item을 직접 사용하지 않고, ItemSaveForm, ItemUpdateForm 같은 폼 전송을 위한 별도의 모델 객체를 만들어서 사용한다.

## Bean Validation - groups
`등록시에 검증할 기능과 수정시에 검증할 기능을 각각 그룹으로 나누어 적용`

### groups 적용

**저장용 groups 생성** 
```java
 package hello.itemservice.domain.item;
 public interface SaveCheck {
}
```
**수정용 groups 생성** 
```java
 package hello.itemservice.domain.item;
 public interface UpdateCheck {
}
```

**Item - groups 적용**
```java
package hello.itemservice.domain.item;

import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class Item {
    @NotNull(groups = UpdateCheck.class)
    private Long id;

    @NotBlank(groups = {SaveCheck.class, UpdateCheck.class})
    private String itemName;

    @NotNull(groups = {SaveCheck.class, UpdateCheck.class})
    @Range(min = 1000, max = 1000000, groups = {SaveCheck.class, UpdateCheck.class})
    private Integer price;

    @NotNull(groups = {SaveCheck.class, UpdateCheck.class})
    @Max(value = 9999, groups = SaveCheck.class)
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

**ValidationItemControllerV3 - 저장 로직에 SaveCheck Groups 적용**
```java
@PostMapping("/add")
 public String addItemV2(@Validated(SaveCheck.class) @ModelAttribute Item item,
 BindingResult bindingResult, RedirectAttributes redirectAttributes) {
//...
}
```

**ValidationItemControllerV3 - 수정 로직에 UpdateCheck Groups 적용**
```java
@PostMapping("/{itemId}/edit")
 public String editV2(@PathVariable Long itemId, @Validated(UpdateCheck.class)
 @ModelAttribute Item item, BindingResult bindingResult) {
//...
}
```

**참고**
- `@Valid` 에는 groups를 적용할 수 있는 기능이 없다. 따라서 groups를 사용하려면 `@Validated` 를 사용해야 한다.