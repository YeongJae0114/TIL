## Bean Validation - HTTP 메시지 컨버터
`@Valid` , `@Validated` 는 `HttpMessageConverter` ( `@RequestBody` )에도 적용할 수 있다.

**참고**
>`@ModelAttribute` 는 HTTP 요청 파라미터(URL 쿼리 스트링, POST Form)를 다룰 때 사용한다. `@RequestBody` 는 HTTP Body의 데이터를 객체로 변환할 때 사용한다. 주로 API JSON 요청을 다룰 때 사용한다.

**ValidationItemApiController 생성**
```java
package hello.itemservice.web.validation;

import hello.itemservice.web.validation.form.ItemSaveForm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/validation/api/items")

public class ValidationItemApiController {
    @PostMapping("/add")
    public Object addItem(@RequestBody @Validated ItemSaveForm form, BindingResult bindingResult){
        log.info("API 컨트롤러 호출");
        if(bindingResult.hasErrors()){
            log.info("검증 오류 발생 errors = {}", bindingResult);
            return bindingResult.getAllErrors();
        }
        log.info("성공 로직 실행");
        return form;
    }
}
```
**Postman을 사용해서 테스트**

- **API의 경우 3가지 경우를 나누어 생각해야 한다.** 
- 성공 요청: 성공
- 실패 요청: JSON을 객체로 생성하는 것 자체가 실패함
- 검증 오류 요청: JSON을 객체로 생성하는 것은 성공했고, 검증에서 실패함


**성공 요청**
```
 POST http://localhost:8080/validation/api/items/add
 {"itemName":"hello", "price":1000, "quantity": 10}
```
- **Postman에서 Body raw JSON을 선택해야 한다.**


**실패 요청**
```
 POST http://localhost:8080/validation/api/items/add
 {"itemName":"hello", "price":"A", "quantity": 10}
```
- 이 경우는 `ItemSaveForm` 객체를 만들지 못하기 때문에 컨트롤러 자체가 호출되지 않고 그 전에 예외가 발생한다. 물 론 Validator도 실행되지 않는다.

**검증 오류 요청**
이번에는 `HttpMessageConverter` 는 성공하지만 검증(Validator)에서 오류가 발생하는 경우를 확인해보자.
```
 POST http://localhost:8080/validation/api/items/add
 {"itemName":"hello", "price":1000, "quantity": 10000}
```
- 수량( `quantity` )이 `10000` 이면 BeanValidation `@Max(9999)` 에서 걸린다.


**@ModelAttribute vs @RequestBody**
>HTTP 요청 파리미터를 처리하는 `@ModelAttribute` 는 각각의 필드 단위로 세밀하게 적용된다. 그래서 특정 필드 에 타입이 맞지 않는 오류가 발생해도 나머지 필드는 정상 처리할 수 있었다.
`HttpMessageConverter` 는 `@ModelAttribute` 와 다르게 각각의 필드 단위로 적용되는 것이 아니라, 전체 객체 단위로 적용된다.
따라서 메시지 컨버터의 작동이 성공해서 `ItemSaveForm` 객체를 만들어야 `@Valid` , `@Validated` 가 적용된다.

- `@ModelAttribute` 는 필드 단위로 정교하게 바인딩이 적용된다. 특정 필드가 바인딩 되지 않아도 나머지 필드는 정상 바인딩 되고, Validator를 사용한 검증도 적용할 수 있다.
- `@RequestBody` 는 HttpMessageConverter 단계에서 JSON 데이터를 객체로 변경하지 못하면 이후 단계 자체가 진행되지 않고 예외가 발생한다. 컨트롤러도 호출되지 않고, Validator도 적용할 수 없다.

