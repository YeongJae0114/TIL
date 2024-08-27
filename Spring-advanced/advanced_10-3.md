## 어드바이스 종류

**어드바이스 종류**
- `@Around` : 메서드 호출 전후에 수행, 가장 강력한 어드바이스, 조인 포인트 실행 여부 선택, 반환 값 변환, 예외 변환 등이 가능
- `@Before` : 조인 포인트 실행 이전에 실행
- `@AfterReturning` : 조인 포인트가 정상 완료후 실행 `@AfterThrowing` : 메서드가 예외를 던지는 경우 실행
- `@After` : 조인 포인트가 정상 또는 예외에 관계없이 실행(finally)
```java
package hello.aop.order.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;

@Slf4j
public class AspectV6Advice {
    @Around("hello.aop.order.aop.Pointcuts.orderAndService()")
    public Object doTransaction(ProceedingJoinPoint joinPoint) throws Throwable{
        try {
            //@Before
            log.info("[around][트랜잭션 시작] {}", joinPoint.getSignature()); Object result = joinPoint.proceed();
            //@AfterReturning
            log.info("[around][트랜잭션 커밋] {}", joinPoint.getSignature()); return result;
        } catch (Exception e) {
            //@AfterThrowing
            log.info("[around][트랜잭션 롤백] {}", joinPoint.getSignature());
            throw e;
        } finally {
            //@After
            log.info("[around][리소스 릴리즈] {}", joinPoint.getSignature());
        }
    }
    @Before("hello.aop.order.aop.Pointcuts.orderAndService()")
    public void doBefore(JoinPoint joinPoint) {
        log.info("[before] {}", joinPoint.getSignature());
    }
    @AfterReturning(value = "hello.aop.order.aop.Pointcuts.orderAndService()",
            returning = "result")
    public void doReturn(JoinPoint joinPoint, Object result) {
        log.info("[return] {} return={}", joinPoint.getSignature(), result);
    }
    @AfterThrowing(value = "hello.aop.order.aop.Pointcuts.orderAndService()",
            throwing = "ex")
    public void doThrowing(JoinPoint joinPoint, Exception ex) {
        log.info("[ex] {} message={}", joinPoint.getSignature(),
                ex.getMessage());
    }
    @After(value = "hello.aop.order.aop.Pointcuts.orderAndService()")
    public void doAfter(JoinPoint joinPoint) {
        log.info("[after] {}", joinPoint.getSignature());
    }
 }
```
>`doTransaction()` 메서드에 남겨둔 주석을 보자.
복잡해 보이지만 사실 `@Around` 를 제외한 나머지 어드바이스들은 `@Around` 가 할 수 있는 일의 일부만 제공할 뿐이다. 
따라서 `@Around` 어드바이스만 사용해도 필요한 기능을 모두 수행할 수 있다.


**JoinPoint 인터페이스의 주요 기능**
- `getArgs()` : 메서드 인수를 반환합니다.
- `getThis()` : 프록시 객체를 반환합니다.
- `getTarget()` : 대상 객체를 반환합니다.
- `getSignature()` : 조언되는 메서드에 대한 설명을 반환합니다.
- `toString()` : 조언되는 방법에 대한 유용한 설명을 인쇄합니다.

### @Before
**조인 포인트 실행 전**
```java
@Before("hello.aop.order.aop.Pointcuts.orderAndService()")
 public void doBefore(JoinPoint joinPoint) {
     log.info("[before] {}", joinPoint.getSignature());
 }
```
- `@Around` 와 다르게 작업 흐름을 변경할 수는 없다.
- `@Around` 는 `ProceedingJoinPoint.proceed()` 를 호출해야 다음 대상이 호출된다.
  - 반면에 `@Before` 는 `ProceedingJoinPoint.proceed()` 자체를 사용하지 않는다.
  - 메서드 종료시 자동으로 다음 타켓이 호출된다
### @AfterReturning
**메서드 실행이 정상적으로 반환될 때 실행**
```java
@AfterReturning(value = "hello.aop.order.aop.Pointcuts.orderAndService()",
 returning = "result")
 public void doReturn(JoinPoint joinPoint, Object result) {
     log.info("[return] {} return={}", joinPoint.getSignature(), result);
 }
```
- `returning` 속성에 사용된 이름은 어드바이스 메서드의 매개변수 이름과 일치해야 한다.
- `returning` 절에 지정된 타입의 값을 반환하는 메서드만 대상으로 실행
- `@Around` 와 다르게 반환되는 객체를 변경할 수는 없다. 반환 객체를 변경하려면 `@Around` 를 사용해야 한다.

### @AfterThrowing
**메서드 실행이 예외를 던져서 종료될 때 실행**
```java
@AfterThrowing(value = "hello.aop.order.aop.Pointcuts.orderAndService()",
 throwing = "ex")
 public void doThrowing(JoinPoint joinPoint, Exception ex) {
     log.info("[ex] {} message={}", joinPoint.getSignature(), ex.getMessage());
 }
```
- `throwing` 속성에 사용된 이름은 어드바이스 메서드의 매개변수 이름과 일치해야 한다.
- `throwing` 절에 지정된 타입과 맞는 예외를 대상으로 실행한다. 

### @After
- 메서드 실행이 종료되면 실행된다. (finally를 생각하면 된다.)
- 정상 및 예외 반환 조건을 모두 처리한다.
- 일반적으로 리소스를 해제하는 데 사용한다.
  
### @Around
- 메서드의 실행의 주변에서 실행된다. 메서드 실행 전후에 작업을 수행한다.
- 가장 강력한 어드바이스
  - 조인 포인트 실행 여부 선택 `joinPoint.proceed() 호출 여부 선택`
  - 전달 값 변환: `joinPoint.proceed(args[])`
  - 반환 값 변환
  - 예외 변환
  - 트랜잭션 처럼 `try ~ catch~ finally` 모두 들어가는 구문 처리 가능
- 어드바이스의 첫 번째 파라미터는 `ProceedingJoinPoint` 를 사용해야 한다.
- `proceed()` 를 통해 대상을 실행한다.
- `proceed()` 를 여러번 실행할 수도 있음(재시도)

<img width="814" alt="image" src="https://github.com/user-attachments/assets/b553e496-8255-46fd-a8f9-3d285730560a">

**순서**
- 스프링은 5.2.7 버전부터 동일한 `@Aspect` 안에서 동일한 조인포인트의 우선순위를 정했다.
- 실행 순서: `@Around` , `@Before` , `@After` , `@AfterReturning` , `@AfterThrowing`
- 어드바이스가 적용되는 순서는 이렇게 적용되지만, 호출 순서와 리턴 순서는 반대라는 점을 알아두자.
- 물론 `@Aspect` 안에 동일한 종류의 어드바이스가 2개 있으면 순서가 보장되지 않는다. 이 경우 앞서 배운 것 처 럼 `@Aspect` 를 분리하고 `@Order` 를 적용하자.

**정리**
>`@Around` 가 가장 넓은 기능을 제공하는 것은 맞지만, 실수할 가능성이 있다. 반면에 `@Before` , `@After` 같은 어드 바이스는 기능은 적지만 실수할 가능성이 낮고, 코드도 단순하다.
 그리고 가장 중요한 점이 있는데, 바로 이 코드를 작성 한 의도가 명확하게 드러난다는 점이다. 
`@Before` 라는 애노테이션을 보는 순간 아~ 이 코드는 타켓 실행 전에 한정해 서 어떤 일을 하는 코드구나 라는 것이 드러난다.
