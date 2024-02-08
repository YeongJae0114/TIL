## 로그인 처리하기
세션이라는 개념은 대부분의 웹 애플리케이션에 필요한 것이다. 어쩌면 웹이 등장하면서 부터 나온 문제이다. 서블릿은 세션을 위해 `HttpSession` 이라는 기능을 제공하는데, 지금까지 나온 문제들을 해결해준다. 우리가 직접 구현한 세션의 개념이 이미 구현되어 있고, 더 잘 구현되어 있다.

### 서블릿 HTTP 세션1
HttpSession 사용 : 서블릿이 제공하는 `HttpSession` 을 사용하도록 개발해보자.

**SessionConst**
```java
	package hello.login.web;

	public class SessionConst {
		public static final String LOGIN_MEMBER = "loginMember";
}
```
- `HttpSession` 에 데이터를 보관하고 조회할 때, 같은 이름이 중복 되어 사용되므로, 상수를 하나 정의했다.


**LoginController - loginV3()**
```java
    @PostMapping("/login")
    public String loginV3(@Valid @ModelAttribute LoginForm form, BindingResult bindingResult, HttpServletRequest request){
        if(bindingResult.hasErrors()){
            return "login/loginForm";
        }
        Member loginMember = loginService.login(form.getLoginId(), form.getPassword());

        if(loginMember == null){
            bindingResult.reject("loginFail","아이디 또는 비밀번호가 맞지 않습니다.");
            return "login/loginForm";
        }
        // 로그인 성공 처리 TODO
        // 세션이 있으면 있는 세션을 반환, 없으면 신규 세션을 반환 : request.getSession();
        HttpSession session = request.getSession();
        //세션에 로그인 회원 정보를 보관
        session.setAttribute(SessionConst.LOGIN_MEMBER, loginMember);

        return "redirect:/";
    }
```
**세션 생성과 조회**
세션을 생성하려면 `request.getSession(true)` 를 사용하면 된다.
`public HttpSession getSession(boolean create);`

세션의 `create` 옵션에 대해 알아보자. 
- `request.getSession(true)`
	- 세션이 있으면 기존 세션을 반환한다.
	- 세션이 없으면 새로운 세션을 생성해서 반환한다. 
- `request.getSession(false)`
	- 세션이 있으면 기존 세션을 반환한다.
	- 세션이 없으면 새로운 세션을 생성하지 않는다. `null` 을 반환한다.
- `request.getSession()` : 신규 세션을 생성하는 `request.getSession(true)` 와 동일하다.

**세션에 로그인 회원 정보 보관** 
- `session.setAttribute(SessionConst.LOGIN_MEMBER, loginMember);`
	- 세션에 데이터를 보관하는 방법은 `request.setAttribute(..)` 와 비슷하다. 하나의 세션에 여러 값을 저장할 수 있다.

**LoginController - logoutV3()**
```java
    @PostMapping("/logout")
    public String logoutV3(HttpServletRequest request){
        HttpSession session = request.getSession(false);
        if (session != null){
            session.invalidate();
        }
        return "redirect:/";
    }
```
- `session.invalidate()` : 세션을 제거한다.
**HomeController - homeLoginV3()**
```java
    @GetMapping("/")
    public String homeLoginV3(HttpServletRequest request, Model model){

        HttpSession session = request.getSession(false);
        if (session == null){
            return "home";
        }

        Member loginMember = (Member)session.getAttribute(SessionConst.LOGIN_MEMBER);
        // 세션 관리자에 저장된 회원 정보 조회

        //세션에 회원 데이터가 없으면 home
        if (loginMember == null){
            return "home";
        }

        //세션이 유지되면 로그인으로 이동
        model.addAttribute("member", loginMember);
        return "loginHome";
    }
```
- `request.getSession(false)` : `request.getSession()` 를 사용하면 기본 값이 `create:true` 이므로, 로그인 하지 않을 사용자도 의미없는 세션이 만들어진다. 따라서 세션을 찾아서 사용하는 시점에는 `create: false` 옵션을 사용해서 세션을 생성하지 않아야 한다.

- `session.getAttribute(SessionConst.LOGIN_MEMBER)` : 로그인 시점에 세션에 보관한 회원 객 체를 찾는다.

### 서블릿 HTTP 세션2
#### @SessionAttribute
스프링은 세션을 더 편리하게 사용할 수 있도록 `@SessionAttribute` 을 지원한다.

이미 로그인 된 사용자를 찾을 때는 다음과 같이 사용하면 된다. 참고로 이 기능은 세션을 생성하지 않는다.
`@SessionAttribute(name = "loginMember", required = false) Member loginMember`


**HomeController - homeLoginV3Spring()**
```java
    @GetMapping("/")
    public String homeLoginV3Spring(
            @SessionAttribute(name = SessionConst.LOGIN_MEMBER, required = false)Member loginMember, Model model){
        //세션에 회원 데이터가 없으면 home
        if (loginMember == null){
            return "home";
        }

        //세션이 유지되면 로그인으로 이동
        model.addAttribute("member", loginMember);
        return "loginHome";
    }
```
- 여러가지 번거로운 과정을 스프링이 한번에 처리

### 세션 타임아웃 설정
>세션은 사용자가 로그아웃을 직접 호출해서 `session.invalidate()` 가 호출 되는 경우에 삭제된다. 그런데 대부분 의 사용자는 로그아웃을 선택하지 않고, 그냥 웹 브라우저를 종료한다. 문제는 HTTP가 비 연결성(ConnectionLess) 이므로 서버 입장에서는 해당 사용자가 웹 브라우저를 종료한 것인지 아닌지를 인식할 수 없다. 따라서 서버에서 세션 데이터를 언제 삭제해야 하는지 판단하기가 어렵다.


`application.properties`
```java
server.servlet.session.timeout=60s // 60초로 설정 (분 단위로 적용시켜야함)
```

