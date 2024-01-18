## 요청 매핑 헨들러 어뎁터 구조

**SpringMVC 구조**

<img src="/img/Spring_MVC/ControllerSpring_1.png" alt="ControllerSpring_1" width="500" height="300" />


<img src="/img/Spring_MVC/HandlerAdapter.png" alt="HandlerAdapter" width="500" height="300" />

**ArgumentResolver**
> 생각해보면, 애노테이션 기반의 컨트롤러는 매우 다양한 파라미터를 사용할 수 있었다.
`HttpServletRequest` , `Model` 은 물론이고, `@RequestParam` , `@ModelAttribute` 같은 애노테이션 그리고
`@RequestBody` , `HttpEntity` 같은 HTTP 메시지를 처리하는 부분까지 매우 큰 유연함을 보여주었다. 이렇게 파라미터를 유연하게 처리할 수 있는 이유가 바로 `ArgumentResolver` 덕분이다.

>애노테이션 기반 컨트롤러를 처리하는 `RequestMappingHandlerAdapter` 는 바로 이 `ArgumentResolver` 를 호출해서 컨트롤러(핸들러)가 필요로 하는 다양한 파라미터의 값(객체)을 생성한다. 그리고 이렇게 파리미터의 값이 모 두 준비되면 컨트롤러를 호출하면서 값을 넘겨준다.

**동작 방식**
>`ArgumentResolver` 의 `supportsParameter()` 를 호출해서 해당 파라미터를 지원하는지 체크하고, 지원하면 `resolveArgument()` 를 호출해서 실제 객체를 생성한다. 그리고 이렇게 생성된 객체가 컨트롤러 호출시 넘어가는
것이다. 그리고 원한다면 직접 이 인터페이스를 확장해서 원하는 `ArgumentResolver` 를 만들 수도 있다. 

**HttpMessageConverter**

<img src="/img/Spring_MVC/HttpMessageConverter.png" alt="HandlerAdapter" width="500" height="300" />

HTTP 메시지 컨버터를 사용하는 `@RequestBody` 도 컨트롤러가 필요로 하는 파라미터의 값에 사용된다.
`@ResponseBody` 의 경우도 컨트롤러의 반환 값을 이용한다.

**요청의 경우** 
- `@RequestBody` 를 처리하는 `ArgumentResolver` 가 있고, `HttpEntity` 를 처리하는 `ArgumentResolver` 가 있다. 이 `ArgumentResolver` 들이 HTTP 메시지 컨버터를 사용해서 필요한 객체를 생성 하는 것이다. 

**응답의 경우** 
- `@ResponseBody` 와 `HttpEntity` 를 처리하는 `ReturnValueHandler` 가 있다. 그리고 여기에서 HTTP 메시지 컨버터를 호출해서 응답 결과를 만든다.
스프링 MVC는 `@RequestBody` `@ResponseBody` 가 있으면 `RequestResponseBodyMethodProcessor()` `HttpEntity` 가 있으면 `HttpEntityMethodProcessor()` 를 사용한다.

