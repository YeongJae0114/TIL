## API 예외 처리

HTML 페이지의 경우 지금까지 설명했던 것 처럼 4xx, 5xx와 같은 오류 페이지만 있으면 대부분의 문제를 해결할 수 있다.

하지만 API 요청의 경우 각 오류 상황에 맞는 오류 응답 스펙을 정하고, JSON으로 데이터를 내려주어야 한다.
HTML 페이지를 응답을 해봤자 웹 브라우저가 아닌 이상 할수 있는 것은 별로 없기 때문이다. 

### 직접 처리
**ErrorPageController - API 응답 추가**
```java
    @RequestMapping(value = "/error-page/500", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String , Object>>errorPage500Api(
            HttpServletRequest request, HttpServletResponse response){

        log.info("API errorPage 500");

        Map<String, Object> result = new HashMap<>();
        Exception ex = (Exception) request.getAttribute(ERROR_EXCEPTION);
        result.put("status", request.getAttribute(ERROR_STATUS_CODE));
        result.put("message",ex.getMessage());

        Integer statusCode = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        return new ResponseEntity<>(result, HttpStatus.valueOf(statusCode));
    }
```
- `produces = MediaType.APPLICATION_JSON_VALUE)` : 클라이언트가 요청하는 HTTP Header의 `Accept` 의 값이 `application/json` 일 때 해당 메서드가 호출

### API 예외 처리 - 스프링 부트 기본 오류 처리
API 예외 처리도 스프링 부트가 제공하는 기본 오류 방식을 사용할 수 있다.
스프링 부트가 제공하는 `BasicErrorController` 코드를 보자.


```java
@Controller
@RequestMapping({"${server.error.path:${error.path:/error}}"})
	public class BasicErrorController extends AbstractErrorController {

	@RequestMapping(produces = MediaType.TEXT_HTML_VALUE)
		public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response){}
	
	@RequestMapping
 		public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {}
	}
```
- `@RequestMapping({"${server.error.path:${error.path:/error}}"})` : 스프링 부트의 기본 설정은 오류 발생시 `/error` 를 오류 페이지로 요청
- errorHtml()` : `produces = MediaType.TEXT_HTML_VALUE` : 클라이언트 요청의 Accept 해더 값이 `text/html` 인 경우에는 `errorHtml()` 을 호출해서 view를 제공한다.
- `error()` : 그외 경우에 호출되고 `ResponseEntity` 로 HTTP Body에 JSON 데이터를 반환한다.

### Html 페이지 vs API 오류
**Html 페이지에서 BasicErrorController**
- 스프링 부트가 제공하는 `BasicErrorController` 는 HTML 페이지를 제공하는 경우에는 매우 편리
- 이 방법 은 HTML 화면을 처리할 때 사용(404, 500 등)

**API 오류에서 BasicErrorController**
- API 오류 처리는 다른 차원의 이야기이다. API 마다, 각각의 컨트롤러나 예외마 다 서로 다른 응답 결과를 출력해야 할 수도 있다.


