## 프록시 팩토리
 동적 프록시를 사용할 때 문제점
 - 인터페이스가 있는 경우에는 JDK 동적 프록시를 적용하고, 그렇지 않은 경우에는 CGLIB를 적용하려면 어떻게 해야할까
 - 두 기술을 함께 사용할 때 부가 기능을 제공할때 각각 중복으로 만들어서 관리해야 하나?
   - `InvocationHandler` : JDK 동적 프록시가 제공
   - `MethodInterceptor` : CGLIB가 제공
     
**특정 조건에 맞을 때 프록시 로직을 적용하는 기능도 공통으로 제공 해보자**


**프록시 팩토리-의존 관계**
![image](https://github.com/user-attachments/assets/0a010a3d-eea5-4b5c-be96-555011fe0a0c)


**프록시 팩토리-사용 흐름**
![image](https://github.com/user-attachments/assets/85d3790f-4960-435f-8543-c76389e54f67)

- 스프링은 이 문제를 해결하기 위해 부가 기능을 적용할 때 `Advice` 라는 새로운 개념을 도입했다.
- 개발자는 `InvocationHandler` 나 `MethodInterceptor` 를 신경쓰지 않고, `Advice` 만 만들면 된다.

**Advice 도입**
![image](https://github.com/user-attachments/assets/111c7bd6-dd0b-40c6-8791-fc2b8a006b52)


**Advice 도입-흐름**
![image](https://github.com/user-attachments/assets/0a2edc75-be62-460e-acf3-bfb379be0f1a)




