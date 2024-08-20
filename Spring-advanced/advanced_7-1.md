## 빈 후처리기 - 소개
<img width="637" alt="image" src="https://github.com/user-attachments/assets/1e2b7840-6d35-4aa5-a99a-feb56f7ecca8">

`@Bean`이나 컴포넌트 스캔으로 스프링 빈을 등록하면, 스프링은 대상 객체를  생성하고 스프링 컨테이너 냅의 빈 저장소에 등록한다. 그리고 이후에는 스프링 컨테이너를 통해 등록한 스프링 빈을 조회해서 사용한다.

**빈 후처리기 - BeanPostProcessor**
스프링이 빈 저장소에 등록할 목적으로 생성한 객체를 빈 저장소에 등록하기 직전에 조작하고 싶다면 빈 후처리기를 사용하면 된다.

**빈 후처리기 기능**
- 객체 조작 가능
- 객체 바꾸기 가능

**빈 후처리기 과정**
<img width="637" alt="image" src="https://github.com/user-attachments/assets/c3ad9baa-f0a5-4b08-8397-2b01a999f1d4">
1. **생성** : 스프링 빈 대상이 되는 객체를 생성
2. **전달** : 생성된 객체를 빈 저장소에 등록하기 직전에 빈 후처리기에 전달한다.
3. **후 처리 작업** : 빈 후처리기는 전달된 스프링 빈 객체를 조작하거나 다른 객체로 바꿔치기 할 수 있다.
4. **등록** : 빈 후처리기는 빈을 반환한다. 전달 된 빈을 그래도 반환하면 해당 빈이 등록되고, 바꿔치기 하면 다른 객체가 빈 저장소에 등록된다.

**객체 바꾸기**
<img width="637" alt="image" src="https://github.com/user-attachments/assets/5963bfac-b712-4e56-ad5d-c2f40bd85ec8">
