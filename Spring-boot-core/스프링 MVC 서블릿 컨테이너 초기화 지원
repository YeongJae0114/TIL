## 스프링 MVC 서블릿 컨테이너 초기화 지원
WebApplicationInitializer를 사용해서 블릿 컨테이너 초기화 과정은 생략하고, 애플리케이션 초기화 코드만 작성하도록 하는 코드이다.

**AppInitV3SpringMvc**
```java
package hello.container;

import hello.spring.HelloController;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRegistration;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public class AppInitV3SpringMvc implements WebApplicationInitializer {
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        System.out.println("AppInitV3SpringMvc.onStartup");

        //스프링 컨테이너 생성
        AnnotationConfigWebApplicationContext appContext = new AnnotationConfigWebApplicationContext();
        appContext.register(HelloController.class);

        //스프링 MVC 디스패처 서블릿 생성, 스프링 컨테이너 연결
        DispatcherServlet dispatcher = new DispatcherServlet(appContext);
        ServletRegistration.Dynamic servlet = servletContext.addServlet("dispatcherV3", dispatcher);

        servlet.addMapping("/");
    }
}
```
- `WebApplicationInitializer` 인터페이스를 구현한 부분을 제외하고는 이전의 `AppInitV2Spring` 과 거의 같은 코드이다.
- `WebApplicationInitializer` 는 스프링이 이미 만들어둔 애플리케이션 초기화 인터페이스이다.
- 여기서도 디스패처 서블릿을 새로 만들어서 등록하는데, 이전 코드에서는 `dispatcherV2` 라고 했고,
  - 여기서는 `dispatcherV3` 라고 해주었다. 참고로 이름이 같은 서블릿을 등록하면 오류가 발생한다.
- `servlet.addMapping("/")` 코드를 통해 모든 요청이 해당 서블릿을 타도록 했다.
  - 따라서 다음과 같이 요청하면 해당 디스패처 서블릿을 통해 `/hello-spring` 이 매핑된 컨트롤러 메 서드가 호출된다.

![image](https://github.com/user-attachments/assets/1a896952-ac43-4827-b9c2-f8fdbde81bfd)

- 현재 등록된 서블릿 다음과 같다.
  - `/` =`dispatcherV3 `
  - `/spring/*` = `dispatcherV2`
  - `/hello-servlet` = `helloServlet`
  - `/test` = `TestServlet`
  - 이런 경우 우선순위는 더 구체적인 것이 먼저 실행된다.
 
**[참고]**
- 여기서는 이해를 돕기 위해 디스패처 서블릿도 2개 만들고, 스프링 컨테이너도 2개 만들었다.
- 일반적으로는 스프링 컨테이너를 하나 만들고, 디스패처 서블릿도 하나만 만든다
  - 디스패처 서블릿 의경로 매핑도 `/` 로 해서 하나의 디스패처 서블릿을 통해서 모든것을 처리하도록 한다.   
