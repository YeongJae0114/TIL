## 애플리케이션 아키텍처


<img src="/img/Spring-Jpa/Jpa-2_0.png" alt="도메인 모델과 테이블" width="600" height="200"/>

**계층형 구조 사용**
- controller, web: 웹 계층
- service: 비즈니스 로직, 트랜잭션 처리
- repository: JPA를 직접 사용하는 계층, 엔티티 매니저 사용 
- domain: 엔티티가 모여 있는 계층, 모든 계층에서 사용

**패키지 구조** 
- jpabook.jpashop
	- domain 
	- exception
	- repository
	- service
	- web
