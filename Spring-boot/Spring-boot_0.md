## 사용한 Java 환경
  - JDK 17

### Spring boot version
  - Project : Gradle-Groovy
  - Language : Java
  - Spring Boot : 3.2.0

#### Add Dependencies
  - Spring Web
  - Thymeleaf 

#### IntelliJ Gradle 대신에 자바 직접 실행
  - 최근 IntelliJ 버전은 Gradle을 통해서 실행 하는 것이 기본 설정이다. 이렇게 하면 실행속도가 느리다. 다음과 같이 변경하면 자바로 바로 실행해서 실행속도가 더 빠르다.

## Spring Boot란?
  **정의**
  - 엔터프라이즈용 Java 애플리케이션 개발을 편하게 할 수 있게 해주는 오픈소스 경량급 애플리케이션 프레임워크
  - 간단한 설정과 구성을 통해 스프링 애플리케이션의 개발을 빠르게 시작할 수 있도록 도와주는 프로젝트

## View 환경설정

**Welcome Page 만들기**
  - static 폴더 안에 index.html을 만들면 Welcome page 기능 제공
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<h2>안녕</h2>
</body>
</html>
```
  **thymeleaf 템플릿 엔진 사용**
  - controller 패키지 안에 HelloController.java 생성
```java
package hello.hellospring.controller;
import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HelloController {
    @GetMapping("hello")
    public String hello(Model model){
        model.addAttribute("data", "hello!!");
        return "hello";
    }
}
```

  - templates 폴더 안에 hello.html 생성

```java
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Hello</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>
<p th:text="'안녕하세요. ' + ${data}" >안녕하세요. 손님</p>
</body>
</html>
```
  - http://localhost:8080/hello 을 실행시키면 
  - 컨트롤러에서 리턴 값으로 문자를 반환하면 뷰 리졸버( `viewResolver` )가 화면을 찾아서 처리
  - 스프링 부트 템플릿엔진 기본 viewName 매핑 
  - *resources:templates/ +{ViewName}+ .html*

