## 쿠키

브라우저 종료시 로그아웃이 되길 기대하므로, 우리에게 필요한 것은 세션 쿠키이다. 쿠키를 사용해서 로그인, 로그아웃 기능을 구현해보자


**쿠키 생성**
<img src="/img/Spring_MVC/cookie1.png" alt="cookie1" width="500" height="400" />

**클라이언트 쿠키 전달1**
<img src="/img/Spring_MVC/cookie2.png" alt="cookie2" width="500" height="400" />

**클라이언트 쿠키 전달2**
<img src="/img/Spring_MVC/cookie3.png" alt="cookie3" width="500" height="400" />

**쿠키에는 영속 쿠키와 세션 쿠키**
- 영속 쿠키: 만료 날짜를 입력하면 해당 날짜까지 유지
- 세션 쿠키: 만료 날짜를 생략하면 브라우저 종료시 까지만 유지

### 쿠키 생성
**LoginController - login() 추가**
```java
//쿠키에 시간 정보를 주지 않으면 세션 쿠키(브라우저 종료시 모두 종료)
     Cookie idCookie = new Cookie("memberId",
 String.valueOf(loginMember.getId()));
     response.addCookie(idCookie);
```
- 로그인에 성공하면 쿠키를 생성하고 `HttpServletResponse` 에 담고 
- 쿠키 이름은 `memberId` 이고, 값은 회원의 `id` 를 담아둔다. 
- 웹 브라우저는 종료 전까지 회원의 `id` 를 서버에 계속 보낸다.


### 로그인 처리
```java
package hello.login.web;

import ...

@Slf4j
@Controller
@RequiredArgsConstructor

public class HomeController {
    private final MemberRepository memberRepository;
    //@GetMapping("/")
    public String home() {
        return "home";
    }
    @GetMapping("/")
    public String homeLogin(@CookieValue(name = "memberId", required = false) Long memberId, Model model){
        if(memberId == null){
            return "home";
        }

        Member loginMember = memberRepository.findById(memberId);
        if (loginMember == null){
            return "home";
        }
        model.addAttribute("member", loginMember);
        return "loginHome";
    }
}
```
- `@CookieValue` 를 사용하면 편리하게 쿠키를 조회- 로그인 하지 않은 사용자도 홈에 접근할 수 있기 때문에 `required = false` 를 사용

### 로그아웃 기능
이번에는 로그아웃 기능을 만들어보자. 로그아웃 방법은 다음과 같다. 
- 세션 쿠키이므로 웹 브라우저 종료시
- 서버에서 해당 쿠키의 종료 날짜를 0으로 지정

**LoginController - logout 기능 추가**
```java
    @PostMapping("/logout")
    public String logout(HttpServletResponse response){
        exprieCookie(response, "memberId");
        return "redirect:/";
    }

    private static void exprieCookie(HttpServletResponse response, String cookieName) {
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
```
- 로그아웃도 응답 쿠키를 생성하는데 `Max-Age=0` 를 확인할 수 있다. 해당 쿠키는 즉시 종료된다.
