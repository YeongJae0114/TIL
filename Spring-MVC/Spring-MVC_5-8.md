## HTTP 메시지 컨버터

**@ResponseBody 사용 원리**

<img src="/img/Spring_MVC/ResponseBody.png" alt="ResponseBody" width="500" height="300" />

- `@ResponseBody` 를 사용
	- HTTP의 BODY에 문자 내용을 직접 반환
	- `viewResolver` 대신에 `HttpMessageConverter` 가 동작
	- 기본 문자처리: `StringHttpMessageConverter`
	- 기본 객체처리: `MappingJackson2HttpMessageConverter`
	- byte 처리 등등 기타 여러 HttpMessageConverter가 기본으로 등록되어 있음

**HTTP 메시지 컨버터 인터페이스**
`org.springframework.http.converter.HttpMessageConverter`

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package org.springframework.http.converter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.lang.Nullable;

public interface HttpMessageConverter<T> {
    boolean canRead(Class<?> clazz, @Nullable MediaType mediaType);

    boolean canWrite(Class<?> clazz, @Nullable MediaType mediaType);

    List<MediaType> getSupportedMediaTypes();

    default List<MediaType> getSupportedMediaTypes(Class<?> clazz) {
        return !this.canRead(clazz, (MediaType)null) && !this.canWrite(clazz, (MediaType)null) ? Collections.emptyList() : this.getSupportedMediaTypes();
    }

    T read(Class<? extends T> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException;

    void write(T t, @Nullable MediaType contentType, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException;
}
```
HTTP 메시지 컨버터는 HTTP 요청, HTTP 응답 둘 다 사용된다.
- `canRead()` , `canWrite()` : 메시지 컨버터가 해당 클래스, 미디어타입을 지원하는지 체크 
- `read()` , `write()` : 메시지 컨버터를 통해서 메시지를 읽고 쓰는 기능

**스프링 부트 기본 메시지 컨버터** (일부 생략)
```
 0 = ByteArrayHttpMessageConverter
 1 = StringHttpMessageConverter
 2 = MappingJackson2HttpMessageConverter
```
- `ByteArrayHttpMessageConverter` : `byte[]` 데이터를 처리한다.
	- 클래스 타입: `byte[]` , 미디어타입: `*/*` ,
	- 요청 예) `@RequestBody byte[] data`
	- 응답 예) `@ResponseBody return byte[]` 쓰기 미디어타입 `application/octet-stream`

- `StringHttpMessageConverter` : `String` 문자로 데이터를 처리한다.
	- 클래스 타입: `String` , 미디어타입: `*/*`
	- 요청 예) `@RequestBody String data`
	- 응답 예) `@ResponseBody return "ok"` 쓰기 미디어타입 `text/plain` 

- `MappingJackson2HttpMessageConverter` : application/json
	- 클래스 타입: 객체 또는 `HashMap` , 미디어타입 `application/json` 관련
	- 요청 예) `@RequestBody HelloData data`
	- 응답 예) `@ResponseBody return helloData` 쓰기 미디어타입 `application/json` 관련

**HTTP**
- HTTP 요청이 오고, 컨트롤러에서 `@RequestBody` , `HttpEntity` 파라미터를 사용한다.
- 메시지 컨버터가 메시지를 읽을 수 있는지 확인하기 위해 `canRead()` 를 호출한다.
	- 대상 클래스 타입을 지원하는가.
		- 예) `@RequestBody` 의 대상 클래스 ( `byte[]` , `String` , `HelloData` )
	- HTTP 요청의 Content-Type 미디어 타입을 지원하는가. 
		- 예) `text/plain` , `application/json` , `*/*`- `canRead()` 조건을 만족하면 `read()` 를 호출해서 객체 생성하고, 반환한다.


**HTTP 응답 데이터 생성**
- 컨트롤러에서 `@ResponseBody` , `HttpEntity` 로 값이 반환된다.
- 메시지 컨버터가 메시지를 쓸 수 있는지 확인하기 위해 `canWrite()` 를 호출한다.
	- 대상 클래스 타입을 지원하는가.
		- 예) return의 대상 클래스 ( `byte[]` , `String` , `HelloData` )
	- HTTP 요청의 Accept 미디어 타입을 지원하는가.(더 정확히는 `@RequestMapping` 의 `produces` ) 
		- 예) `text/plain` , `application/json` , `*/*`
- `canWrite()` 조건을 만족하면 `write()` 를 호출해서 HTTP 응답 메시지 바디에 데이터를 생성한다.
