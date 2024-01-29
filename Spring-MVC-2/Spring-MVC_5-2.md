## Bean Validation - V3

**Bean Validation 사용**
```java
    @PostMapping("/add")
    public String addItemV6(@Validated @ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

        //검증에 실패하면 다시 입력 폼으로
        if(bindingResult.hasErrors()){
            log.info("errors={}",bindingResult);
            return "validation/v3/addForm";
        }
        // 성공 로직
        Item savedItem = itemRepository.save(item);
        redirectAttributes.addAttribute("itemId", savedItem.getId());
        redirectAttributes.addAttribute("status", true);
        return "redirect:/validation/v3/items/{itemId}";
    }
```

**Bean Validation**
- **스프링 MVC에서 Bean Validator를 사용하려면** 
	- 스프링 부트가 `spring-boot-starter-validation`라이브러리를 넣으면 자동으로 Bean Validaor를 인지하고 스프링에 통합
- **스프링 부트는 자동으로 글로벌 Validator로 등록**
	- 글로벌 Validator가 적용되어 있기 때문에, `@Valid` , `@Validated` 만 적용하면 된다. 검증 오류가 발생하면, `FieldError` , `ObjectError` 를 생성해서`BindingResult` 에 담아준다.


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

**검증 순서**
1. `@ModelAttribute` 각각의 필드에 타입 변환 시도 
1. 성공하면 다음으로
	- ex) `itemName` 에 문자 "A" 입력 타입 변환 성공 `itemName` 필드에 BeanValidation 적용
2. 실패하면 `typeMismatch` 로 `FieldError` 추가 
	- ex) `price` 에 문자 "A" 입력 "A"를 숫자 타입 변환 시도 실패 typeMismatch FieldError 추가 -> `price` 필드는 BeanValidation 적용 X
2. Validator 적용

### Bean Validation -  에러코드
`Bean Validation이 기본으로 제공하는 오류 메시지를 좀 더 자세히 변경하고 싶으면 어떻게 하면 될까?`

- **Bean Validation을 적용하고 `bindingResult` 에 등록된 검증 오류 코드**

<img src="/img/Spring_MVC/BeanValidator.png" alt="BeanValidator" width="500" height="300" />

- NotBlank` 라는 오류 코드를 기반으로 `MessageCodesResolver` 를 통해 다양한 메시지 코드가 순서대로 생성된다.
- **@NotBlank** 
	- NotBlank.item.itemName
	- NotBlank.itemName 
	- NotBlank.java.lang.String 
	- NotBlank

- **@Range**
	- Range.item.price
	- Range.price 
	- Range.java.lang.Integer 
	- Range

**메시지 등록**
이제 메시지를 등록해보자.
`errors.properties` 
```
#Bean Validation 추가 
NotBlank={0} 공백X 
Range={0}, {2} ~ {1} 허용 
Max={0}, 최대 {1}
```
**BeanValidation 메시지 찾는 순서**
1. 생성된 메시지 코드 순서대로 `messageSource` 에서 메시지 찾기
2. 애노테이션의 `message` 속성 사용 `@NotBlank(message = "공백! {0}")` 
3. 라이브러리가 제공하는 기본 값 사용 공백일 수 없습니다.

### Bean Validation - 오브젝트 오류
- Bean Validation에서 특정 필드( `FieldError` )가 아닌 해당 오브젝트 관련 오류( `ObjectError` )는 어떻게 처리할 수 있을까?

**Item - `@ScriptAssert()` 를 사용**
```
@Data
 @ScriptAssert(lang = "javascript", script = "_this.price * _this.quantity >=
 10000")
 public class Item {
//...
}
```
- @ScriptAssert` 을 억지로 사용하는 것 보다는 다음과 같이 오브젝트 오 류 관련 부분만 직접 자바 코드로 작성하는 것을 권장한다.

**ValidationItemControllerV3 - 글로벌 오류(ObjectError 추가)**
```java
@PostMapping("/add")
    public String addItemV6(@Validated @ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

        // 특정 필드가 아닌 복합 룰 검증
        if(item.getPrice() != null && item.getQuantity() != null){
            int resultPrice = item.getPrice() * item.getQuantity();
            if (resultPrice < 10000){
                bindingResult.reject("totalPriceMin", new Object[]{10000, resultPrice}, null);
            }
        }
        
        //검증에 실패하면 다시 입력 폼으로
        if(bindingResult.hasErrors()){
            log.info("errors={}",bindingResult);
            return "validation/v3/addForm";
        }
        // 성공 로직
        Item savedItem = itemRepository.save(item);
        redirectAttributes.addAttribute("itemId", savedItem.getId());
        redirectAttributes.addAttribute("status", true);
        return "redirect:/validation/v3/items/{itemId}";
    }
```
