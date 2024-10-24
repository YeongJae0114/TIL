## Spring Security 기본 동작
- 클라이언트 요청은 서버 컴퓨터의 WAS의 톰캣의 필터들을 통과한 뒤 스프링 컨테이너의 컨트롤러에 도달한다
![image](https://github.com/user-attachments/assets/38936de8-b695-4b31-9ec9-9d2b152e2d1d)
- 스프링 시큐리티 의존성을 추가해 필터를 추가하면 사용자의 요청을 감시하고 통제하는 지점이 만들어 진다.
	- WAS의 필터에 있는 시큐리트 필터를 통과 할 때 클라이언트의 요청을 가로챈다.
	- 가로챈 요청은 스프링 컨테이너 내부에 구현되어 있는 스프링 Security Logic을 거치고 모두 만족한다면 다시 WAS의 다음 필터로 진행한다.

### Spring Security공식 문서

![image](https://github.com/user-attachments/assets/aa9634c1-30ef-4a4a-84f4-1f9e2c454e83)

- **DelegatingFilterProxy** : 스프링 Bean을 찾아 요청을 넘겨주는 서블릿 필터 역할
	- **서블릿 필터란?**
		- Spring MVC 애플리케이션에서는 기본적으로 서블릿을 통해 요청을 처리하는데 
		- 클라이언트가 보낸 HTTP 요청이 서블릿이나 컨트롤러에 도달하기 전에 필터를 거치게 되며
		- 응답도 클라이언트로 전달되기 전에 필터를 거칠 수 있다.
- **FilterChainProxy** :  스프링 시큐리티 의존성을 추가하면 DelegatingFilterProxy에 의해 호출되는 SecurityFilterChain들을 들고 있는 Bean
- **SecurityFilterChain** :  스프링 시큐리티 필터들의 묶음으로 실제 시큐리티 로직이 처리되는 부분, FilterChainProxy가 SecurityFilterChain들을 들고 있다.

>**Spring Security에서 프록시 안에 프록시를 사용하는 이유**
>`DelegatingFilterProxy`가 서블릿 필터의 역할을 하면서 Spring Bean을 찾아 실제 필터 로직을 위임하는 이유는 **Spring의 의존성 주입**과 같은 이점을 유지하면서 **웹 애플리케이션의 보안 구조를 확장 가능하고 유연하게 관리**할 수 있다.
>`FilterChainProxy`는 여러 `SecurityFilterChain`을 관리한다. 각 `SecurityFilterChain` 은 특정 조건에서 동작하는 필터의 묶음이다. 이렇게 필터 체인 구조를 사용함으로 하나의 애플리케이션에 여러 개의 보안 설정을 유연하게 적용할 수 있다.
>
>ex) `/api/** ` 경로에 API 보안을 적용하고 `/admin/**` 경로에는 관리자 보안을 적용하는 등 경로마다 다른 보안 정책을 적용할 수 있다.

