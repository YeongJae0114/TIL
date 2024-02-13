## 로그인 처리2 - 필터, 인터셉터

### 서블릿 필터
**공통 관심 사항(cross-cutting concern)**
- 로그인 하지 않은 사용자에게 상품 관리 페이지를 보여주지 않게 해야한다(url로 직접 호출 시). 
	- 웹과 관련된 공통 관심사를 처리 할 때는 HTTP의 헤더나 URL 정보들이 필요

**필터의 흐름**
```text
Http 요청 -> WAS -> 필터 -> 서블릿 -> 컨트롤러
```
- 필터를 적용하면 서블릿 보다 필터가 더 먼저 호출 된다.
- 필터를 사용해 원하는 요청에 필터를 적용시키고 컨틀롤러를 호출한다.

**필터 제한**
```text
Http 요청 -> WAS -> 필터 -> 서블릿 -> 컨트롤러 // 로그인 사용자
Http 요청 -> WAS -> 필터 (서블릿 호출 X) // 비 로그인 사용자
```
- 필터를 적용해 조건에 맞지 않는 호출이라면, 서블릿 호출 X

** 필터 인터페이스**
```java
public interface Filter {
     public default void init(FilterConfig filterConfig) throws ServletException{}

     public void doFilter(ServletRequest request, ServletResponse response,
             FilterChain chain) throws IOException, ServletException;

     public default void destroy() {}
}
```
- 필터 인터페이스를 구현하고 등록하면 서블릿 컨테이너가 필터를 싱글톤 객체로 생성하고, 관리한다. 
	- `init():` 필터 초기화 메서드, 서블릿 컨테이너가 생성될 때 호출된다.
	- `doFilter():` 고객의 요청이 올 때 마다 해당 메서드가 호출된다. 필터의 로직을 구현하면 된다. 
	- `destroy():` 필터 종료 메서드, 서블릿 컨테이너가 종료될 때 호출된다.











