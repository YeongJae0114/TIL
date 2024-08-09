## 전략 패턴 
전략 패턴(Strategy Pattern)은 객체 지향 디자인 패턴 중 하나로, 알고리즘을 정의하고, 캡슐화하며, 이를 실행 시간에 서로 교환 가능하도록 만드는 패턴이다.

전략 패턴을 사용하면, 알고리즘의 변형이나 확장을 용이하게 할 수 있으며, 객체 간의 결합도를 낮출 수 있다. 즉, 전략 패턴을 사용하면 알고리즘의 변경에 따라서 코드 변경을 최소화할 수 있다.

전략 패턴의 핵심 요소는 전략(Strategy)이다. 전략은 알고리즘을 캡슐화한 객체로, 클라이언트는 전략을 쉽게 교환할 수 있다. 즉, 전략 패턴에서는 알고리즘을 클라이언트에서 분리해 전략 객체에 위임.


- 전략(Strategy): 알고리즘을 캡슐화한 인터페이스(abstract class or interface)
- 구체적인 전략(Concrete Strategy): 전략 인터페이스를 구현한 클래스
- 컨텍스트(Context): 전략 객체를 사용하는 클라이언트
- 전략 선택(Strategy Selection): 컨텍스트에서 사용할 전략 객체를 선택하는 메서드

**전략 패턴의 장점**

- 알고리즘의 변형 및 확장이 쉽다.
- 코드 재사용성이 높다.
- 객체 간의 결합도가 낮아져 유지보수가 용이
- 테스트가 용이

**ContextV2Test - 추가**
```java
@Test
 void strategyV2() {
     ContextV2 context = new ContextV2();
     context.execute(new Strategy() {
         @Override
         public void call() {
			log.info("비즈니스 로직1 실행"); 
		}
     });
     context.execute(new Strategy() {
         @Override
         public void call() {
			log.info("비즈니스 로직2 실행"); 
		}
	}); 
}
```

**ContextV2Test - 추가**
```java
/**
* 전략 패턴 익명 내부 클래스2, 람다 */
 @Test
 void strategyV3() {
	ContextV2 context = new ContextV2(); 
	context.execute(() -> log.info("비즈니스 로직1 실행")); 	context.execute(() -> log.info("비즈니스 로직2 실행"));
}
```

- 인터페이스 메서드가 1개만 있을 때 람다식 사용가능

>ContextV1` , `ContextV2` 두 가지 방식 다 문제를 해결할 수 있지만, 어떤 방식이 조금 더 나아 보이는가?
지금 우리가 원하는 것은 애플리케이션 의존 관계를 설정하는 것 처럼 선 조립, 후 실행이 아니다. 단순히 코드를 실행할 때 변하지 않는 템플릿이 있고, 그 템플릿 안에서 원하는 부분만 살짝 다른 코드를 실행하고 싶을 뿐이다.
따라서 우리가 고민하는 문제는 실행 시점에 유연하게 실행 코드 조각을 전달하는 `ContextV2` 가 더 적합하다.