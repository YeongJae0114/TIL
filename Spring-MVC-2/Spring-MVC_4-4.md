## 오류 코드와 메시지 처리
**errors 메시지 파일 생성**
`messages.properties` 를 사용해도 되지만, 오류 메시지를 구분하기 쉽게 `errors.properties` 라는 별도의 파일로 관리해보자.

먼저 스프링 부트가 해당 메시지 파일을 인식할 수 있게 다음 설정을 추가한다. 이렇게하면 `messages.properties`, `errors.properties` 두 파일을 모두 인식한다. (생략하면 `messages.properties` 를 기본으로 인식한다.)

**스프링 부트 메시지 설정 추가** `application.properties`
```
 spring.messages.basename=messages,errors
```

**errors.properties 추가** `src/main/resources/errors.properties`
```
required.item.itemName=상품 이름은 필수입니다.
range.item.price=가격은 {0} ~ {1} 까지 허용합니다.
max.item.quantity=수량은 최대 {0} 까지 허용합니다.
totalPriceMin=가격 * 수량의 합은 {0}원 이상이어야 합니다. 현재 값 = {1}
```
**ValidationItemControllerV2 - addItemV3() : 생성자 매개변수 변경**
```java 
//range.item.price=가격은 {0} ~ {1} 까지 허용합니다.
new FieldError("item", "price", item.getPrice(), false, new String[]
{"range.item.price"}, new Object[]{1000, 1000000} 
```
-  "가격은 1,000 ~ 1,000,000 까지 허용합니다." 문자열 대신 `errors.properties`에서 추가한 `range.item.price` 메시지를 사용한다.
- `codes` : `required.item.itemName` 를 사용해서 메시지 코드를 지정한다. 메시지 코드는 하나가 아니 라 배열로 여러 값을 전달할 수 있는데, 순서대로 매칭해서 처음 매칭되는 메시지가 사용된다.
- `arguments` : `Object[]{1000, 1000000}` 를 사용해서 코드의 `{0}` , `{1}` 로 치환할 값을 전달한다.


**rejectValue(), reject()**
- `FieldError` , `ObjectError` 는 다루기 너무 번거롭다.
	- 생성자의 매개변수가 너무 많아 사용하기 불편함
- 오류 코드도 좀 더 자동화 할 수 있지 않을까? 예) `item.itemName` 처럼?
- `BindingResult` 가 제공하는 `rejectValue()` , `reject()` 를 사용하면 `FieldError` , `ObjectError` 를 직접 생성하지 않고, 깔끔하게 검증 오류를 다룰 수 있다. 
- `rejectValue()` , `reject()` 를 사용해서 기존 코드를 단순화해보자.

**ValidationItemControllerV2 - addItemV4() : rejectValue() 사용** 
```java
//검증 로직
        if(!StringUtils.hasText(item.getItemName())){
            bindingResult.rejectValue("itemName", "required");
        }
        if(item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000){
            bindingResult.rejectValue("price","range", new Object[]{1000,1000000}, null);
        }
        if(item.getQuantity() == null || item.getQuantity() > 9999){
            bindingResult.rejectValue("quantity", "max", new Object[]{9999}, null);
        }
```
- rejectValue()` 를 사용하고 부터는 오류 코드를 `range` 로 간단하게 입력
	- `FieldError()` 를 직접 다룰 때는 오류 코드를 `range.item.price` 와 같이 모두 입력했음

**rejectValue()**
```java
 void rejectValue(@Nullable String field, String errorCode,
         @Nullable Object[] errorArgs, @Nullable String defaultMessage);
```
- `field` : 오류 필드명
- `errorCode` : 오류 코드(이 오류 코드는 메시지에 등록된 코드가 아니다. 뒤에서 설명할 messageResolver를 위한 오류 코드이다.)
- `errorArgs` : 오류 메시지에서 `{0}` 을 치환하기 위한 값
- `defaultMessage` : 오류 메시지를 찾을 수 없을 때 사용하는 기본 메시지

### 스프링의 오류 처리 메시지

**동작 방식**
- `rejectValue()` , `reject()` 는 내부에서 `MessageCodesResolver` 를 사용한다. 여기에서 메시지
코드들을 생성한다.
- `FieldError` , `ObjectError` 의 생성자를 보면, 오류 코드를 하나가 아니라 여러 오류 코드를 가질 수
있다. `MessageCodesResolver` 를 통해서 생성된 순서대로 오류 코드를 보관한다. 
- 이 부분을 `BindingResult` 의 로그를 통해서 확인해보자.
	- `codes [range.item.price, range.price, range.java.lang.Integer, range]`


**FieldError** `rejectValue("itemName", "required")` 

다음 4가지 오류 코드를 자동으로 생성

- `required.item.itemName` 
- `required.itemName` 
- `required.java.lang.String` 
- `required`

**ObjectError** `reject("totalPriceMin")` 

다음 2가지 오류 코드를 자동으로 생성

- `totalPriceMin.item`
- `totalPriceMin`

### Validator 분리
스프링의 `Validator` 인터페이스를 제공하는 이유는 체계적으로 검증 기능을 도입하기 때문이다.
**WebDataBinder를 통해서 사용하기**
- `WebDataBinder` 는 스프링의 파라미터 바인딩의 역할을 해주고 검증 기능도 내부에 포함한다.

ValidationItemControllerV2에 다음 코드를 추가하자** 
```java
 @InitBinder
 public void init(WebDataBinder dataBinder) {
     log.info("init binder {}", dataBinder);
     dataBinder.addValidators(itemValidator);
 }
```
- `WebDataBinder` 에 검증기를 추가하면 해당 컨트롤러에서는 검증기를 자동으로 적용할 수 있다. -> `@InitBinder` 해당 컨트롤러에만 영향을 준다. 
	- 글로벌 설정은 별도로 해야한다.

**@Validated 적용**
**ValidationItemControllerV2 - addItemV6()**
```java
@PostMapping("/add")
 public String addItemV6(@Validated @ModelAttribute Item item, BindingResult
 bindingResult, RedirectAttributes redirectAttributes) {
     if (bindingResult.hasErrors()) {
         log.info("errors={}", bindingResult);
         return "validation/v2/addForm";
}
//성공 로직
Item savedItem = itemRepository.save(item); redirectAttributes.addAttribute("itemId", savedItem.getId()); redirectAttributes.addAttribute("status", true);
return "redirect:/validation/v2/items/{itemId}";
}
```

