## 로깅
> 운영 시스템에서는 `System.out.println()` 같은 시스템 콘솔을 사용해서 필요한 정보를 출력하지 않고, 별도의 로 깅 라이브러리를 사용해서 로그를 출력한다.

### 로깅 라이브러리
스프링 부트 라이브러리를 사용하면 스프링 부트 로깅 라이브러리( `spring-boot-starter-logging` )가 함께 포함된다.

**스프링 부트 로깅 라이브러리는 기본으로 다음 로깅 라이브러리를 사용**
- SLF4J - http://www.slf4j.org
- Logback - http://logback.qos.ch

**로그 선언**
- `private Logger log = LoggerFactory.getLogger(getClass());`
- `private static final Logger log = LoggerFactory.getLogger(Xxx.class)` 
- `@Slf4j` : 롬복 사용 가능

**로그 호출** 
- `log.info("hello")`
- `System.out.println("hello")`

**LogTestController**
```java
package hello.springmvc.basic;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogTestController {
    private final Logger log = LoggerFactory.getLogger(getClass());

    @RequestMapping("/log-test")
    public String logtest(){
        String name = "Spring";
        log.trace("trace log={}", name);
        log.debug("debug log={}", name);
        log.info(" info log={}", name);
        log.warn(" warn log={}", name);
        log.error("error log={}", name);
//로그를 사용하지 않아도 a+b 계산 로직이 먼저 실행됨, 이런 방식으로 사용하면 X log.debug("String concat log=" + name);
        return "ok";
    }
}
```
**테스트**
- 로그가 출력되는 포멧 확인
	- 시간, 로그 레벨, 프로세스 ID, 쓰레드 명, 클래스명, 로그 메시지 
- 로그 레벨 설정을 변경해서 출력 결과를 보자.
	- LEVEL: `TRACE > DEBUG > INFO > WARN > ERROR`
	- 개발 서버는 debug 출력
	- 운영 서버는 info 출력
- `@Slf4j` 로 변경

**로그 레벨 설정**
`application.properties`
```
#전체 로그 레벨 설정(기본 info) 
logging.level.root=info

#hello.springmvc 패키지와 그 하위 로그 레벨 설정
logging.level.hello.springmvc=debug
```

**올바른 로그 사용법** 
- `log.debug("data="+data)`
	- 로그 출력 레벨을 info로 설정해도 해당 코드에 있는 "data="+data가 실제 실행이 되어 버린다. 결과적으로 문자 더하기 연산이 발생한다. 
- `log.debug("data={}", data)`
	- 로그 출력 레벨을 info로 설정하면 아무일도 발생하지 않는다. 따라서 앞과 같은 의미없는 연산이 발생하지 않는다.

**로그 사용시 장점**
- 쓰레드 정보, 클래스 이름 같은 부가 정보를 함께 볼 수 있고, 출력 모양을 조정할 수 있다.
- 로그 레벨에 따라 개발 서버에서는 모든 로그를 출력하고, 운영서버에서는 출력하지 않는 등 로그를 상황에 맞게 조절할 수 있다.
- 시스템 아웃 콘솔에만 출력하는 것이 아니라, 파일이나 네트워크 등, 로그를 별도의 위치에 남길 수 있다. 특히 파 일로 남길 때는 일별, 특정 용량에 따라 로그를 분할하는 것도 가능하다.
- 성능도 일반 System.out보다 좋다. (내부 버퍼링, 멀티 쓰레드 등등) 그래서 `실무에서는 꼭 로그를 사용`해야 한다.


