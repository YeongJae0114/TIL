## 스프링 MVC - 구조 이해

### 직접만든 MVC 프레임워크

<img src="/img/Spring_MVC/ControllerV5_1.png" alt="ControllerV5_1" width="500" height="300" />


### Spring MVC 구조
<img src="/img/Spring_MVC/ControllerSpring_1.png" alt="Controller" width="500" height="300" />

**직접 만든 프레임워크 스프링 MVC 비교** 

- FrontController -> DispatcherServlet 
- handlerMappingMap -> HandlerMapping MyHandlerAdapter 
- HandlerAdapter -> ModelView ModelAndView 
- viewResolver -> ViewResolver
- MyView -> View

**DispatcherServlet 구조 살펴보기**
`org.springframework.web.servlet.DispatcherServlet`
>스프링 MVC도 프론트 컨트롤러 패턴으로 구현되어 있다.
스프링 MVC의 프론트 컨트롤러가 바로 디스패처 서블릿(DispatcherServlet)이다. 그리고 이 디스패처 서블릿이 바로 스프링 MVC의 핵심이다.

**동작 순서**
1. **핸들러 조회**: 핸들러 매핑을 통해 요청 URL에 매핑된 핸들러(컨트롤러)를 조회한다.
2. **핸들러 어댑터 조회**: 핸들러를 실행할 수 있는 핸들러 어댑터를 조회한다.
3. **핸들러 어댑터 실행**: 핸들러 어댑터를 실행한다.
4. **핸들러 실행**: 핸들러 어댑터가 실제 핸들러를 실행한다.
5. **ModelAndView 반환**: 핸들러 어댑터는 핸들러가 반환하는 정보를 ModelAndView로 **변환**해서 반환한다.
6. **viewResolver 호출**: 뷰 리졸버를 찾고 실행한다.
JSP의 경우: `InternalResourceViewResolver` 가 자동 등록되고, 사용된다.
7. **View 반환**: 뷰 리졸버는 뷰의 논리 이름을 물리 이름으로 바꾸고, 렌더링 역할을 담당하는 뷰 객체를 반환한다.
JSP의 경우 `InternalResourceView(JstlView)` 를 반환하는데, 내부에 `forward()` 로직이 있다.
8. **뷰 렌더링**: 뷰를 통해서 뷰를 렌더링 한다.
