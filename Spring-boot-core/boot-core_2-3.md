## 스프링 컨테이너 등록
**WAS와 스프링 통합**
- 스프링 컨테이너 만들기
- 스프링 MVC 컨트롤러를 스프링 컨테이너 빈으로 등록
- 스프링 MVC를 사용하는데 필요한 디스패처 서블릿을 서블릿 컨테이너 등록
  
![image](https://github.com/user-attachments/assets/dd9d5b82-5dca-4e41-b455-53c1251b1cdb)

**의존성 추가**
`implementation 'org.springframework:spring-webmvc:6.0.4`

**HelloController**
```java
package hello.spring;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/hello-spring")
    public String hello(){
        System.out.println("HelloController.hello");
        return "hello spring!";
    }
}
```
- 실행하면 HTTP 응답으로 `hello spring!` 이라는 메시지를 반환


**HelloConfig**
```java
package hello.spring;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HelloConfig {
    @Bean
    public HelloController helloController(){
        return new HelloController();
    }
}
```
- 컨트롤러를 스프링 빈으로 직접 등록한다. 참고로 여기서는 컴포넌트 스캔을 사용하지 않고 빈을 직접 등록했다.


**AppInitV2Spring**
```java
package hello.container;

import hello.spring.HelloController;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletRegistration;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public class AppInitV2Spring implements AppInit{
    @Override
    public void onStartup(ServletContext servletContext) {
        System.out.println("AppInitV2Spring.onStartup");

        //스프링 컨테이너 생성
        AnnotationConfigWebApplicationContext appContext = new AnnotationConfigWebApplicationContext();
        appContext.register(HelloController.class);

        //스프링 MVC 디스패처 서블릿 생성, 스프링 컨테이너 연결
        DispatcherServlet dispatcher = new DispatcherServlet(appContext);
        ServletRegistration.Dynamic servlet = servletContext.addServlet("dispatcherV2", dispatcher);

        servlet.addMapping("/spring/*");
    }
}
```
- AppInitV2Spring` 는 `AppInit` 을 구현했다. `AppInit` 을 구현하면 애플리케이션 초기화 코드가 자동 으로 실행된다. 앞서 `MyContainerInitV2` 에 관련 작업을 이미 해두었다.

![image](https://github.com/user-attachments/assets/14883bf3-aa87-4565-9be8-35bd1dd976ba)

1. **스프링 컨테이너 생성**
  - `AnnotationConfigWebApplicationContext` : 스프링 컨테이너 생성기능 제공
  - `appContext.register(HelloConfig.class)`
    - 컨테이너에 스프링 설정을 추가
     
2. **스프링 MVC 디스패처 서블릿 생성, 스프링 컨테이너 연결**
  - `new DispatcherServlet(appContext)` : 디스패처 서블릿 생성
  - 생성자에 앞서 만든 스프링 컨테이너를 전달 : `DispatcherServlet dispatcher = new DispatcherServlet(appContext);`
  - 이 디스패처 서블릿에 HTTP 요청이 오면 디스패처 서블릿은 해당 스프링 컨테이너에 들어있는 컨트롤러 빈들을 호출

3. **디스패처 서블릿을 서블릿 컨테이너에 등록**
  -  디스패처 서블릿을 서블릿 컨테이너에 등록 : `servletContext.addServlet("dispatcherV2", dispatcher);`
- `/spring/*` 요청이 디스패처 서블릿을 통하도록 설정
  - `/spring/*` 이렇게 경로를 지정하면 `/spring` 과 그 하위 요청은 모두 해당 서블릿을 통하게 된다.
    - `/spring/hello-spring`
    - `/spring/hello/go`
