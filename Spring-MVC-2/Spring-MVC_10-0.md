## 스프링 타입 컨버터 소개
문자를 숫자로 변환하거나, 반대로 숫자를 문자로 변환해야 하는 것 처럼 애플리케이션을 개발하다 보면 타입을 변환을 자주 사용한다.

**문자 타입을 숫자 타입으로 변경**
```java
package hello.typeconverter.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/hello-v1")
    public String helloV1(HttpServletRequest request){
        String data = request.getParameter("data");
        Integer intValue = Integer.valueOf(data);
        System.out.println("intValue = " + intValue);

        return "ok";
    }
    @GetMapping("/hello-v2")
    public String helloV2(@RequestParam Integer data){
        System.out.println("intValue = " + data);
        return "ok";
    }
}
```
- `String data = request.getParameter("data")` : HTTP 요청 파라미터는 모두 문자로 처리된다. 따라서 요청 파라미터를 자바에서 다른 타입으로 변환해서 사용하고 싶 으면 다음과 같이 숫자 타입으로 변환하는 과정을 거쳐야 한다.
- `@RequestParam` 을 사용하면 이 문자 10을 `Integer` 타입의 숫자 10으로 편리하게 받을 수 있다. 
	- **이것은 스프링이 중간에서 타입을 변환해주었기 때문이다.**

**스프링과 타입 변환**
- 스프링이 중간에 타입 변환기를 사용해서 타입을 `String` `Integer` 로 변환한다.

**컨버터 인터페이스**
```java
package org.springframework.core.convert.converter;
	public interface Converter<S, T> {
		T convert(S source);
}
```
- 스프링은 확장 가능한 컨버터 인터페이스를 제공한다.
- X Y 타입으로 변환하는 컨버터 인터페이스를 만들 수 있다.



