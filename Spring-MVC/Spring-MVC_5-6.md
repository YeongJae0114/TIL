## HTTP 요청 메시지 - JSON

이번에는 HTTP API에서 주로 사용하는 JSON 데이터 형식을 조회해보자.

**RequestBodyJsonController - requestBodyJson**

```java
import ...
@Slf4j
@Controller
public class RequestBodyJsonController {
    private ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/request-body-json-v1")
    public void requestBodyJson(HttpServletRequest request, HttpServletResponse response) throws IOException{
        ServletInputStream inputStream = request.getInputStream();
        String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);

        log.info("messageBody={}",messageBody);
        HelloData helloData = objectMapper.readValue(messageBody,HelloData.class);
        log.info("username={},age={}",helloData.getUsername(), helloData.getAge());

        response.getWriter().write("ok");
    }
  }
```
- HttpServletRequest를 사용해서 직접 HTTP 메시지 바디에서 데이터를 읽어와서, 문자로 변환
- 문자로 된 JSON 데이터를 Jackson 라이브러리인 `objectMapper` 를 사용해서 자바 객체로 변환한다.


**requestBodyJsonV2**
```java
    @ResponseBody
    @PostMapping("/request-body-json-v2")
    public String requestBodyJsonV2(@RequestBody String messageBody) throws IOException{

        log.info("messageBody={}",messageBody);
        HelloData helloData = objectMapper.readValue(messageBody,HelloData.class);
        log.info("username={},age={}",helloData.getUsername(), helloData.getAge());

        return "ok";
    }
```
- @RequestBody
	- 이전에 학습했던 `@RequestBody` 를 사용해서 HTTP 메시지에서 데이터를 꺼내고 messageBody에 저장.
	- HttpMessageConverter 사용 -> StringHttpMessageConverter 적용

- ObjectMapper 객체
	- 문자로 된 JSON 데이터인 `messageBody` 를 `objectMapper` 를 통해서 자바 객체로 변환한다.
- @ResponseBody
 	- 모든 메서드에 @ResponseBody 적용
 	- 메시지 바디 정보 직접 반환(view 조회X)
 	- HttpMessageConverter 사용 -> StringHttpMessageConverter 적용


**requestBodyJsonV3**
```java
    @ResponseBody
    @PostMapping("/request-body-json-v3")
    public String requestBodyJsonV3(@RequestBody HelloData helloData) {

        log.info("username={},age={}",helloData.getUsername(), helloData.getAge());

        return "ok";
    }
```
- **@RequestBody 생략 불가능(@ModelAttribute 가 적용되어 버림)**
	- HttpMessageConverter 사용 -> MappingJackson2HttpMessageConverter (content-type : application/json)

- **@RequestBody 객체 파라미터**
	- `@RequestBody HelloData data` 
	- `@RequestBody` 에 직접 만든 객체를 지정할 수 있다.
	- V2의 작업(JSON으로 변환)을 대신 처리해준다.

>`HttpEntity` , `@RequestBody` 를 사용하면 HTTP 메시지 컨버터가 HTTP 메시지 바디의 내용을 우리가 원하는 문 자나 객체 등으로 변환해준다.
HTTP 메시지 컨버터는 문자 뿐만 아니라 JSON도 객체로 변환해주는데, 우리가 방금 V2에서 했던 작업을 대신 처리 해준다.
자세한 내용은 뒤에 HTTP 메시지 컨버터에서 다룬다.

**requestBodyJsonV4**
```java
    @ResponseBody
    @PostMapping("/request-body-json-v4")
    public String requestBodyJsonV4(HttpEntity<HelloData> httpEntity) {

        HelloData helloData = httpEntity.getBody();
        log.info("username={},age={}",helloData.getUsername(), helloData.getAge());

        return "ok";
    }
```
- HttpEntity도 사용 가능

**requestBodyJsonV5**
```java
    @ResponseBody
    @PostMapping("/request-body-json-v5")
    public HelloData requestBodyJsonV5(@RequestBody HelloData data) {

        log.info("username={},age={}",data.getUsername(), data.getAge());

        return data;
    }
```
- **@RequestBody 생략 불가능(@ModelAttribute 가 적용되어 버림)**
	- 응답의 경우에도 `@ResponseBody` 를 사용하면 해당 객체를 HTTP 메시지 바디에 직접 넣어줄 수 있다.
	- HttpMessageConverter 사용 -> MappingJackson2HttpMessageConverter (content-type:application/json)

- **@ResponseBody 적용**
	- 메시지 바디 정보 직접 반환(view 조회X)
	- HttpMessageConverter 사용 -> MappingJackson2HttpMessageConverter 적용(Accept:application/json)

- `@RequestBody` 요청	- JSON 요청 -> HTTP 메시지 컨버터 -> 객체
- `@ResponseBody` 응답
 	- 객체 -> HTTP 메시지 컨버터 -> JSON 응답

