## 스프링 타입 컨버터

### 컨버전 서비스 - ConversionService
- 직접 찾아서 타입 변환에 사용하는 것은 매우 불편
- 스프링은 개별 컨버터를 모아두고 그것들을 묶어서 편리하게 사용할 수 있는 기능을 제공

**ConversionService 인터페이스**
```java
package org.springframework.core.convert;
	import org.springframework.lang.Nullable;
	public interface ConversionService {
    	boolean canConvert(@Nullable Class<?> sourceType, Class<?> targetType);
    	boolean canConvert(@Nullable TypeDescriptor sourceType, TypeDescriptor targetType);
    	
		<T> T convert(@Nullable Object source, Class<T> targetType);
    	Object convert(@Nullable Object source, @Nullable TypeDescriptor sourceType, TypeDescriptor targetType);
}
```
- 확인하는 기능과, 컨버팅 기능을 제공

**ConversionServiceTest - 컨버전 서비스 테스트 코드**
```java
package hello.typeconverter.converter;


import ...

public class ConversionServiceTest {
    @Test
    void conversionService(){
        // 등록
        DefaultConversionService conversionService = new DefaultConversionService();
        conversionService.addConverter(new StringToIntegerConverter());
        conversionService.addConverter(new IntegerToStringConverter());
        conversionService.addConverter(new IpPortToStringConverter());
        conversionService.addConverter(new StringToIpPortConverter());

        // 사용
        assertThat(conversionService.convert("10", Integer.class)).isEqualTo(10);
        assertThat(conversionService.convert(10, String.class)).isEqualTo("10");

        IpPort ipPort = conversionService.convert("127.0.0.1:8080", IpPort.class);
        assertThat(ipPort).isEqualTo(new IpPort("127.0.0.1", 8080));

        String ipPortString = conversionService.convert(new IpPort("127.0.0.1", 8080), String.class);
        assertThat(ipPortString).isEqualTo("127.0.0.1:8080");
        
    }
}
```
- 추가로 컨버터를 등록하는 기능도 제공
- **등록과 사용 분리**
	- 컨버터를 등록할 때는 `StringToIntegerConverter` 같은 타입 컨버터를 명확히 알고 등록해야 한다
	- 사용하는 입장에서는 타입 컨버터를 전혀 몰라도 된다.

**인터페이스 분리 원칙 - ISP(Interface Segregation Principle)**
인터페이스 분리 원칙은 클라이언트가 자신이 이용하지 않는 메서드에 의존하지 않아야 한다.
- `DefaultConversionService` 는 다음 두 인터페이스를 구현했다. 
	- `ConversionService` : 컨버터 사용에 초점 
	- `ConverterRegistry` : 컨버터 등록에 초점


### 뷰 템플릿에 컨버터 적용하기
**ConverterController**
```java
package hello.typeconverter.controller;

import hello.typeconverter.type.IpPort;
import lombok.Data;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class ConverterController {
    @GetMapping("/converter-view")
    public String converterView(Model model){
        model.addAttribute("number", 10000);
        model.addAttribute("ipPort", new IpPort("127.0.0.1", 8080));
        return "converter-view";
    }
}
```

**converter-view.html**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<ul>
    <li>${number}: <span th:text="${number}" ></span></li>
    <li>${{number}}: <span th:text="${{number}}" ></span></li>
    <li>${ipPort}: <span th:text="${ipPort}" ></span></li>
    <li>${{ipPort}}: <span th:text="${{ipPort}}" ></span></li>
</ul>
</body>
</html>
```
- 타임리프는 `${{...}}` 를 사용하면 자동으로 컨버전 서비스를 사용해서 변환된 결과를 출력

### 폼에 적용하기
```java
    @GetMapping("/converter/edit")
    public String converterForm(Model model){
        IpPort ipPort = new IpPort("127.0.0.1",8080);
        Form form = new Form(ipPort);
        model.addAttribute("form", form);
        return "converter-form";
    }
    @PostMapping("/converter/edit")
    public String converterEdit(@ModelAttribute Form form, Model model) {
        IpPort ipPort = form.getIpPort();
        model.addAttribute("ipPort", ipPort);
        return "converter-view";
    }
    @Data
    static class Form{
        private IpPort ipPort;
        public Form(IpPort ipPort){
            this.ipPort = ipPort;
        }
    }
```
- `GET /converter/edit` : `IpPort` 를 뷰 템플릿 폼에 출력한다.
- `POST /converter/edit` : 뷰 템플릿 폼의 `IpPort` 정보를 받아서 출력한다.

**converter-form.html**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form th:object="${form}" th:method="post">
    th:field
    <input type="text" th:field="*{ipPort}"><br/>
    th:value
    <input type="text" th:value="*{ipPort}">(보여주기 용도)<br/>
    <input type="submit"/>
</form>
</body>
</html>
```
- `GET /converter/edit`
	- `th:field` 가 자동으로 컨버전 서비스를 적용해주어서 `${{ipPort}}` 처럼 적용이 되었다. 따라서 `IpPort` `String` 으로 변환된다.
- `POST /converter/edit`
	- `@ModelAttribute` 를사용해서 `String` `IpPort` 로 변환된다.
