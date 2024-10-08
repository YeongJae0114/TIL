## 스프링 AOP - 실전 예제
**목표**
- 로그 출력 AOP
- 재시도 AOP

### 예제 - 시나리오
**ExamRepository**
```java
package hello.aop.exam;

import hello.aop.exam.annotation.Trace;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class ExamRepository {
    static int seq = 0;
    @Trace
    public void save(String itemId){
        seq++;
        if(seq % 5==0){
            throw new IllegalStateException("실패 예외");
        }
    }
}
```
- 5번에 1번 정도 실패하는 저장소이다.
- 이렇게 간헐적으로 실패할 경우 재시도 하는 AOP가 있으면 편리하다.

**ExamService**
```java
package hello.aop.exam;

import hello.aop.exam.annotation.Trace;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExamService {
    private final ExamRepository examRepository;

    @Trace
    public void request(String  itemId){
        examRepository.save(itemId);
    }
}
```

**ExamTest**
```java
package hello.aop.exam;

import hello.aop.exam.aop.ReTryAspect;
import hello.aop.exam.aop.TraceAspect;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@Slf4j
@Import({TraceAspect.class})  // 빈으로 등록
class ExamTest {
    @Autowired
    ExamService examService;

    @Test
    void test(){
        for (int i = 0; i < 5; i++) {
            log.info("client request = {}", i);
            examService.request("data" + i);
        }
    }
}
```

### 로그 출력 AOP

`@Trace` 가 메서드에 붙어 있으면 호출 정보가 출력되는 편리한 기능

**Trace - annotation**
```java
package hello.aop.exam.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Trace {
}
```
- `@Target(ElementType.METHOD)` : 어노테이션이 메소드에만 적용될 수 있음을 명시
  - 즉, Trace 어노테이션은 메소드에만 사용 가능
- `@Retention(RetentionPolicy.RUNTIME)` : 어노테이션이 런타임(RUNTIME) 동안 유지되어야 함을 명시.
  - 즉, 실행 중에도 리플렉션(reflection)을 사용하여 어노테이션 정보를 읽을 수 있음.
    
**TraceAspect**
```java
package hello.aop.exam.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;

@Aspect
@Slf4j
public class TraceAspect {
    @Before("@annotation(hello.aop.exam.annotation.Trace)")
    public void doTrace(JoinPoint joinPoint){
        Object[] args = joinPoint.getArgs();
        log.info("[trace] = {}, args = {}", joinPoint.getSignature(), args);
    }
}
```
- `@annotation(hello.aop.exam.annotation.Trace)` 포인트컷을 사용해서 `@Trace` 가 붙은 메서드에 어드 바이스를 적용

**실행 결과**
```text
[trace] void hello.aop.exam.ExamService.request(String) args=[data0]
[trace] String hello.aop.exam.ExamRepository.save(String) args=[data0]
[trace] void hello.aop.exam.ExamService.request(String) args=[data1]
[trace] String hello.aop.exam.ExamRepository.save(String) args=[data1]
```

### 재시도 AOP
**ReTry**
```java
package hello.aop.exam.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ReTry {
    int value() default 3;
}
```
- 재시도 횟수로 사용할 값이 있다. 기본값으로 `3` 을 사용

**ReTryAspect**
```java
package hello.aop.exam.aop;

import hello.aop.exam.annotation.ReTry;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

@Aspect
@Slf4j
public class ReTryAspect {
    @Around("@annotation(reTry)")
    public Object doRetry(ProceedingJoinPoint joinPoint, ReTry reTry) throws Throwable{
    log.info("[reTry] = {}, retry = {}", joinPoint.getSignature(), reTry);
    Exception exceptionHolder = null;
    int maxValue = reTry.value();
        for (int reTryCount = 1; reTryCount <= maxValue; reTryCount++) {
            try {
                log.info("[reTry] try count={}/{}", reTryCount, maxValue);
                return joinPoint.proceed();
            }catch (Exception e){
                exceptionHolder = e;
            }
        }
        throw exceptionHolder;
    }
}
```
- 재시도 하는 애스펙트이다.
- `@annotation(retry)` , `Retry retry` 를 사용해서 어드바이스에 애노테이션을 파라미터로 전달한다.
- `retry.value()` 를 통해서 애노테이션에 지정한 값을 가져올 수 있다.
- 예외가 발생해서 결과가 정상 반환되지 않으면 `retry.value()` 만큼 재시도

**ExamRepository**
```java
package hello.aop.exam;

import hello.aop.exam.annotation.ReTry;
import hello.aop.exam.annotation.Trace;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class ExamRepository {
    static int seq = 0;
    @Trace
    @ReTry(4)
    public void save(String itemId){
        seq++;
        if(seq % 5==0){
            throw new IllegalStateException("5번 실패");
        }
    }
}
```
- `ExamRepository.save()` 메서드에 `@Retry(value = 4)` 를 적용
  
**ExamTest - 추가**
```java
@SpringBootTest
 //@Import(TraceAspect.class)
 @Import({TraceAspect.class, RetryAspect.class})
 public class ExamTest {
}
```
