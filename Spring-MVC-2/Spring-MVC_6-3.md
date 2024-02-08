## 로그인 처리하기

### 쿠기와 보안 문제
쿠키를 사용해서 로그인 ID를 전달해 로그인을 유지할 수 있었다. 여기서 문제는 다음과 같다
**문제**
- 쿠기의 값을 임의로 변경해서 다른 사용자인척 위조 할 수 있다.
- 쿠기의 정보는 노출이 쉽다.
	- 노출된 쿠키를 알아채지 못한다면 공격자는 계속 사용할 수 있다.

**대안**
- 쿠키에 중요한 값을 노출하지 않고, 사용자 별로 난수(토큰)를 생성해 노출 시킨다.
	- 서버에 토큰과 ID를 매핑해서 사용자를 인식
- 토큰을 해석할 수 없어야 한다.
- 토큰이 노출 되었을 경우 시간이 지나면 사용할 수 없도록 만료 기간을 설정

### 세션
쿠키에 중요한 정보를 담지 않고 중요한 정보는 서버에 저장해야 한다.
클라이언트와 서버는 임의의 식별자 값으로 연결해야 한다.
서버에서 중요한 정보를 보관하고 연결하는 방법을 세션이라고 한다.

**세션의 동작 과정**

<img src="/img/Spring_MVC/session1.png" alt="session1" width="600" height="300" />

1. 클라이언트가 ID와 PW를 서버에게 전송한다. (서버가 회원이 맞는지 확인)
2. 서버는 세션 DB에 세션 ID를 생성한다. (UUID로 세션 ID를 생성)
**서버와 클라이언트는 세션 ID를 쿠키로 주고 받는다.**
3. (ID와 PW가 맞다면) 서버는 로그인 성공 HTML과 쿠키(세션 ID)를 보낸다.
4. 클라이언트는 쿠키 저장소에 쿠키를(세션 ID를) 저장한다.
5. 로그인 이후, 클라이언트는 서버에 요청을 보낼 때 마다 저장한 쿠키(세션 ID)를 전달
6. 서버는 세션 저장소에 보관한 세션 정보(로그인 정보)를 사용해 요청에 응답한다.  

**세션 관리의 3가지**
- **세션 생성**
	- sessionId 생성 (임의의 추정 불가능한 랜덤 값)
	- 세션 저장소에 sessionId와 보관할 값 저장 
	- sessionId로 응답 쿠키를 생성해서 클라이언트에 전달
- **세션 조회**
	- 클라이언트가 요청한 sessionId 쿠키의 값으로, 세션 저장소에 보관한 값 조회
- **세션 만료**
	- 클라이언트가 요청한 sessionId 쿠키의 값으로, 세션 저장소에 보관한 sessionId와 값 제거

**SessionManager - 세션 관리**
```java
package hello.login.web.session;

import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionManager {
    private Map<String, Object> sessionStore = new ConcurrentHashMap<>();
    public static final String SESSION_COOKIE_NAME = "mySessionId";
    public void createSession(Object value, HttpServletResponse response){

        //세션 id를 생성하고, 값을 세션에 저장
        String sessionId = UUID.randomUUID().toString();
        sessionStore.put(sessionId, value);

        // 쿠키 생성
        Cookie mySessionCookie = new Cookie(SESSION_COOKIE_NAME, sessionId);
        response.addCookie(mySessionCookie);
    }

    public Object getSession(HttpServletRequest request){
        Cookie sessionCookie = findCookie(request, SESSION_COOKIE_NAME);
        if (sessionCookie == null){
            return null;
        }
        return sessionStore.get(sessionCookie.getValue());
    }

    // 세션 만료
    public void expire(HttpServletRequest request){
        Cookie sessionCookie = findCookie(request, SESSION_COOKIE_NAME);
        if (sessionCookie != null){
            sessionStore.remove(sessionCookie.getValue());
        }

    }


    public Cookie findCookie(HttpServletRequest request, String cookieName){
        Cookie[] cookies = request.getCookies();
        if(cookies == null){
            return null;
        }
        return Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals(cookieName))
                .findAny()
                .orElse(null);
    }
}
```
- @Component` : 스프링 빈으로 자동 등록한다.
- `ConcurrentHashMap` : `HashMap` 은 동시 요청에 안전하지 않다. 동시 요청에 안전한 `ConcurrentHashMap` 를 사용했다.

#### 이제 직접 만든 세션을 적용해 보자

**LoginController - loginV2()**
```java
@PostMapping("/login")
 	public String loginV2(@Valid @ModelAttribute LoginForm form, BindingResult
 	bindingResult, HttpServletResponse response) {
     	if (bindingResult.hasErrors()) {
         	return "login/loginForm";
}
     	Member loginMember = loginService.login(form.getLoginId(), form.getPassword());
     	log.info("login? {}", loginMember);

	if (loginMember == null) {
	bindingResult.reject("loginFail", "아이디 또는 비밀번호가 맞지 않습니다."); 
	
	return "login/loginForm";
}
	//로그인 성공 처리
	//세션 관리자를 통해 세션을 생성하고, 회원 데이터 보관 
	 sessionManager.createSession(loginMember, response);
     
	 return "redirect:/";
 }
```
- private final SessionManager sessionManager;` 주입
- `sessionManager.createSession(loginMember, response);`

LoginController - logoutV2()** 
```java
 @PostMapping("/logout")
 public String logoutV2(HttpServletRequest request) {
     sessionManager.expire(request);
     return "redirect:/";
 }
```

**HomeController - homeLoginV2()** 
```java
    @GetMapping("/")
    public String homeLoginV2(HttpServletRequest request, Model model){

        // 세션 관리자에 저장된 회원 정보 조회
        Member member = (Member)sessionManager.getSession(request);

        //로그인
        if (member == null){
            return "home";
        }
        model.addAttribute("member", member);
        return "loginHome";
    }
```- `private final SessionManager sessionManager;` 주입
- 기존 `homeLogin()` 의 `@GetMapping("/")` 주석 처리

세션 관리자에서 저장된 회원 정보를 조회한다. 만약 회원 정보가 없으면, 쿠키나 세션이 없는 것 이므로 로그인 되지 않은 것으로 처리한다.



