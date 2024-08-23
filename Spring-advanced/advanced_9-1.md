# 스프링 AOP 개념

## AOP 소개 - 핵심 기능과 부가 기능
### 핵심 기능과 부가 기능

애플리케이션 로직은 크게 핵심 기능과 부가 기능으로 나눌 수 있다.

![image](https://github.com/user-attachments/assets/21f8d7cc-353a-4b78-aaba-b70b96529cde)

- **핵심 기능**은 해당 객체가 제공하는 고유의 기능이다. `OrderService`의 핵심 기능은 주문 로직
- **부가기능** 핵심 기능을 보조하기 위해 제공되는 기능. ex) 로그 추적 기술, 트랜잭션 기능

**여러 곳에서 공통으로 사용하는 부가 기능**
![image](https://github.com/user-attachments/assets/8565edcf-e80b-4673-9820-c795dae24d1f)

보통 부가 기능은 여러 클래스에 걸쳐서 함께 사용된다. 모든 애플리케이션 호출을 로깅해야 하는 요구사항을 생각해 보자. 이러한 부가 기능은 횡단 관심하가 된다.
하나의 부가 기능이 여러 곳에서 동일하게 사용된다.

![image](https://github.com/user-attachments/assets/b8380bb7-a1eb-4dc2-8c67-419232de34fc)

**부가 기능 적용 문제**
부가 기능을 적용해야 하는 클래스가 100개면 100개 모두 동일한 코드를 추가해야한다.
  - 부가 기능이 구조적으로 단순 호출이 아니라 `try~catch~finally` 같은 구조가 필요하다면 더욱 복잡해진다.
  - 만약 부가 기능에 수정이 발생하면, 100개의 클래스 모두를 하나씩 찾아가면서 수정해야 한다.

`부가 기능처럼 특정 로직을 애플 리케이션 전반에 적용하는 문제는 일반적인 OOP 방식으로는 해결이 어렵다.`

## AOP 소개 - 애스펙트
### 핵심 기능과 부가 기능을 분리
OOP 방식의 문제점을 해결하기 위해서 부가 기능을 핵심 기능에서 분리하고 한 곳에서 관리하도록 했다. 또한 부가 기능과 부가 기능을 어디에 적용할지 선택하는 기능을 합해서 하나의 모듈로 만들 었는데
이것이 바로 **애스펙트(aspect)** 이다.

`애스펙트는 우리말로 해석하면 관점이라는 뜻인데, 이름 그대로 애플리케이션을 바라보는 관점을 하나하나의 기능에서 횡단 관심사(cross-cutting concerns) 관점으로 달리 보는 것이다.`

AOP(Aspect-Oriented Programming)란 애스펙트를 사용한 프로그래밍 방식을 관점 지향 프로그래밍이라 한다.

**원하는 곳에 부가 기능 적용**
![image](https://github.com/user-attachments/assets/ce4cbb4d-8549-463e-9855-de643c9dbcbf)

![image](https://github.com/user-attachments/assets/b78559a5-175e-486e-896d-1ab8caafd0ce)

**AspectJ 프레임워크**
AOP의 대표적인 구현으로 AspectJ 프레임워크(https://www.eclipse.org/aspectj/)가 있다. 
물론 스프링도 AOP를 지원하지만 대부분 AspectJ의 문법을 차용하고, AspectJ가 제공하는 기능의 일부만 제공한다.

**AspectJ 프레임워크 특징**
- 자바 프로그래밍 언어에 대한 완벽한 관점 지향 확장
- 횡단 관심사의 깔끔한 모듈화
  - 오류 검사 및 처리
  - 동기화
  - 성능 최적화(캐싱)
  - 모니터링 및 로깅

