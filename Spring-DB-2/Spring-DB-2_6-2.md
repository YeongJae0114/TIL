# 트랜잭션 AOP 주의 사항
>@Transactional을 사용하면 스프링의 트랜잭션 AOP가 적용된다. 
@Transactional 을 적용하면 프록시 객체가 요청을 먼저 받아서 트랜잭션을 처리하고, 실제 객체를 호출해준다.

**스프링 컨테이너에 트랜잭션 프록시 등록**
<img width="621" alt="image" src="https://github.com/user-attachments/assets/04d91ab9-6415-4b15-b60b-84c3f81a28b5">

- 클래스, 메서드에 `@Transactional` 있으면  트랜잭션은 객체(basicService) 대신에 트랜잭션 AOP 프록시를 만들어서 스프링 컨테이너에 등록한다. 
  - 실제 `basicService` 객체 대신에 프록시인 `basicService$ $CGLIB` 를 스프링 빈에 등록한다 
  - 이제 프록시는 내부에 실제 `basicService` 를 참조한다.


**트랜잭션 프록시 동작 방식**
<img width="621" alt="image" src="https://github.com/user-attachments/assets/924578eb-50b9-49f0-9d6e-55152085d98a">

- 클라이언트가 주입 받은 `basicService$$CGLIB` 는 트랜잭션을 적용하는 프록시이다.

##  프록시 내부 호출 문제
>**결론** : 트랜잭션을 적용하려면 항상 프록시를 통해서 대상 객체(Target)을 호출해야 한다.
이렇게 해야 프록시에서 먼저 트랜잭션을 적용하고, 이후에 대상 객체를 호출하게 된다.
만약 프록시를 거치지 않고 대상 객체를 직접 호출하게 되면 AOP가 적용되지 않고, 트랜잭션도 적용되지 않는다.

왜 프록시 내부에서 트랜잭션이 걸려있는 메서드를 실행 시키면 트랜잭션도 적용되지 않을까??

**시나리오 트랜잭션이 적용되는 시나리오**  
<img width="624" alt="image" src="https://github.com/user-attachments/assets/fcee22f9-ad94-4778-829b-dd1d1cecb609">
1. 클라이언트가 스프링 컨테이너에 등록되어 있는 프록시를 `callService$ $CGLIB` 호출한다.
```java
    @Test
    void printProxy(){
        log.info("callService class ={}", callService.getClass());
    }
```
  -  클래스, 메서드에 `@Transactional` 있으면  트랜잭션은 객체 대신 프록시 객체를 컨테이너에 등록한다
  -  결과 : `callService class=class hello..InternalCallV1Test$CallService$$EnhancerBySpringCGLIB$$4ec3f332`

2. 여기서는 `callService.internal()` 메서드에 `@Transactional` 이 붙어있기 때문에 트랜잭션을 적용한다.
3. 트랜잭션 적용 후 실제 `callService` 객체 인스턴스의 `internal()` 을 호출한다.
```java
static class CallService{
        public void external(){
            log.info("call external");
            printTxInfo();
            internal();
        }

        @Transactional
        public void internal(){
            log.info("call internal");
            printTxInfo();
        }
        private void printTxInfo(){
            boolean active = TransactionSynchronizationManager.isActualTransactionActive();
            log.info("active = {}", active);
        }
    }
```
- 성공적으로 트랜잭션이 생성된다.
4. `callService`가 처리를 완료하면 응답이 트랜잭션 프록시로 돌아오고, 트랜잭션 프록시는 트랜잭션을 완료한다.

**시나리오 트랜잭션 적용 X 시나리오** 
<img width="624" alt="image" src="https://github.com/user-attachments/assets/cb47588e-9867-4dd2-925c-5c3aa4acd9a2">
1. 클라이언트가 스프링 컨테이너에 등록되어 있는 프록시를 `callService$ $CGLIB` 호출한다.
  - 마찬가지로 callService `internal()` 매서드에 `@Transactional`이 있기 때문에 프록시 객체가 스프링 컨테이너에 등록
  - 여기서는 `@Transactional`가 붙어 있지 않는 `external()`를 호출하는 시나리오
  - 같은 클래스에 `internal()`과 `external()`이 들어있기 때문에 프록시로 등록
2. `callService` 의 트랜잭션 프록시가 호출된다.
3. `external()` 메서드에는 `@Transactional` 이 없다. 따라서 트랜잭션 프록시는 트랜잭션을 적용하지 않는다.
4. 트랜잭션 적용하지 않고, 실제 `callService` 객체 인스턴스의 `external()` 을 호출한다.
5. `external()` 은 내부에서 `internal()` 메서드를 호출한다. 그런데 여기서 문제가 발생한다.

>**문제 원인**
자바 언어에서 메서드 앞에 별도의 참조가 없으면 `this` 라는 뜻으로 자기 자신의 인스턴스를 가리킨다.
결과적으로 자기 자신의 내부 메서드를 호출하는 `this.internal()` 이 되는데, 여기서 `this` 는 자기 자신을 가리키 므로, 실제 대상 객체( `target` )의 인스턴스를 뜻한다. 
결과적으로 이러한 내부 호출은 프록시를 거치지 않는다. 따라서 트랜잭션을 적용할 수 없다. 
결과적으로 `target` 에 있는 `internal()` 을 직접 호출하게 된 것이다.

**프록시 방식의 AOP 한계**
`@Transactional` 를 사용하는 트랜잭션 AOP는 프록시를 사용한다. 프록시를 사용하면 메서드 내부 호출에 프록시
를 적용할 수 없다.

### 프록시 방식의 AOP 해결방안 - 1
이 문제를 해결하는 방법으론 `internal()` 메서드를 별도의 클래스로 분리하는 것이다.
<img width="616" alt="image" src="https://github.com/user-attachments/assets/21b9331d-de59-41d8-a3b8-d0c5ef31376e">

-> `internal()` 메서드를 별도의 클래스로 분리하면  `@Transactional`이 없는 메서드와 분리되기 때문에 프록시 객체로 스프링 컨테이너에 저장되지 않는다. 
그러면 `external()` 매서드는  실제 `callService` 객체 인스턴스로 분리되기 때문에 `this.internal()`로 호출되지 않고 
트랜잭션 프록시인 `internalService.internal()` 을 호출하기 때문에 트랜잭션이 잘 적용된다.

### 프록시 방식의 AOP 해결방안 - 2
>**public 메서드만 트랜잭션 적용**
>
>스프링의 트랜잭션 AOP 기능은 `public` 메서드에만 트랜잭션을 적용하도록 기본 설정이 되어있다. 그래서
`protected` , `private` , `package-visible` 에는 트랜잭션이 적용되지 않는다. 생각해보면 `protected` ,
`package-visible` 도 외부에서 호출이 가능하다. 따라서 이 부분은 앞서 설명한 프록시의 내부 호출과는 무관하고, 스프링이 막아둔 것이다.


