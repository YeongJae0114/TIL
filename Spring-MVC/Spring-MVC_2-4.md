## MVC 패턴의 한계

>컨트롤러의 역할과 뷰를 랜더링하는 역할을 명확하게 구분
그러나 중복이 많고, 필요하지 않는 코드들도 많다.

### MVC 컨트롤러의 단점

**포워드 중복**
```java
RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
dispatcher.forward(request, response);
```
- view로 이동하는 코드의 중복

**ViewPath에 중복**
```java
String viewPath = "/WEB-INF/views/save-result.jsp";
```
- 확장자가 jsp로 고정됨

**사용하지 않는 코드**
```java
HttpServletRequest request, HttpServletResponse response
```
- response를 사용하지 않을 때도 있지만 선언은 해야한다.
- 테스트 케이스를 작성하기도 어려워짐.

**공통 처리가 어렵다**
- 기능이 복잡해질 수 록 컨트롤러에서 공통으로 처리해야 할 부분이 많이 증가한다.

	-> 컨트롤러 호출 전에 공통 기능을 처리하면 된다. (컨트롤러 패턴)
  