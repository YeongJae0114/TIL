## 사용자 정의 타입 컨버터
`127.0.0.1:8080` 과 같은 IP, PORT를 입력하면 IpPort 객체로 변환하는 컨버터를 만들어보자.
**IpPort**
```java
package hello.typeconverter.type;

import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode
public class IpPort {
    private String ip;
    private int port;

    public IpPort(String ip, int port) {
        this.ip = ip;
        this.port = port;
    }
}
```
- 롬복의 `@EqualsAndHashCode` 를 넣으면 모든 필드를 사용해서 `equals()` , `hashcode()` 를 생성한다. 따라서 모든 필드의 값이 같다면 `a.equals(b)` 의 결과가 참이 된다.

**StringToIpPortConverter - 컨버터**
```java
package hello.typeconverter.converter;

import hello.typeconverter.type.IpPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;
@Slf4j
public class StringToIpPortConverter implements Converter<String, IpPort> {
    @Override
    public IpPort convert(String source) {
        log.info("convert source={}", source);
        String split[] = source.split(":");
        String ip = split[0];
        int port = Integer.parseInt(split[1]);

        return new IpPort(ip, port);
    }
}

```
- `127.0.0.1:8080` 같은 문자를 입력하면 `IpPort` 객체를 만들어 반환한다.


**StringToIpPortConverter - 컨버터**
```java
package hello.typeconverter.converter;

import hello.typeconverter.type.IpPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;
@Slf4j
public class IpPortToStringConverter implements Converter<IpPort, String> {
    @Override
    public String convert(IpPort source) {
        log.info("convert source={}", source);
        return source.getIp()+":"+source.getPort();
    }
}

```
- `IpPort` 객체를 입력하면 `127.0.0.1:8080` 같은 문자를 반환한다.


**StringToIpPortConverter - 컨버터**
```java
    @Test
    void stringToIpPort(){
        StringToIpPortConverter stringToIpPortConverter = new StringToIpPortConverter();
        IpPort result = stringToIpPortConverter.convert("127.0.0.1:8080");
        Assertions.assertThat(result).isEqualTo(new IpPort("127.0.0.1",8080));

    }
    @Test
    void ipPortToString(){
        IpPortToStringConverter ipPortToString = new IpPortToStringConverter();
        IpPort source = new IpPort("127.0.0.1",8080);
        String result = ipPortToString.convert(source);
        Assertions.assertThat(result).isEqualTo("127.0.0.1:8080");
    }
```



