## 서블릿 컨테이너 초기화
- 서블릿은 `ServletContainerInitializer` 라는 초기화 인터페이스를 제공한다
- 서블릿 컨테이너를 초기화 하는 기능


**ServletContainerInitializer-interface**
```java
package jakarta.servlet;

import java.util.Set;

public interface ServletContainerInitializer {
    void onStartup(Set<Class<?>> var1, ServletContext var2) throws ServletException;
}
```

- `Set<Class<?>> c` : 조금 더 유연한 초기화를 기능을 제공한다. `@HandlesTypes` 애노테이션과 함께 사용한다. 이후에 코드로 설명한다.
- `ServletContext ctx` : 서블릿 컨테이너 자체의 기능을 제공한다. 이 객체를 통해 필터나 서블릿을 등 록할 수 있다.

**MyContainerInitV1**
```java
package hello.container;

import jakarta.servlet.ServletContainerInitializer;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;

import java.util.Set;

public class MyContainerInitV1 implements ServletContainerInitializer {
    @Override
    public void onStartup(Set<Class<?>> set, ServletContext servletContext) throws ServletException {
        System.out.println("MyContainerInitV1.onStartup");
        System.out.println("c = " + set);
        System.out.println("servletContext = " + servletContext);
    }
}
```

**[주의]다음 경로에 WAS에게 실행할 초기화 클래스를 입력한다**
<img width="769" alt="image" src="https://github.com/user-attachments/assets/5a3187eb-4b79-476e-9246-3b555c8ef001">

**HelloServlet**
```java
package hello.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class HelloServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws  IOException {
        System.out.println("HelloServlet.service");
        resp.getWriter().println("hello servlet!");
    }
}
```
- 이 서블릿을 등록하고 실행하면 다음과 같은 결과가 나온다. 다음 내용을 통해서 서블릿을 등록해보자.
- 로그: `HelloServlet.service`
- HTTP 응답: `hello servlet!`


**AppInit-애플리케이션 초기화**
```java
package hello.container;

import jakarta.servlet.ServletContext;

public interface AppInit {
    void onStartup(ServletContext servletContext);
}
```
- 애플리케이션 초기화를 진행하려면 먼저 인터페이스를 만들어야 한다. 내용과 형식은 상관없고, 인터페이스 는 꼭 필요하다. 예제 진행을 위해서 여기서는 `AppInit` 인터페이스를 만들자.

**AppInitV1Servlet**
```java
package hello.container;

import hello.servlet.HelloServlet;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletRegistration;

public class AppInitV1Servlet implements AppInit {
    @Override
    public void onStartup(ServletContext servletContext) {
        System.out.println("AppInitV1Servlet.onStartup");

        ServletRegistration.Dynamic helloServlet =
                servletContext.addServlet("helloServlet", new HelloServlet());
        helloServlet.addMapping("/hello-servlet");
    }
}
```
- 여기서는 프로그래밍 방식으로 `HelloServlet` 서블릿을 서블릿 컨테이너에 직접 등록한다.
- HTTP로 `/hello-servlet` 를 호출하면 `HelloServlet` 서블릿이 실행된다.


**서블릿을 등록하는 2가지 방법** 
1. `@WebServlet` 애노테이션
2. 프로그래밍 방식


**MyContainerInitV2**
```java
package hello.container;

import jakarta.servlet.ServletContainerInitializer;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.HandlesTypes;

import java.util.Set;

@HandlesTypes({AppInit.class})
public class MyContainerInitV2 implements ServletContainerInitializer {
    @Override
    public void onStartup(Set<Class<?>> set, ServletContext servletContext) throws ServletException {
        System.out.println("MyContainerInitV2.onStartup");
        System.out.println("c = " + set);
        System.out.println("servletContext = " + servletContext);

        //class hello.container.AppInitV1Servlet
        for (Class<?> appInitClass : set) {
            try {
                AppInit appInit = (AppInit) appInitClass.getDeclaredConstructor().newInstance();
                appInit.onStartup(servletContext);
            }catch (Exception e){
                throw new RuntimeException(e);
            }
        }
    }
}
```
**애플리케이션 초기화 과정**
- 1. `@HandlesTypes` 애노테이션에 애플리케이션 초기화 인터페이스를 지정한다.
  - 여기서는 앞서 만든 `AppInit.class` 인터페이스를 지정했다.
- 2. 서블릿 컨테이너 초기화( `ServletContainerInitializer` )는 파라미터로 넘어오는
  - `Set<Class<?>> c` 에 애플리케이션 초기화 인터페이스의 구현체들을 모두 찾아서 클래스 정보로 전달 한다.
  - 여기서는 `@HandlesTypes(AppInit.class)` 를 지정했으므로 `AppInit.class` 의 구현체인 `AppInitV1Servlet.class` 정보가 전달된다.
  - 참고로 객체 인스턴스가 아니라 클래스 정보를 전달하기 때문에 실행하려면 객체를 생성해서 사용해야 한다.
- 3. `appInitClass.getDeclaredConstructor().newInstance()`
  - 리플렉션을 사용해서 객체를 생성한다. 참고로 이 코드는 `new AppInitV1Servlet()` 과 같다 생각하면 된다.
- 4. `appInit.onStartup(ctx)`
  - 애플리케이션 초기화 코드를 직접 실행하면서 서블릿 컨테이너 정보가 담긴 `ctx` 도 함께 전달한다.

## 정리
<img width="642" alt="image" src="https://github.com/user-attachments/assets/2c8618d6-52a4-42f4-a8d3-2a80c76b05e1">


- 1. 웹 어플리케이션 서버가 뜰 때 먼저 이 ServletContainer 초기화가 일어난다.
  - `resources/META-INF/services/ jakarta.servlet.ServletContainerInitializer`에 등록된 
  - `ServletContainerInitializer`을 구현한 구현체들로 초기화한다.
- 2. `MyContainerInitV2` 가 실행된다. 
  - `MyContainerInitV2` : `ServletContainerInitializer`을 구현한 구현체
- 3. (2.) 이때 `@HandlesTypes`가 있으면 이 인터페이스의 구현체를 찾아 `MyContainerInitV2`에 정보를 넘겨 준다.



