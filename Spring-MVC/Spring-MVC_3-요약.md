## 총 정리

**저장 DB** 

```java
private static MemberRepository instance = new MemberRepository();
    public static  MemberRepository getInstance(){
        return instance;
    }
```	

- **요구 사항**

	1. 클라이언트가 입력한 username과 age를 저장하고 목록을 보여주는 기능
	2. Member 객체는 username과 age 매개변수를 갖음
	3. 필요한 기능 : 입력 기능, 저장 기능, 목록을 보여주는 기능


- **구현 과정**

	1. Front Controller를 통해 서블릿 하나로 클라이언트 요청을 받는다.
		- 요청에 맞는 컨트롤러를 찾아서 호출
	2. Controller를 인터페이스를 통해 각각 기능을 구현한다
	3. 인터페이스를 구현하는 컨트롤러는 From(입력), Save(저장), List(목록) 
	4. 코드의 재사용을 고려하여 v1~v5까지 점진적으로 발전시킴.

- **v1~v5**
	
	1. v1 - 프론트 컨트롤러 도입
		- 컨트롤러에서 공통으로 처리해야 하는 부분의 중복을 제거
		- Front Controller 패턴
		

	2. v2 - View 분류
		- 모든 컨트롤러에서 뷰로 이동하는 부분 중복 제거
			- 컨트롤러의 호출 결과로 Myview로 반환
	
	3. v3 - Model 추가
		- 컨트롤러의 서블릿 기술 분리
			- 요청 파라미터 정보를 자바의 Map으로 전달
			- 컨트롤러가 ModelView 객체 반환
			- Model 객체 (request 객체)  

	4. v4 - 실용적인 컨트롤러(v3 발전)
			- 컨트롤러가 ModelView 객체 반환하지 않고 ViewName만 반환

	5. v5 - 유연한 컨트롤러(어대터) 
			- v3와 v4의 컨트롤러는 다른 인터페이스로 구현 되어 호환이 불가능하다 
				- 어댑터 패턴을 사용해서 다양한 컨트롤러를 처리하도록 발전
			- 핸들러 어댑터 : 다양한 종류의 컨트롤러 호출
			- 핸들러 : 컨트롤러의 이름을 핸들러로 변경해 종류의 맞는 어댑터로 처리 가능

 