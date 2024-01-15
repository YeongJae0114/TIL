## 요청 매핑
**MappingController**
```java
package hello.springmvc.basic.requestmapping;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
public class MappingController {
    private Logger log = LoggerFactory.getLogger(getClass());

    @RequestMapping(value = "/hello-basic", method = RequestMethod.GET)
    public String helloBasic(){
        log.info("hello basic");
        return "ok";
    }
}

```
**기본 요청**
- 둘다 허용 /hello-basic, /hello-basic/
- HTTP 메서드 모두 허용 GET, HEAD, POST, PUT, PATCH, DELETE 
**매핑 정보**
- @RestController`
	- `@Controller` 는 반환 값이 `String` 이면 뷰 이름으로 인식된다. 그래서 **뷰를 찾고 뷰가 랜더링** 된다.
	- `@RestController` 는 반환 값으로 뷰를 찾는 것이 아니라, **HTTP 메시지 바디에 바로 입력**한다. 따라서 실행 결과로 ok 메세지를 받을 수 있다.
- `@RequestMapping("/hello-basic")`
	- `/hello-basic` URL 호출이 오면 이 메서드가 실행되도록 매핑한다.
	- 대부분의 속성을 `배열[]` 로 제공하므로 다중 설정이 가능하다. `{"/hello-basic", "/hello-go"}`

**HTTP 메서드 매핑**
```java
    @RequestMapping(value = "/mapping-get-v1", method = RequestMethod.GET)
    public String mappingGetV1() {
        log.info("mappingGetV1");
        return "ok";
    }
```
* method 특정 HTTP 메서드 요청만 허용
* GET, HEAD, POST, PUT, PATCH, DELETE

**HTTP 메서드 매핑 축약**
```java
    @GetMapping(value = "/mapping-get-v2")
    public String mappingGetV2() {
        log.info("mapping-get-v2");
        return "ok";
    }
```
**편리한 축약 애노테이션**
* @GetMapping
* @PostMapping
* @PutMapping
* @DeleteMapping
* @PatchMapping


**PathVariable(경로 변수) 사용**
```java
    @GetMapping("/mapping/{userId}")
    public String mappingPath(@PathVariable("userId") String data){
        log.info("mapping userId = {}", data);
        return "ok";
    }
```
* PathVariable 사용
* 변수명이 같으면 생략 가능
* @PathVariable("userId") String userId -> @PathVariable String userId

**PathVariable 사용 - 다중**
```java
    @GetMapping("/mapping/users/{userId}/orders/{orderId}")
    public String mappingPath(@PathVariable("userId") String userId, @PathVariable("orderId") String orderId){
        log.info("mapping userId = {}, mapping orderId = {}",userId, orderId );
        return "ok";
    }
```
* PathVariable 사용 다중


**특정 파라미터 조건 매핑**
```java
    @GetMapping(value = "/mapping-param", params = "mode=debug")
    public String mappingParam() {
        log.info("mappingParam");
        return "ok";
    }
```
- 특정 파라미터가 있거나 없는 조건을 추가할 수 있다. 잘 사용하지는 않는다.

**파라미터로 추가 매핑**
* params="mode",
* params="!mode"
* params="mode=debug"
* params="mode!=debug" (! = )
* params = {"mode=debug","data=good"}

**특정 헤더 조건 매핑**
```java
    @GetMapping(value = "/mapping-header", headers = "mode=debug")
    public String mappingHeader() {
        log.info("mappingHeader");
        return "ok";
    }
```
**특정 헤더로 추가 매핑**
* headers="mode",
* headers="!mode"
* headers="mode=debug"
* headers="mode!=debug" (! = )

**미디어 타입 조건 매핑 - HTTP 요청 Content-Type, consume**
```java
    @PostMapping(value = "/mapping-consume", consumes = "application/json")
    public String mappingConsumes() {
        log.info("mappingConsumes");
        return "ok";
    }
```

**Content-Type 헤더 기반 추가 매핑 Media Type**
* consumes="application/json"
* consumes="!application/json"
* consumes="application/*"
* consumes="*\/*"
* MediaType.APPLICATION_JSON_VALUE


**미디어 타입 조건 매핑 - HTTP 요청 Accept, produce**
```java
    @PostMapping(value = "/mapping-produce", produces = "text/html")
    public String mappingProduces() {
        log.info("mappingProduces");
        return "ok";
    }
```
**Accept 헤더 기반 Media Type**
* produces = "text/html"
* produces = "!text/html"
* produces = "text/*"
* produces = "*\/*"