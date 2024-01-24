## 체크 박스, 라디오 버튼, 셀렉트 박스
**기능**
- 판매 여부
	-판매 오픈 여부
	- 체크 박스로 선택할 수 있다.
- 등록 지역
	-서울, 부산, 제주
	- 체크 박스로 다중 선택할 수 있다. 
- 상품 종류
	- 도서, 식품, 기타
	- 라디오 버튼으로 하나만 선택할 수 있다. 
- 배송 방식
    - 빠른 배송
	- 일반 배송
	- 느린 배송
	- 셀렉트 박스로 하나만 선택할 수 있다.

### 체크 박스 - 단일
**타임리프**
```html
<!-- single checkbox -->
        <div>판매 여부</div> <div>
        <div class="form-check">
            <input type="checkbox" id="open" th:field="${item.open}" class="form-check-input">
            <label for="open" class="form-check-label">판매 오픈</label>
        </div>
	</div>
```
**타임리프 체크 박스 HTML 생성 결과**
```html
<!-- single checkbox -->
	 <div>판매 여부</div> <div>
     <div class="form-check">
         <input type="checkbox" id="open" class="form-check-input" name="open" value="true">
		<input type="hidden" name="_open" value="on"/>
		<label for="open" class="form-check-label">판매 오픈</label>
     </div>
 </div>
```
**체크 박스 체크** 
- `open=on&_open=on`- 체크 박스를 체크하면 스프링 MVC가 `open` 에 값이 있는 것을 확인하고 사용한다. 이때 `_open` 은 무시한다.
**체크 박스 미체크** 
- `_open=on`
- 체크 박스를 체크하지 않으면 스프링 MVC가 `_open` 만 있는 것을 확인하고, `open` 의 값이 체크되지 않았다고 인식한다.

**타임리프를 사용하면**
- 타임리프를 사용하면 체크 박스의 히든 필드와 관련된 부분도 함께 해결해준다. HTML 생성 결과를 보면 히든 필드 부분이 자동으로 생성되어 있다.

### 체크 박스 - 다중
**더미 데이터**
```java
@ModelAttribute("regions")
 public Map<String, String> regions() {
	Map<String, String> regions = new LinkedHashMap<>(); 	regions.put("SEOUL", "서울");
	regions.put("BUSAN", "부산");
	regions.put("JEJU", "제주");
    	return regions;
 }
```
- `@ModelAttribute`을 사용해서 체크 박스를 구성하는 데이터를 넣는다.
	- 컨트롤러에 있는 별도의 메서드에서도 사용이 가능
	- 컨트롤러를 요청 할 때 regions에서 반환한 값이 자동으로 모델에 담기게 된다.
	- 각각의 컨트롤러 메서드에서 모델에 직접 데이터를 담아서 처리해도 됨(반복되는 코드 발생) 

```html
<!-- multi checkbox -->
        <div>
            <div>등록 지역</div>
            <div th:each="region : ${regions}" class="form-check form-check-inline">
                <input type="checkbox" th:field="*{regions}" th:value="${region.key}" class="form-check-input">
                <label th:for="${#ids.prev('regions')}"
                       th:text="${region.value}" class="form-check-label">서울</label>
            </div>
        </div>
```
- `th:each="region : ${regions}"`를 사용해 반복
	- `th:field="*{regions}"`로 인해 name과 id의 값이 자동으로 처리 된다.
		- 이때 name의 값은 중복 되지만, id는 유일한 값을 가져야 한다. (html의 특성에 의해)
			- 타임리프는 id값을 동적으로 생성해준다.
				- `th:for="${#ids.prev('regions')}"`를 사용
				- regions1, regions2, regions3 이런 식으로 생성 


### 라디오 버튼 
**자바 ENUM**
>1.클래스처럼 보이게 하는 상수 </br>2.서로 관련있는 상수들끼리 모아 상수들을 대표할 수 있는 이름으로 타입을 정의하는 것 </br>3.Enum 클래스 형을 기반으로 한 클래스형 선언 

**ItemType.java**
```java
package hello.itemservice.domain.item;

public enum ItemType {
    BOOK("도서"), FOOD("음식"), ETC("기타");
    private final String description;
    ItemType(String description){
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
```

```java
@ModelAttribute("itemTypes")
 public ItemType[] itemTypes() {
     return ItemType.values();
 }
```
- ItemType.values()` 를 사용하면 해당 ENUM의 모든 정보를 배열로 반환한다. 예) `[BOOK, FOOD, ETC]`


```html
 <!-- radio button -->
<div>
<div>상품 종류</div>
<div th:each="type : ${itemTypes}" class="form-check form-check-inline">
         <input type="radio" th:field="*{itemType}" th:value="${type.name()}"
 class="form-check-input">
         <label th:for="${#ids.prev('itemType')}" th:text="${type.description}"
 class="form-check-label">
             BOOK
         </label>
     </div>
 </div>

```
>체크 박스는 수정시 체크를 해제하면 아무 값도 넘어가지 않기 때문에, 별도의 히든 필드로 이런 문제를 해결했다. 라디 오 버튼은 이미 선택이 되어 있다면, 수정시에도 항상 하나를 선택하도록 되어 있으므로 체크 박스와 달리 별도의 히든 필드를 사용할 필요가 없다.

### 셀렉트 박스 
```java
@ModelAttribute("deliveryCodes")
public List<DeliveryCode> deliveryCodes() {
	List<DeliveryCode> deliveryCodes = new ArrayList<>(); 	deliveryCodes.add(new DeliveryCode("FAST", "빠른 배송")); 	deliveryCodes.add(new DeliveryCode("NORMAL", "일반 배송")); 	deliveryCodes.add(new DeliveryCode("SLOW", "느린 배송"));
		return deliveryCodes;
}
```
- `@ModelAttribute`을 사용해서 체크 박스를 구성하는 데이터를 넣는다.

```html
<!-- SELECT -->
<div>
<div>배송 방식</div>
<select th:field="*{deliveryCode}" class="form-select">
<option value="">==배송 방식 선택==</option>
         <option th:each="deliveryCode : ${deliveryCodes}" th:value="$
 {deliveryCode.code}"
                 th:text="${deliveryCode.displayName}">FAST</option>
     </select>
 </div>
<hr class="my-4">
```

**주의**
```java
    public void update(Long itemId, Item updateParam) {
        Item findItem = findById(itemId);
        findItem.setItemName(updateParam.getItemName());
        findItem.setPrice(updateParam.getPrice());
        findItem.setQuantity(updateParam.getQuantity());
        findItem.setOpen(updateParam.getOpen());
        findItem.setRegions(updateParam.getRegions());
        findItem.setDeliveryCode(updateParam.getDeliveryCode());
    }
```
- update된 값을 저장하는 메서드도 추가해야 잘 저장이 된다.