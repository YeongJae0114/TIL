## 스프링 메시지 소스 설정
**스프링 부트**
- 스프링 부트를 사용하면 스프링 부트가 `MessageSource` 를 자동으로 스프링 빈으로 등록한다.

**스프링 부트 메시지 소스 설정**
- 스프링 부트를 사용하면 다음과 같이 메시지 소스를 설정할 수 있다.
`application.properties` 
```
spring.messages.basename=messages,config.i18n.messages
```
**스프링 부트 메시지 소스 기본 값** 
`spring.messages.basename=messages`
	- 파일명을 만들 때. `messages`.properties `messages`인 것에 주의하자. 

**메시지 파일 만들기**
- `messages.properties` :기본 값으로 사용(한글)
- `messages_en.properties` : 영어 국제화 사용




**messages.properties**  `/resources/messages.properties`
```
hello=안녕 
hello.name=안녕 {0}
```

**messages_en.properties**  `/resources/messages_en.properties`
```
hello=hello 
hello.name=hello {0}
```
### 스프링 메시지 소스 사용
**MessageSource 인터페이스**
```java
public interface MessageSource {
     String getMessage(String code, @Nullable Object[] args, @Nullable String defaultMessage, Locale locale);
     String getMessage(String code, @Nullable Object[] args, Locale locale)
throws NoSuchMessageException;
```
- `MessageSource` 인터페이스를 보면 코드를 포함한 일부 파라미터로 메시지를 읽어오는 기능을 제공


`스프링이 제공하는 메시지 소스를 어떻게 사용하는지 테스트 코드를 통해서 학습겠다`

**MessageSource Test 코드**`test/java/hello/itemservice/message.MessageSourceTest.java`
```java
package hello.itemservice.message;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.MessageSource;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest
public class MessageSourceTest {
    @Autowired
    MessageSource ms;

    @Test
    void helloMessage() {
        String result = ms.getMessage("hello", null, null);
		assertThat(result).isEqualTo("안녕"); 
		}
	}
```
- 메시지 코드는 hello 입력, 나머지는 null
	- `ms.getMessage("hello", null, null)` 
		- **code**: `hello`
		- **args**: `null`
		- **locale**: `null`
- local 정보가 없으면 basename` 에서 설정한 기본 이름 메시지 파일을 조회
	- `basename`으로 `messages`를 지정 했으므로 `messages.properties`파일에서 데이터 조회된다.

**MessageSourceTest 추가 - 메시지가 없는 경우, 기본 메시지** 
```java
    @Test
    void notFoundMessageCode(){
        assertThatThrownBy(()->ms.getMessage("no-code", null, null))
                .isInstanceOf(NoSuchMessageException.class);
    }

    @Test
    void notFoundMessageCodeDefaultMessage(){
        String result = ms.getMessage("no-code", null, "기본메시지", null);
        assertThat(result).isEqualTo("기본메시지");
    }
```
- 메시지가 없는 경우에는 `NoSuchMessageException` 이 발생한다.
- 메시지가 없어도 기본 메시지( `defaultMessage` )를 사용하면 기본 메시지가 반환된다.

**MessageSourceTest 추가 - 매개변수 사용**
```java
    @Test
    void argumentMessage(){
        String message = ms.getMessage("hello.name", new Object[]{"Spring"}, null);
        assertThat(message).isEqualTo("안녕 Spring");
    }
```
### 국제화 파일 선택
>locale 정보를 기반으로 국제화 파일을 선택한다.
Locale이 `en_US` 의경우 `messages_en_US`
`Locale` 에 맞추어 구체적인 것이 있으면 구체적인 것을 찾고, 없으면 디폴트를 찾는다고 이해하면 된다.

**MessageSourceTest 추가 - 국제화 파일 선택1**
```java
    @Test
    void defaultLang(){
        assertThat(ms.getMessage("hello", null,null)).isEqualTo("안녕");
        assertThat(ms.getMessage("hello", null, Locale.KOREA)).isEqualTo("안녕");
    }
```
`ms.getMessage("hello", null, null)` : locale 정보가 없으므로 `messages` 를 사용
`ms.getMessage("hello", null, Locale.KOREA)` : locale 정보가 있지만, `message_ko` 가 없으므로 `messages` 를 사용

**MessageSourceTest 추가 - 국제화 파일 선택2**
```java
    @Test
    void enLang(){
        assertThat(ms.getMessage("hello", null,Locale.ENGLISH)).isEqualTo("hello");
    }
```

`ms.getMessage("hello", null, Locale.ENGLISH)` : locale 정보가 `Locale.ENGLISH` 이므로 `messages_en` 을 찾아서 사용

## 웹 애플리케이션에 메시지 적용하기

**messages.properties**`메시지 추가 등록`
```
hello=안녕
hello.name=안녕 {0}

label.item=상품
label.item.id=상품 ID
label.item.itemName=상품명
label.item.price=가격
label.item.quantity=수량

page.items=상품 목록
page.item=상품 상세
page.addItem=상품 등록
page.updateItem=상품 수정

button.save=저장
button.cancel=취소
```
**페이지 이름에 적용**
- `<h2>상품 등록 폼</h2>`
	- `<h2 th:text="#{page.addItem}">상품 등록</h2>`
**레이블에 적용**
- `<label for="itemName">상품명</label>`
	- `<label for="itemName" th:text="#{label.item.itemName}">상품명</label>`
	- `<label for="price" th:text="#{label.item.price}">가격</label>`
	- `<label for="quantity" th:text="#{label.item.quantity}">수량</label>`
**버튼에 적용**
- `<button type="submit">상품 등록</button>`
	- `<button type="submit" th:text="#{button.save}">저장</button>` 	- `<button type="button" th:text="#{button.cancel}">취소</button>`

**참고로 파라미터는 다음과 같이 사용할 수 있다.**
`hello.name=안녕 {0}`
`<p th:text="#{hello.name(${item.itemName})}"></p>`

### 웹 애플리케이션에 국제화 적용하기
**messages_en.properties**`메시지 추가 등록`
```
hello=hello
hello.name=hello {0}

label.item=Item
label.item.id=Item ID
label.item.itemName=Item Name
label.item.price=price
label.item.quantity=quantity

page.items=Item List
page.item=Item Detail
page.addItem=Item Add
page.updateItem=Item Update

button.save=Save
button.cancel=Cancel
```
사실 이것으로 국제화 작업은 거의 끝났다. 앞에서 템플릿 파일에는 모두 `#{...}`를 통해서 메시지를 사용하도록 적용 해두었기 때문이다.

**웹으로 확인하기**
>웹 브라우저의 언어 설정 값을 변경하면서 국제화 적용을 확인해보자. 크롬 브라우저 설정 언어를 검색하고, 우선 순위를 변경하면 된다. Accept-Language` 는 클라이언트가 서버에 기대하는 언어 정보를 담아서 요청하는 HTTP 요청 헤더이다



