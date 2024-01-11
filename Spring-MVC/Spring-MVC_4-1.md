## 핸들러 매핑, 핸들러 어댑터, 뷰 리졸버

## Controller 인터페이스
**과거 버전 스프링 컨트롤러**
```java
 public interface Controller {
     ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse
 response) throws Exception;
 }
```


**OldController**
```java
package hello.servlet.web.springmvc.old;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

@Component("/springmvc/old-controller")
public class OldContrloller implements Controller {
    @Override
    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
        System.out.println("OldContrloller.handleRequest");
        return null;
    }
}

```
- `@Component` : 이 컨트롤러는 `/springmvc/old-controller` 라는 이름의 스프링 빈으로 등록
- **빈의 이름으로 URL을 매핑**

> ``OldController``가 어떻게 호출 되었을까?
<img src="/img/Spring_MVC/ControllerSpring_1.png" alt="Controller" width="500" height="300" />

- **HandlerMapping(핸들러 매핑)**
	- 핸들러 매핑에서 이 컨트롤러를 찾을 수 있어야 한다
	- 스프링 빈의 이름으로 핸들러를 찾을 수 있는 핸들러 매핑이 필요
- **HandlerAdapter(핸들러 어댑터)**
	- 핸들러 매핑을 통해서 찾은 핸들러를 실행할 수 있는 핸들러 어댑터가 필요.
	- `Controller` 인터페이스를 실행할 수 있는 핸들러 어댑터를 찾고 실행.

> 스프링은 이미 필요한 핸들러 매핑과 핸들러 어댑터를 대부분 구현해두었다. 개발자가 직접 핸들러 매핑과 핸들러 어댑 터를 만드는 일은 거의 없다.

**HandlerMapping** 
```
 0 = RequestMappingHandlerMapping : 애노테이션 기반의 컨트롤러인 @RequestMapping에서 사용 : 스프링 빈의 이름으로 핸들러를 찾는다.
 1 = BeanNameUrlHandlerMapping
```

**HandlerAdapter** 
```
 0 = RequestMappingHandlerAdapter : 애노테이션 기반의 컨트롤러인 @RequestMapping에서 사용 
 1 = HttpRequestHandlerAdapter : HttpRequestHandler 처리
 2 = SimpleControllerHandlerAdapter : Controller 인터페이스(애노테이션X, 과거에 사용) 처리
```- 핸들러 매핑도, 핸들러 어댑터도 모두 순서대로 찾고 만약 없으면 다음 순서로 넘어간다.

**1. 핸들러 매핑으로 핸들러 조회**
1. `HandlerMapping` 을 순서대로 실행해서, 핸들러를 찾는다.
2. 이경우빈이름으로핸들러를찾아야하기때문에이름그대로빈이름으로핸들러를찾아주는
`BeanNameUrlHandlerMapping` 가 실행에 성공하고 핸들러인 `OldController` 를 반환한다.

**2. 핸들러 어댑터 조회**
1. `HandlerAdapter` 의 `supports()` 를 순서대로 호출한다.
2. `SimpleControllerHandlerAdapter` 가 `Controller` 인터페이스를 지원하므로 대상이 된다.

**3. 핸들러 어댑터 실행**
1. 디스패처 서블릿이 조회한 `SimpleControllerHandlerAdapter` 를 실행하면서 핸들러 정보도 함께 넘겨준
다.
2. `SimpleControllerHandlerAdapter` 는 핸들러인 `OldController` 를 내부에서 실행하고, 그 결과를 반
환한다.

**정리 - OldController 핸들러매핑, 어댑터**
`OldController` 를 실행하면서 사용된 객체는 다음과 같다. 
`HandlerMapping = BeanNameUrlHandlerMapping`
`HandlerAdapter = SimpleControllerHandlerAdapter`


