## 스프링 타입 컨버터

### 포맷터 - Formatter

**MyNumberFormatter**
```java
package hello.typeconverter.formatter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.format.Formatter;

import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;

@Slf4j
public class MyNumberFormatter implements Formatter<Number> {
    @Override
    public Number parse(String text, Locale locale) throws ParseException {
        log.info("text={}, locale={}", text, locale);
        NumberFormat format = NumberFormat.getInstance(locale);
        return format.parse(text);
    }

    @Override
    public String print(Number object, Locale locale) {
        log.info("object={}, locale={}", object, locale);
        return NumberFormat.getInstance(locale).format(object);
    }
}
```
- `"1,000"` 처럼 숫자 중간의 쉼표를 적용하려면 자바가 기본으로 제공하는 `NumberFormat` 객체를 사용하면 된다. 이 객체는 `Locale` 정보를 활용해서 나라별로 다른 숫자 포맷을 만들어준다.

- `parse()` 를 사용해서 문자를 숫자로 변환한다. 참고로 `Number` 타입은 `Integer` , `Long` 과 같은 숫자 타입의 부모 클래스이다. `print()` 를 사용해서 객체를 문자로 변환한다.

**MyNumberFormatterTest**
```java
package hello.typeconverter.formatter;

import org.junit.jupiter.api.Test;

import java.text.ParseException;
import java.util.Locale;

import static org.assertj.core.api.Assertions.*;

class MyNumberFormatterTest {
    MyNumberFormatter formatter= new MyNumberFormatter();

    @Test
    void parse() throws ParseException {
        Number result = formatter.parse("1,000", Locale.KOREA);
        assertThat(result).isEqualTo(1000L); // Long 타입 주의
    }
    @Test
    void print(){
        String result = formatter.print(1000, Locale.KOREA);
        assertThat(result).isEqualTo("1,000");
    }
}
```
- `parse()` 의 결과가 `Long` 이기 때문에 `isEqualTo(1000L)` 을 통해 비교할 때 마지막에 `L` 을 넣어주어야 한다.

### 포맷터를 지원하는 컨버전 서비스
- 포맷터를 지원하는 컨버전 서비스를 사용하면 컨버전 서비스에 포맷터를 추가할 수 있다. 
- 내부에서 어댑터 패턴을 사용 해서 `Formatter` 가 `Converter` 처럼 동작하도록 지원

**FormattingConversionServiceTest**
```java
package hello.typeconverter.formatter;

import hello.typeconverter.converter.IpPortToStringConverter;
import hello.typeconverter.converter.StringToIpPortConverter;
import hello.typeconverter.type.IpPort;
import org.junit.jupiter.api.Test;
import org.springframework.format.support.DefaultFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
public class FormattingConversionServiceTest {

    @Test
    void formattingConversionService() {
        DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();
        //컨버터 등록

        conversionService.addConverter(new StringToIpPortConverter());
        conversionService.addConverter(new IpPortToStringConverter()); //포맷터 등록
        conversionService.addFormatter(new MyNumberFormatter());

        //컨버터 사용
        IpPort ipPort = conversionService.convert("127.0.0.1:8080", IpPort.class);
        assertThat(ipPort).isEqualTo(new IpPort("127.0.0.1", 8080));

        //포맷터 사용
        assertThat(conversionService.convert(1000, String.class)).isEqualTo("1,000");
        assertThat(conversionService.convert("1,000", Long.class)).isEqualTo(1000L);
    }
}


```
- `FormattingConversionService` 는 포맷터를 지원하는 컨버전 서비스이다.
- `DefaultFormattingConversionService` 는 `FormattingConversionService` 에 기본적인 통화, 숫자 관 련 몇가지 기본 포맷터를 추가해서 제공한다.

#### 포맷터 적용
```java
package hello.typeconverter;

import hello.typeconverter.converter.IpPortToStringConverter;
import hello.typeconverter.converter.StringToIpPortConverter;
import hello.typeconverter.formatter.MyNumberFormatter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addFormatters(FormatterRegistry registry) {
        // registry.addConverter(new StringToIntegerConverter());
        // registry.addConverter(new IntegerToStringConverter());
        registry.addConverter(new StringToIpPortConverter());
        registry.addConverter(new IpPortToStringConverter());

        // 포맷터
        registry.addFormatter(new MyNumberFormatter());
    }
}
```
- `MyNumberFormatter` 도 숫자 문자, 문자 숫자로 변경하기 때문에 둘의 기능이 겹친다. 우선순위는 컨버터가 우선하므로 포맷터가 적용되지 않고, 컨버터가 적용된다.

### 스프링이 제공하는 기본 포맷터
**FormatterController**
```java
package hello.typeconverter.controller;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.NumberFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDateTime;

@Controller
public class FormatterController {
    @GetMapping("/formatter/edit")
    public String formatterForm(Model model){
        Form form = new Form();
        form.setNumber(10000);
        form.setLocalDateTime(LocalDateTime.now());

        model.addAttribute("form",form);
        return "formatter-form";
    }
    @PostMapping("/formatter/edit")
    public String formatterEdit(@ModelAttribute Form form) {
        return "formatter-view";
    }

    @Data
    static class Form{
        @NumberFormat(pattern = "###,###")
        private Integer number;

        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime localDateTime;
    }
}
```
- `@NumberFormat` : 숫자 관련 형식 지정 포맷터 사용 
	- `NumberFormatAnnotationFormatterFactory` 
- `@DateTimeFormat` : 날짜 관련 형식 지정 포맷터 사용, 
	- `Jsr310DateTimeFormatAnnotationFormatterFactory`


