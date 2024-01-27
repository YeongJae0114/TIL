## 검증V1
```
웹 서비스는 폼 입력시 오류가 발생하면, 고객이 입력한 데이터를 유지한 상태로 어떤 오류 가 발생했는지 친절하게 알려주어야 한다.
현재 상품 관리 시스템에는 검증 로직이 구현되지 않아 숫자 타입에 문자가 들어오거나 공백을 입력했을 경우 문제를 고려하지 않았다. 고객을 위한 이러한 문제들을 해결해보자
``` 

**컨트롤러의 중요한 역할중 하나는 HTTP 요청이 정상인지 검증하는 것이다.**
그리고 정상 로직보다 이런 검증 로직을 잘 개발하는 것이 어쩌면 더 어려울 수 있다.

**참고: 클라이언트 검증, 서버 검증**
- 클라이언트 검증은 조작할 수 있으므로 보안에 취약하다.
- 서버만으로 검증하면, 즉각적인 고객 사용성이 부족해진다.
- 둘을 적절히 섞어서 사용하되, 최종적으로 서버 검증은 필수
- API 방식을 사용하면 API 스펙을 잘 정의해서 검증 오류를 API 응답 결과에 잘 남겨주어야 함

**검증 로직**
- 타입 검증
	- 가격, 수량에 문자가 들어가면 검증 오류 처리 
- 필드 검증
	- 상품명: 필수, 공백X
	- 가격: 1000원 이상, 1백만원 이하 
	- 수량: 최대 9999
- 특정 필드의 범위를 넘어서는 검증
	- 가격 * 수량의 합은 10,000원 이상


>고객이 상품 등록 폼에서 상품명을 입력하지 않거나, 가격, 수량 등이 너무 작거나 커서 검증 범위를 넘어서면, 서버 검 증 로직이 실패해야 한다. 이렇게 검증에 실패한 경우 고객에게 다시 상품 등록 폼을 보여주고, 어떤 값을 잘못 입력했는 지 친절하게 알려주어야 한다.

### 검증 직접 처리 
**ValidationItemControllerV1 - addItem() 수정**
```java
@PostMapping("/add")
    public String addItem(@ModelAttribute Item item, RedirectAttributes redirectAttributes, Model model) {
        //검증 오류 결과를 보관
        Map<String, String>errors = new HashMap<>();

        //검증 로직
        if(!StringUtils.hasText(item.getItemName())){
            errors.put("itemName", "상품 이름은 필수입니다.");
        }
        if(item.getPrice() == null || item.getPrice() < 100 || item.getPrice() > 1000000){
            errors.put("price", "가격은 1,000 ~ 1,000,000 까지 허용");
        }
        if(item.getQuantity() == null || item.getQuantity() > 9999){
            errors.put("quantity", "수량은 최대 9999개 까지 허용");
        }

        // 특정 필드가 아닌 복합 룰 검증
        if(item.getPrice() != null && item.getQuantity() != null){
            int resultPrice = item.getPrice() * item.getQuantity();
            if (resultPrice < 10000){
                errors.put("globalError", "가격 수량의 합은 10,000원 이상 현재 값 resultPrice = "+ resultPrice);
            }
        }

        //검증에 실패하면 다시 입력 폼으로(에러 메시지가 없지 않다면 - 2중 부정) => 에러가 있다면 => 검증 실패
        if(!errors.isEmpty()){
            model.addAttribute("errers", errors);
            return "validation/v1/addForm";
        }

        // 성공 로직
        Item savedItem = itemRepository.save(item);
        redirectAttributes.addAttribute("itemId", savedItem.getId());
        redirectAttributes.addAttribute("status", true);
        return "redirect:/validation/v1/items/{itemId}";
    }
```

**검증 오류 보관**
`Map<String, String> errors = new HashMap<>();`
- 만약 검증시 오류가 발생하면 어떤 검증에서 오류가 발생했는지 정보를 담아둔다.

**필드 검증 로직**
```java
if (!StringUtils.hasText(item.getItemName())) { errors.put("itemName", "상품 이름은 필수입니다.");
}
```
- 검증시 오류가 발생하면 `errors` 에 담아둔다. 이때 어떤 필드에서 오류가 발생했는지 구분하기 위해 오류가 발생한 필
드명을 `key` 로 사용

**특정 필드의 범위를 넘어서는 검증 로직** 
```java
//특정 필드의 범위를 넘어서는 검증 로직
if (item.getPrice() != null && item.getQuantity() != null) {
     int resultPrice = item.getPrice() * item.getQuantity();
     if (resultPrice < 10000) {
errors.put("globalError", "가격 * 수량의 합은 10,000원 이상이어야 합니다. 현재 값 = " + resultPrice);
	}
 }
```
- 특정 필드를 넘어서는 오류를 처리해야 할 수도 있다. 이때는 필드 이름을 넣을 수 없으므로 `globalError` 라는 `key` 를 사용

**검증에 실패하면 다시 입력 폼으로** 
```java
 if (!errors.isEmpty()) {
     model.addAttribute("errors", errors);
     return "validation/v1/addForm";
}
```
- 만약 검증에서 오류 메시지가 하나라도 있으면 오류 메시지를 출력하기 위해 `model` 에 `errors` 를 담고, 입력 폼이 있 는 뷰 템플릿으로 보낸다.

### 뷰 탬플릿 수정
이제 뷰 탬플릿에 오류가 난 필드들을 파악할 수 있게 수정해보자

**css 추가** 
```css
 .field-error {
     border-color: #dc3545;
     color: #dc3545;
}
```
- 이 부분은 오류 메시지를 빨간색으로 강조하기 위해 추가

**addForm.html**
```html
        <div th:if="${errers?.containsKey('globalError')}">
            <p class="field-error" th:text="${errers['globalError']}">전체 오류 메시지</p>
        </div>
```
- 오류 메시지는 `errors` 에 내용이 있을 때만 출력하면 된다. 타임리프의 `th:if` 를 사용하면 조건에 만족할 때만 해당 HTML 태그를 출력할 수 있다.
- `th:if="${errers?.containsKey('globalError')}"` : `errors?.`은 `errors` 가 `null` 일때 `NullPointerException` 이 발생하는 대신, `null` 을 반환하는 문법이다.

**정리**
- 만약 검증 오류가 발생하면 입력 폼을 다시 보여준다.
- 검증 오류들을 고객에게 친절하게 안내해서 다시 입력할 수 있게 한다. 
- 검증 오류가 발생해도 고객이 입력한 데이터가 유지된다.



 