### HttpRequestHandler
- **서블릿과 가장 유사한 형태**의 핸들러
** HttpRequestHandleR**
```java
public interface HttpRequestHandler {
	void handleRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException;

}
```

** MyhttpRequestHandle**
```java
package hello.servlet.web.springmvc.old;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.HttpRequestHandler;

import java.io.IOException;


@Component("/springmvc/request-handler")
public class MyhttpRequestHandler implements HttpRequestHandler {
    @Override
    public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("MyhttpRequestHandler.handleRequest");
    }
}

```
**1. 핸들러 매핑으로 핸들러 조회**
1. `HandlerMapping` 을 순서대로 실행해서, 핸들러를 찾는다.
2. 이경우빈이름으로핸들러를찾아야하기때문에이름그대로빈이름으로핸들러를찾아주는
`BeanNameUrlHandlerMapping` 가 실행에 성공하고 핸들러인 `MyHttpRequestHandler` 를 반환한다.

**2. 핸들러 어댑터 조회**
1. `HandlerAdapter` 의 `supports()` 를 순서대로 호출한다.
2. `HttpRequestHandlerAdapter` 가 `HttpRequestHandler` 인터페이스를 지원하므로 대상이 된다.

**3. 핸들러 어댑터 실행**
1. 디스패처 서블릿이 조회한 `HttpRequestHandlerAdapter` 를 실행하면서 핸들러 정보도 함께 넘겨준다.
2. `HttpRequestHandlerAdapter` 는 핸들러인 `MyHttpRequestHandler` 를 내부에서 실행하고, 그 결과를 반환한다.

**정리 - MyHttpRequestHandler 핸들러매핑, 어댑터** `MyHttpRequestHandler` 를 실행하면서 사용된 객체는 다음과 같다. `HandlerMapping = BeanNameUrlHandlerMapping` `HandlerAdapter = HttpRequestHandlerAdapter`

> **@RequestMapping**
가장 우선순위가 높은 핸들러 매핑과 핸들러 어댑터는 `RequestMappingHandlerMapping` ,
`RequestMappingHandlerAdapter` 이다. `@RequestMapping` 의 앞글자를 따서 만든 이름인데, 이것이 바로 지금 스프링에서 주로 사용하는 애노테이션 기반의 컨트롤러를 지원하는 매핑과 어댑터이다. 실무에서는 99.9% 이 방식의 컨트롤러를 사용한다.


### 뷰 리졸버

**OldController - View 조회할 수 있도록 변경**
```java
package hello.servlet.web.springmvc.old;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

@Component("/springmvc/old-controller")
public class OldContrloller implements Controller {
    @Override
    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
        System.out.println("OldContrloller.handleRequest");
        return new ModelAndView("new-form");
    }
}
```
- View를 사용할 수 있도록 다음 코드를 추가했다. `return new ModelAndView("new-form");`


**`application.properties` 에 다음 코드를 추가**
```
 spring.mvc.view.prefix=/WEB-INF/views/
 spring.mvc.view.suffix=.jsp
```

**1. 핸들러 어댑터 호출**
핸들러 어댑터를 통해 `new-form` 이라는 논리 뷰 이름을 획득한다.

**2. ViewResolver 호출**
- `new-form` 이라는 뷰 이름으로 viewResolver를 순서대로 호출한다.
- `BeanNameViewResolver` 는 `new-form` 이라는 이름의 스프링 빈으로 등록된 뷰를 찾아야 하는데 없다. 
- `InternalResourceViewResolver` 가 호출된다.

**3. InternalResourceViewResolver**
이 뷰 리졸버는 `InternalResourceView` 를 반환한다.

**4. 뷰 - InternalResourceView**
`InternalResourceView` 는 JSP처럼 포워드 `forward()` 를 호출해서 처리할 수 있는 경우에 사용한다.

**5. view.render()**
`view.render()` 가 호출되고 `InternalResourceView` 는 `forward()` 를 사용해서 JSP를 실행한다.




