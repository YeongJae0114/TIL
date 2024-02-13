## 로그인 처리2 - 필터, 인터셉터

### 서블릿 필터 - 인증 체크
```java
package hello.login.web.filter;

import ...

@Slf4j
public class LoginCheckFilter implements Filter {
    private static final String[] whitelist = {"/", "/members/add", "/login", "/logout", "/css/*"};
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String requestURI = httpRequest.getRequestURI();

        HttpServletResponse httpResponse = (HttpServletResponse) response;

        try {
            log.info("인증 체크 필터 시작 {}",requestURI);

            if (isLoginCheckPath(requestURI)){
                log.info("인증 체크 로직 실행 {}",requestURI);
                HttpSession session = httpRequest.getSession(false);
                if (session == null || session.getAttribute(SessionConst.LOGIN_MEMBER)==null){
                    log.info("미인증 사용자 요청 {}", requestURI);
                    httpResponse.sendRedirect("/login?redirectURI="+requestURI);
                    return;
                }
            }
        chain.doFilter(request, response);
        }catch (Exception e){
            throw e; // 예외 로깅이 가능 하지만, 톰캣까지 예외를 보내주어야 함
        }finally {
            log.info("인증 체크 필터 종료 {}", requestURI);
        }
    }

        /**
         * 화이트 리스트인 경우 체크 X
         *  **/
        private boolean isLoginCheckPath(String requestURI){
            return !PatternMatchUtils.simpleMatch(whitelist, requestURI);
        }

}
```

- `whitelist = {"/", "/members/add", "/login", "/logout","/css/*"};`
	- 인증 필터를 적용해도 홈, 회원가입, 로그인 화면, css 같은 리소스에는 접근할 수 있어야 한다. 이렇게 화이트 리스트 경로는 인증과 무관하게 항상 허용한다. 화이트 리스트를 제외한 나머지 모든 경로에는 인증체크 로직을 적용한다.

- `isLoginCheckPath(requestURI)`
	- 화이트 리스트를 제외한 모든 경우에 인증 체크 로직을 적용한다. 

- `httpResponse.sendRedirect("/login?redirectURL=" + requestURI);`
	- 미인증 사용자는 로그인 화면으로 리다이렉트 한다. 그런데 로그인 이후에 다시 홈으로 이동해버리면, 원하는 경로를 다시 찾아가야 하는 불편함이 있다. 예를 들어서 상품 관리 화면을 보려고 들어갔다가 로그인 화면으로 이동하면, 로그인 이후에 다시 상품 관리 화면으로 들어가는 것이 좋다. 이런 부분이 개발자 입장 에서는 좀 귀찮을 수 있어도 사용자 입장으로 보면 편리한 기능이다. 이러한 기능을 위해 현재 요청한 경로 인 `requestURI` 를 `/login` 에 쿼리 파라미터로 함께 전달한다. 물론 `/login` 컨트롤러에서 로그인 성 공시 해당 경로로 이동하는 기능은 추가로 개발해야 한다.
- `return;` 여기가 중요하다. 필터를 더는 진행하지 않는다. 이후 필터는 물론 서블릿, 컨트롤러가 더는 호 출되지 않는다. 앞서 `redirect` 를 사용했기 때문에 `redirect` 가 응답으로 적용되고 요청이 끝난다.

**WebConfig - loginCheckFilter() 추가**
```java
@Bean
    public FilterRegistrationBean loginCheckFilter(){
        FilterRegistrationBean<Filter> filterRegistrationBean = new FilterRegistrationBean<>();
        filterRegistrationBean.setFilter(new LoginCheckFilter());
        filterRegistrationBean.setOrder(2);
        filterRegistrationBean.addUrlPatterns("/*");

        return filterRegistrationBean;
    }
```- `setFilter(new LoginCheckFilter())` : 로그인 필터를 등록한다. 
- `setOrder(2)` : 순서를 2번으로 잡았다. 로그 필터 다음에 로그인 필터가 적용된다. 
- `addUrlPatterns("/*")` : 모든 요청에 로그인 필터를 적용한다.











