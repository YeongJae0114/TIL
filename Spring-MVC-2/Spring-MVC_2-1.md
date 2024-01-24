## 입력 폼 처리

지금부터 타임리프가 제공하는 입력 폼 기능을 적용해서 기존 프로젝트의 폼 코드를 타임리프가 지원하는 기능을 사용 해서 효율적으로 사용할 수 있다. 

- `th:object` : 커맨드 객체를 지정한다.
- `*{...}` : 선택 변수 식이라고 한다. 
- `th:object` 에서 선택한 객체에 접근한다. 
- `th:field`
	- HTML 태그의 `id` , `name` , `value` 속성을 자동으로 처리해준다.

**렌더링 전**
`<input type="text" th:field="*{itemName}" />`

**렌더링 후**
`<input type="text" id="itemName" name="itemName" th:value="*{itemName}" />`

**FormItemController**
```java
@GetMapping("/add")
 public String addForm(Model model) {
	model.addAttribute("item", new Item());
    return "form/addForm";
 }

@GetMapping("/{itemId}/edit")
 public String editForm(@PathVariable Long itemId, Model model) {
     Item item = itemRepository.findById(itemId);
     model.addAttribute("item", item);
     return "form/editForm";
}
```

**addForm.html - 등록 폼**
```java
    <form action="item.html" th:action th:object="${item}" method="post">
        <div>
            <label for="itemName">상품명</label>
            <input type="text" id="itemName" class="form-control" th:field="*{itemName}" placeholder="이름을 입력하세요">
        </div>
        <div>
            <label for="price">가격</label>
            <input type="text" id="price" th:field="*{price}" class="form-control" placeholder="가격을 입력하세요">
        </div>
        <div>
            <label for="quantity">수량</label>
            <input type="text" id="quantity" th:field="*{quantity}" class="form-control" placeholder="수량을 입력하세요">
        </div>
        <hr class="my-4">
        <div class="row">
            <div class="col">
                <button class="w-100 btn btn-primary btn-lg" type="submit">상품 등록</button>
            </div>
            <div class="col">
                <button class="w-100 btn btn-secondary btn-lg"
                        onclick="location.href='items.html'"
                        th:onclick="|location.href='@{/form/items}'|"
                        type="button">취소</button>
            </div>
        </div>
    </form>
```
- `th:object="${item}"` : `<form>` 에서 사용할 객체를 지정한다. 선택 변수 식( `*{...}` )을 적용할 수 있다.
- `th:field="*{itemName}"`
	- `*{itemName}` 는 선택 변수 식을 사용했는데, `${item.itemName}` 과 같다. 앞서 `th:object` 로 `item` 을 선택했기 때문에 선택 변수식을 적용할 수 있다.

	- `th:field` 는 `id` , `name` , `value` 속성을 모두 자동으로 만들어준다.
		- `id` : `th:field` 에서 지정한 변수 이름과 같다. `id="itemName"`
		- `name` : `th:field` 에서 지정한 변수 이름과 같다. `name="itemName"` 		- `value` : `th:field` 에서 지정한 변수의 값을 사용한다. `value=""`
	- 예제에서 `id` 속성을 제거해도 `th:field` 가 자동으로 만들어준다.



**editForm.html**
```java
    <form action="item.html" th:action method="post" th:object="${item}">
        <div>
            <label for="id">상품 ID</label>
            <input type="text" id="id" th:field="*{id}" class="form-control" value="1"  readonly>
        </div>
        <div>
            <label for="itemName">상품명</label>
            <input type="text" id="itemName"  th:field="*{itemName}" class="form-control" value="상품A" >
        </div>
        <div>
            <label for="price">가격</label>
            <input type="text" id="price" th:field="*{price}" class="form-control" value="10000" >
        </div>
        <div>
            <label for="quantity">수량</label>
            <input type="text" id="quantity" th:field="*{quantity}" class="form-control" value="10">
        </div>

        <hr class="my-4">

        <div class="row">
            <div class="col">
                <button class="w-100 btn btn-primary btn-lg" type="submit">저장</button>
            </div>
            <div class="col">
                <button class="w-100 btn btn-secondary btn-lg"
                        onclick="location.href='item.html'"
                        th:onclick="|location.href='@{/form/items/{itemId}(itemId=${item.id})}'|"
                        type="button">취소</button>
            </div>
        </div>
    </form>
```
- 수정폼의 경우 `id` , `name` , `value` 를 모두 신경써야 했는데, 많은 부분dl `th:field` 덕분에 자동으로 처리된다.
