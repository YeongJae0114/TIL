## Form 전송 객체 분리
>실무에서는 `groups` 를 잘 사용하지 않는데, 그 이유가 다른 곳에 있다. 바로 등록시 폼에서 전달하는 데이터가 `Item` 도메인 객체와 딱 맞지 않기 때문이다. 
소위 "Hello World" 예제에서는 폼에서 전달하는 데이터와 `Item` 도메인 객체가 딱 맞는다. 하지만 실무에서는 회원 등록시회원과관련된데이터만전달받는것이아니라,약관정보도추가로받는등 `Item` 과관계없는수많은부가데 이터가 넘어온다.
그래서 보통 `Item` 을 직접 전달받는 것이 아니라, 복잡한 폼의 데이터를 컨트롤러까지 전달할 별도의 객체를 만들어서 전달한다. 예를 들면 `ItemSaveForm` 이라는 폼을 전달받는 전용 객체를 만들어서 `@ModelAttribute` 로 사용한다. 이것을 통해 컨트롤러에서 폼 데이터를 전달 받고, 이후 컨트롤러에서 필요한 데이터를 사용해서 `Item` 을 생성한다.


**Form 전송 객체 분리 - 개발**
**ITEM 원복**
이제 `Item` 의 검증은 사용하지 않으므로 검증 코드를 제거해도 된다. 
```java
 @Data
 public class Item {
     private Long id;
     private String itemName;
     private Integer price;
     private Integer quantity;
}
```

**ItemSaveForm - ITEM 저장용 폼**
```java
package hello.itemservice.web.validation.form;

import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ItemSaveForm {
    @NotBlank
    private String itemName;

    @NotNull()
    @Range(min = 1000, max = 1000000)
    private Integer price;

    @NotNull()
    @Max(value = 9999)
    private Integer quantity;

}

```

**ItemUpdateForm - ITEM 수정용 폼**
```java
package hello.itemservice.web.validation.form;

import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
@Data
public class ItemUpdateForm {

    @NotNull()
    private Long id;
    
    @NotBlank
    private String itemName;

    @NotNull()
    @Range(min = 1000, max = 1000000)
    private Integer price;
    
    // 수정에서는 수량은 자유롭게 변경 가능
    private Integer quantity;
}

```

**ValidationItemControllerV4- 수정**
```java
@PostMapping("/add")
    public String addItemV2(@Validated() @ModelAttribute("item") ItemSaveForm form, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

        // 특정 필드가 아닌 복합 룰 검증
        if(form.getPrice() != null && form.getQuantity() != null){
            int resultPrice = form.getPrice() * form.getQuantity();
            if (resultPrice < 10000){
                bindingResult.reject("totalPriceMin", new Object[]{10000, resultPrice}, null);
            }
        }

        //검증에 실패하면 다시 입력 폼으로
        if(bindingResult.hasErrors()){
            log.info("errors={}",bindingResult);
            return "validation/v4/addForm";
        }
        Item item = new Item();
        item.setItemName(form.getItemName());
        item.setPrice(form.getPrice());
        item.setQuantity(form.getQuantity());

        // 성공 로직
        Item savedItem = itemRepository.save(item);
        redirectAttributes.addAttribute("itemId", savedItem.getId());
        redirectAttributes.addAttribute("status", true);
        return "redirect:/validation/v4/items/{itemId}";
    }


@PostMapping("/{itemId}/edit")
    public String editV2(@PathVariable Long itemId, @Validated() @ModelAttribute("item") ItemUpdateForm form, BindingResult bindingResult) {
        // 특정 필드가 아닌 복합 룰 검증
        if(form.getPrice() != null && form.getQuantity() != null){
            int resultPrice = form.getPrice() * form.getQuantity();
            if (resultPrice < 10000){
                bindingResult.reject("totalPriceMin", new Object[]{10000, resultPrice}, null);
            }
        }
        //검증에 실패하면 다시 입력 폼으로
        if(bindingResult.hasErrors()){
            log.info("errors={}",bindingResult);
            return "validation/v4/editForm";
        }

        Item itemParam = new Item();
        itemParam.setItemName(form.getItemName());
        itemParam.setPrice(form.getPrice());
        itemParam.setQuantity(form.getQuantity());

        itemRepository.update(itemId, itemParam);
        return "redirect:/validation/v4/items/{itemId}";
    }
```

**주의**
>`@ModelAttribute("item")` 에 `item` 이름을 넣어준 부분을 주의하자. 이것을 넣지 않으면 `ItemSaveForm` 의 경우 규칙에 의해 `itemSaveForm` 이라는 이름으로 MVC Model에 담기게 된다. 이렇게 되면 뷰 템플릿에서 접근하 는 `th:object` 이름도 함께 변경해주어야 한다.

**결과**
Form 전송 객체 분리해서 등록과 수정에 딱 맞는 기능을 구성하고, 검증도 명확히 분리했다.