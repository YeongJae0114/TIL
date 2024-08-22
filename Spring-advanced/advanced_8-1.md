# @Aspect AOP

## @Aspect 프록시 적용
- 스프링 어플리케이션에 프록시를 적용하려면 포인트컷과 어드바이스로 구성되어 있는 어드바이저를 만들어서 스프링 빈으로 등록하면 된다.
- 나머지는 자동 프록시 생성기가 모두 자동으로 처리

**LogTraceAspect**
```java
package hello.proxy.config.v6_aop.aspect;

import ...

@Aspect
@Slf4j
public class LogTraceAspect {
    private final LogTrace logTrace;

    public LogTraceAspect(LogTrace logTrace) {
        this.logTrace = logTrace;
    }
    @Around("execution(* hello.proxy.app..*(..))")
    public Object execute(ProceedingJoinPoint joinPoint)throws Throwable{
        TraceStatus status = null;
        try {
            String message = joinPoint.getSignature().toShortString();
            status = logTrace.begin(message);
            // 실제 로직 호출
            Object result= joinPoint.proceed();
            logTrace.end(status);
            return result;
        }catch (Exception e){
            logTrace.exception(status, e);
            throw e;
        }
    }
}
```
- `@Around("execution(* hello.proxy.app..*(..))")`
  - `@Around` 의 값에 포인트컷 표현식을 넣는다. 표현식은 AspectJ 표현식을 사용한다.
  - `@Around` 의 메서드는 어드바이스( `Advice` )가 된다.
- `ProceedingJoinPoint joinPoint` : 어드바이스에서 살펴본 `MethodInvocation invocation` 과 유 사한 기능
  - 내부에 실제 호출 대상, 전달 인자, 그리고 어떤 객체와 어떤 메서드가 호출되었는지 정보가 포함
- joinPoint.proceed()` : 실제 호출 대상( `target` )을 호출

**AopConfig**
```java
package hello.proxy.config.v6_aop;

import ...

@Configuration
@Import({AppV1Config.class, AppV2Config.class})
public class AopConfig {
    @Bean
    public LogTraceAspect logTraceAspect(LogTrace logTrace){
        return new LogTraceAspect(logTrace);
    };
}
```
- `@Import({AppV1Config.class, AppV2Config.class})` : V1, V2 애플리케이션은 수동 등록
- `@Bean logTraceAspect()` : `@Aspect` 가 있어도 스프링 빈으로 등록


**ProxyApplication**
```java
package hello.proxy;

import ...

@Import({AopConfig.class})
@SpringBootApplication(scanBasePackages = "hello.proxy.app") //주의
public class ProxyApplication {
	public static void main(String[] args) {
		SpringApplication.run(ProxyApplication.class, args);
	}

	@Bean
	public LogTrace logTrace(){
		return new ThreadLocalLogTrace();
	}
}
```
- `AopConfig.class` 를 등록

## Aspect 프록시 - 설명
![image](https://github.com/user-attachments/assets/f7531832-b009-4988-a426-82acdfc5fba9)

**@Aspect를 어드바이저로 변환해서 저장하는 과정**
![image](https://github.com/user-attachments/assets/6c8d5188-5149-4dd1-9114-5b622f1d8b69)
- **1. 실행:** 스프링 애플리케이션 로딩 시점에 자동 프록시 생성기를 호출한다.
- **2. 모든 @Aspect 빈 조회:** 자동 프록시 생성기는 스프링 컨테이너에서 `@Aspect` 애노테이션이 붙은 스프링 빈 을 모두 조회한다.
- **3. 어드바이저 생성:** `@Aspect` 어드바이저 빌더를 통해 `@Aspect` 애노테이션 정보를 기반으로 어드바이저를 생성한다.
- **4. @Aspect 기반 어드바이저 저장:** 생성한 어드바이저를 `@Aspect` 어드바이저 빌더 내부에 저장한다.

**@Aspect 어드바이저 빌더**

`BeanFactoryAspectJAdvisorsBuilder` 클래스이다. `@Aspect` 의 정보를 기반으로 포인트컷, 어드바이스, 어
드바이저를 생성하고 보관하는 것을 담당

**어드바이저를 기반으로 프록시 생성**
![image](https://github.com/user-attachments/assets/e3009b29-7e27-4069-a78c-26c3f6762931)
- **1. 생성:** 스프링 빈 대상이 되는 객체를 생성한다. ( `@Bean` , 컴포넌트 스캔 모두 포함)
- **2. 전달:** 생성된 객체를 빈 저장소에 등록하기 직전에 빈 후처리기에 전달한다.
- **3-1. Advisor 빈 조회:** 스프링 컨테이너에서 `Advisor` 빈을 모두 조회한다.
- **3-2. @Aspect Advisor 조회:** `@Aspect` 어드바이저 빌더 내부에 저장된 `Advisor` 를 모두 조회한다.
- **4. 프록시 적용 대상 체크:** 앞서 3-1, 3-2에서 조회한 `Advisor` 에 포함되어 있는 포인트컷을 사용해서 해당 객 체가 프록시를 적용할 대상인지 아닌지 판단한다. 이때 객체의 클래스 정보는 물론이고, 해당 객체의 모든 메서드 를 포인트컷에 하나하나 모두 매칭해본다. 그래서 조건이 하나라도 만족하면 프록시 적용 대상이 된다. 예를 들어 서 메서드 하나만 포인트컷 조건에 만족해도 프록시 적용 대상이 된다.
- **5. 프록시 생성:** 프록시 적용 대상이면 프록시를 생성하고 프록시를 반환한다. 그래서 프록시를 스프링 빈으로 등 록한다. 만약 프록시 적용 대상이 아니라면 원본 객체를 반환해서 원본 객체를 스프링 빈으로 등록한다.
- **6. 빈 등록:** 반환된 객체는 스프링 빈으로 등록된다.
