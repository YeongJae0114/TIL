## 스프링 AOP - 포인트컷

### 포인트컷의 지시자 종류
- `execution` : 메소드 실행 조인 포인트를 매칭한다. 가장 많이 사용
- `within` : 특정 타입 내의 조인 포인트를 매칭
- `args` : 인자가 주어지 타입의 인스턴스인 조인 포인트
- `this` : 스프링 빈 객체를 대상으로 하는 조인 포인트
- `target` : Target 객체를 대상으로 하는 조인 포인트
- `@target` : 실행 객체의 클래스에 주어진 타입의 애노테이션이 있는 조인 포인트
- `@within` : 주어진 애노테이션이 있는 타입 내 조인 포인트
- `@annotation` : 메서드가 주어지 애노테이션을 가지고 있는 조인 포인트를 매칭
- `@args` : 전달된 실제 인수의 런타임 타입이 주어진 타입의 애노테이션을 갖는 조인 포인트
- `bean` : 스프링 전용 포인트컷, 빈의 이름으로 포인트컷 지정


## execution
```java
@Test
 void exactMatch() {
     //public java.lang.String
 hello.aop.member.MemberServiceImpl.hello(java.lang.String)
 pointcut.setExpression("execution(public String
 hello.aop.member.MemberServiceImpl.hello(String))");
     assertThat(pointcut.matches(helloMethod, MemberServiceImpl.class)).isTrue();
 }
```
**매칭 조건**
- 접근제어자?: `public`
- 반환타입: `String`
- 선언타입?: `hello.aop.member.MemberServiceImpl` 메서드이름: `hello`
- 파라미터: `(String)`
- 예외?: 생략

**부모 타입 허용**
```java
@Test
 void typeExactMatch() {
     pointcut.setExpression("execution(*
 hello.aop.member.MemberServiceImpl.*(..))");
     assertThat(pointcut.matches(helloMethod, MemberServiceImpl.class)).isTrue();
 }
 @Test
 void typeMatchSuperType() {
     pointcut.setExpression("execution(* hello.aop.member.MemberService.*(..))");
     assertThat(pointcut.matches(helloMethod, MemberServiceImpl.class)).isTrue();
 }
```
- `typeExactMatch()` 는 타입 정보가 정확하게 일치하기 때문에 매칭된다.
- `typeMatchSuperType()` 을 주의해서 보아야 한다.
- `execution` 에서는 `MemberService` 처럼 부모 타입을 선언해도 그 자식 타입은 매칭된다

## within
특정 타입 내의 조인 포인트들로 매칭을 제한한다. 쉽게 이야기해서 해당 타입이 매칭되면 그 안의 메서드들이 자동으로 매칭된다.
`execution` 에서 타입 부분만 사용한다고 보면 된다.

**WithinTest**
```java
@Test
@DisplayName("타켓의 타입에만 직접 적용, 인터페이스를 선정하면 안된다.") void withinSuperTypeFalse() {
     pointcut.setExpression("within(hello.aop.member.MemberService)");
     assertThat(pointcut.matches(helloMethod,
 MemberServiceImpl.class)).isFalse();
 }

@Test
@DisplayName("execution은 타입 기반, 인터페이스를 선정 가능.") void executionSuperTypeTrue() {
     pointcut.setExpression("execution(* hello.aop.member.MemberService.*(..))");
     assertThat(pointcut.matches(helloMethod, MemberServiceImpl.class)).isTrue();
 }
```
- 부모 타입(여기서는 `MemberService` 인터페이스) 지정시 `within` 은 실패하고, `execution` 은 성공하는 것을 확인할 수 있다.

## args
- `args` : 인자가 주어진 타입의 인스턴스인 조인 포인트로 매칭
- 기본 문법은 `execution` 의 `args` 부분과 같다.
**execution과의 차이점**
- `execution(* *(java.io.Serializable))` : 메서드의 시그니처로 판단 (정적)
- `args(java.io.Serializable)` : 런타임에 전달된 인수로 판단 (동적)

**Test - args()**
```java
 @Test
     void args() {
//hello(String)과 매칭
     assertThat(pointcut("args(String)")
           .matches(helloMethod, MemberServiceImpl.class)).isTrue();
     assertThat(pointcut("args(Object)")
           .matches(helloMethod, MemberServiceImpl.class)).isTrue();
     // 인자가 주어진 인스턴스가 비어 있으면 안된다. 
     assertThat(pointcut("args()")
           .matches(helloMethod, MemberServiceImpl.class)).isFalse(); //매칭 실패 
 }

// execution과의 차이점
@Test
    void argsVsExecution() {
        //Args
        assertThat(pointcut("args(String)")
                .matches(helloMethod, MemberServiceImpl.class)).isTrue();
        assertThat(pointcut("args(java.io.Serializable)")
                .matches(helloMethod, MemberServiceImpl.class)).isTrue();
        assertThat(pointcut("args(Object)")
                .matches(helloMethod, MemberServiceImpl.class)).isTrue();
        //Execution
        assertThat(pointcut("execution(* *(String))")
                .matches(helloMethod, MemberServiceImpl.class)).isTrue();
        assertThat(pointcut("execution(* *(java.io.Serializable))") 
                .matches(helloMethod, MemberServiceImpl.class)).isFalse(); //매칭 실패 
        assertThat(pointcut("execution(* *(Object))")
                .matches(helloMethod, MemberServiceImpl.class)).isFalse(); //매칭 실패 
}
```

## @target, @within
- `@target` : 실행 객체의 클래스에 주어진 타입의 애노테이션이 있는 조인 포인트
- `@within` : 주어진 애노테이션이 있는 타입 내 조인 포인트

**@target vs @within**
- `@target` 은 인스턴스의 모든 메서드를 조인 포인트로 적용한다.
- `@within` 은 해당 타입 내에 있는 메서드만 조인 포인트로 적용한다.
  
![image](https://github.com/user-attachments/assets/aaa173d3-f279-4329-ba0d-84ea8d67bca4)
