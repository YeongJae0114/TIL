## 스프링 웹 개발 기초

### 정적 컨텐츠
- 정적 컨텐츠 
- static 폴더내의 html 파일을 localhost/[폴더명]을 통해서 접근 가능 
	- localhost/[폴더명]을 통해서 접근하면 [폴더명]을 가지고 스프링 컨테이너가 컨트롤러를 우선적으로 탐색
	- static 폴더내의 html 파일은 컨트롤러가 아니기 때문에 컨트롤러 탐색 후 static 폴더에 있는 html 파일 반환
	- http://127.0.0.1:8080/hello-static.html 으로 접근이 가능
### MVC와 템플릿 엔진
- MVC : Model, View, Controller
- 스프링의 동작 방식

#### Controller
- 요청에 따라 어떤 처리를 할지 결정해주는 로직
- 서비스를 담당 
```java
package hello.hellospring.controller;
import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HelloController {
    @GetMapping("hello")
    public String hello(Model model){
        model.addAttribute("data", "hello!!");
        return "hello";
    }
// 추가된 controller
    @GetMapping("hello-mvc")
    public  String helloMvc(@RequestParam("name") String name, Model model){
        model.addAttribute("name",name);
        return "hello-template";
    }

}
```
- http://localhost:8080/hello-mvc 로 접근하면 에러 발생(name에 값을 정해주지 않았기 때문에)  
- http://localhost:8080/hello-mvc?name=spring!!! 로 접근
- mvc패턴으로 html을 내려주는 방식

#### View 
- 화면에 관련된 로직
```java
 <html xmlns:th="http://www.thymeleaf.org">
 <body>
 <p th:text="'hello ' + ${name}">hello! empty</p>
 </body>
</html>
```

#### Model
- 모델에 원하는 속성과 그것에 대한 값을 주어 뷰에 데어터를 전달한다.
- 컨트롤러에서 생성된 데이터를 담아서 전달하는 역할 

### API 방식
- **@ResponseBody 문자 반환**
```java
package hello.hellospring.controller;
import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HelloController {
    @GetMapping("hello")
    public String hello(Model model){
        model.addAttribute("data", "hello!!");
        return "hello";
    }
    @GetMapping("hello-mvc")
    public  String helloMvc(@RequestParam("name") String name, Model model){
        model.addAttribute("name",name);
        return "hello-template";
    }
	// 추가된 코드
    @GetMapping("hello-api")
    @ResponseBody
    public Hello helloApi(@RequestParam("name") String name, Model model){
        Hello hello = new Hello();
        hello.setName(name);
        return hello;
    }
    static class Hello{
        private String name;

        public String getName(){
            return name;
        }
        public void setName(String name){
            this.name =name;
        }

    }
}

```
- http://localhost:8080/hello-api?name=spring로 접근
- json 형태(key:value)로 반환



