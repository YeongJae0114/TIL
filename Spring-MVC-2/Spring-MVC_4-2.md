## 검증V2
지금부터 스프링이 제공하는 검증 오류 처리 방법을 알아보자. 여기서 핵심은 BindingResult이다.
 
### 검증 - BindingResult
**BindingResult**

- 스프링이 제공하는 검증 오류를 보관하는 객체이다. 검증 오류가 발생하면 여기에 보관하면 된다. 
- `BindingResult` 가 있으면 `@ModelAttribute` 에 데이터 바인딩 시 오류가 발생해도 컨트롤러가 호출된다!

**예) @ModelAttribute에 바인딩 시 타입 오류가 발생하면?**

- `BindingResult` 가 없으면 -> 400 오류가 발생하면서 컨트롤러가 호출되지 않고, 오류 페이지로 이동한다.
- `BindingResult` 가 있으면 -> 오류 정보( `FieldError` )를 `BindingResult` 에 담아서 컨트롤러를 정상 호출한다.

**BindingResult에 검증 오류를 적용하는 3가지 방법**
- `@ModelAttribute` 의 객체에 타입 오류 등으로 바인딩이 실패하는 경우 스프링이 `FieldError` 생성해서 `BindingResult` 에 넣어준다. 
- 개발자가 직접 넣어준다.
- `Validator` 사용 이것은 뒤에서 설명

**ValidationItemControllerV2 - addItemV1**
```java
@PostMapping("/add")
    public String addItemV1(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes, Model model) {
        //검증 오류 결과를 보관은 BindingResult bindingResult

        //검증 로직
        if(!StringUtils.hasText(item.getItemName())){
            bindingResult.addError(new FieldError("item", "itemName", "상품 이름은 필수입니다."));
        }
        if(item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000){
            bindingResult.addError(new FieldError("item", "price", "가격은 1,000 ~ 1,000,000 까지 허용"));
        }
        if(item.getQuantity() == null || item.getQuantity() > 9999){
            bindingResult.addError(new FieldError("item", "quantity", "수량은 최대 9999개 까지 허용"));
        }

        // 특정 필드가 아닌 복합 룰 검증
        if(item.getPrice() != null && item.getQuantity() != null){
            int resultPrice = item.getPrice() * item.getQuantity();
            if (resultPrice < 10000){
                bindingResult.addError(new ObjectError("item", "가격 *수량의 합은 10,000원 이상. 현재 값 resultPrice = "+ resultPrice));
            }
        }

        //검증에 실패하면 다시 입력 폼으로
        if(bindingResult.hasErrors()){
            model.addAttribute("errers={}", bindingResult);
            return "validation/v2/addForm";
        }

        // 성공 로직
        Item savedItem = itemRepository.save(item);
        redirectAttributes.addAttribute("itemId", savedItem.getId());
        redirectAttributes.addAttribute("status", true);
        return "redirect:/validation/v2/items/{itemId}";
    }
```
**주의**
- `BindingResult bindingResult` 파라미터의 위치는 `@ModelAttribute Item item` 다음에 와야 한다.
- `BindingResult` 는 Model에 자동으로 포함된다.

**필드 오류 - FieldError** 
```java
if (!StringUtils.hasText(item.getItemName())) {
	bindingResult.addError(new FieldError("item", "itemName", "상품 이름은 필수입니다.")); }
```
- FieldError 생성자 요약
	- `public FieldError(String objectName, String field, String defaultMessage) {}`
		- 필드에 오류가 있으면 `FieldError` 객체를 생성해서 `bindingResult` 에 담아두면 된다. 
			- `objectName` : `@ModelAttribute` 이름
			- `field` : 오류가 발생한 필드 이름 
			- `defaultMessage` : 오류 기본 메시지

**글로벌 오류 - ObjectError** 
```java
bindingResult.addError(new ObjectError("item", "가격 * 수량의 합은 10,000원 이상이어야 합니다. 현재 값 = " + resultPrice));
```
- ObjectError 생성자 요약
	- `public ObjectError(String objectName, String defaultMessage) {}`
	- 특정 필드를 넘어서는 오류가 있으면 `ObjectError` 객체를 생성해서 `bindingResult` 에 담아두면 된다. 		- `objectName` : `@ModelAttribute` 의 이름
		- `defaultMessage` : 오류 기본 메시지

### 뷰 탬플릿 수정
**타임리프 스프링 검증 오류 통합 기능**
- 타임리프는 스프링의 `BindingResult` 를 활용해서 편리하게 검증 오류를 표현하는 기능을 제공한다.
	- `#fields` : `#fields` 로 `BindingResult` 가 제공하는 검증 오류에 접근할 수 있다. 
	- `th:errors` : 해당 필드에 오류가 있는 경우에 태그를 출력한다. `th:if` 의 편의 버전이다. 
	- `th:errorclass` : `th:field` 에서 지정한 필드에 오류가 있으면 `class` 정보를 추가한다.

**글로벌 오류 처리**
```html
<div th:if="${#fields.hasGlobalErrors()}">
<p class="field-error" th:each="err : ${#fields.globalErrors()}" th:text="$ {err}">전체 오류 메시지 </p></div> 
```

**필드 오류 처리** 
```html
<input type="text" id="itemName" th:field="*{itemName}" th:errorclass="field-error" class="form-control" placeholder="이름을 입력하세요">
<div class="field-error" th:errors="*{itemName}">상품명 오류</div> 
```
