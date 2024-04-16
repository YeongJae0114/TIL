# 열거형 - ENUM

테스트 문제
## 문제1-1 - 인증 등급 만들기
**문제 설명**
패키지의 위치는 `enumeration.test` 를 사용하자.
회원의 인증 등급을 `AuthGrade` 라는 이름의 열거형으로 만들어라.
인증 등급은 다음 3가지이고, 인증 등급에 따른 레벨과 설명을 가진다. 레벨과 설명을 `getXxx()` 메서드로 조회할 수 있어야 한다

- GUEST(손님)
	- level=1
	- description=손님 
- LOGIN(로그인 회원)
	- level=2
	- description=로그인 회원 
- ADMIN(관리자)
	- level=3 
	- description=관리자
**정답**
```java
package lang.enumeration.test.ex1;

public enum AuthGrade {
    GUEST(1, "손님"), LOGIN(2, "회원"), ADMIN(3, "관리자");
    private int level;
    private String description;

    AuthGrade(int level, String description) {
        this.level = level;
        this.description =description;
    }

    public int getLevel() {
        return level;
    }

    public String getDescription() {
        return description;
    }
}
```
## 문제1-2 - 인증 등급 열거형 조회하기
**문제 설명**
`AuthGradeMain1` 이라는 클래스를 만들고 다음 결과가 출력되도록 코드를 작성해라.
앞서 만든 `AuthGrade` 을 활용하자

```
grade=GUEST, level=1, 설명=손님 grade=LOGIN, level=2, 설명=로그인 회원
grade=ADMIN, level=3, 설명=관리자 
```

**정답**
```java
package lang.enumeration.test.ex1;

public class AuthGradeMain1 {
    public static void main(String[] args) {
        AuthGrade[] authGrade = AuthGrade.values();
        for (AuthGrade grade : authGrade) {
            System.out.println("grade = "+grade.name() +", level : " + grade.getLevel()+", description : " +grade.getDescription());
        }
    }
}
```

## 문제1-3 - 인증 등급 열거형 활용
- AuthGradeMain2` 클래스에 코드를 작성하자.
- 인증 등급을 입력 받아서 앞서 만든 `AuthGrade` 열거형으로 변환하자. 
- 인증 등급에 따라 접근할 수 있는 화면이 다르다.
	- 예를 들어 GUEST 등급은 메인 화면만 접근할 수 있고, ADMIN 등급은 모든 화면에 접근할 수 있다.
	- 각각의 등급에 따라서 출력되는 메뉴 목록이 달라진다. 
- 다음 출력 결과를 참고해서 코드를 완성하자.

**GUEST 입력 예** 
```
당신의 등급을 입력하세요[GUEST, LOGIN, ADMIN]: GUEST 
당신의 등급은 손님입니다.
==메뉴 목록==
- 메인 화면 
```
**LOGIN 입력 예** 
```
당신의 등급을 입력하세요[GUEST, LOGIN, ADMIN]: LOGIN 
당신의 등급은 로그인 회원입니다.
==메뉴 목록==
- 메인 화면
- 이메일 관리 화면
```

**ADMIN 입력 예** 
```
당신의 등급을 입력하세요[GUEST, LOGIN, ADMIN]: ADMIN 
당신의 등급은 관리자입니다.
==메뉴 목록==
- 메인 화면
- 이메일 관리 화면 
- 관리자 화면
```

**정답**
```java
package lang.enumeration.test.ex1;


import java.util.Scanner;

public class AuthGradeMain2 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("당신의 등급을 입력하세요[GUEST, LOGIN, ADMIN]: ");
        String grade = scanner.nextLine();

        AuthGrade[] authGrades = AuthGrade.values();
        for (AuthGrade authGrade : authGrades) {
            if (authGrade.name().equals(grade)){
                System.out.println("당신의 등급은 "+authGrade.name()+"입니다.");
                System.out.println("==메뉴 목록==");
                if (authGrade.getLevel() >= 1){
                    System.out.println("- 메인 화면");
                }if (authGrade.getLevel() >= 2) {
                    System.out.println("- 이메일 관리 화면");
                }if (authGrade.getLevel() >= 3) {
                    System.out.println("- 관리자 화면");
                }
            }
        }
    }
}
```

## 문제와 풀이2
**문제 설명**
- `enumeration.test.http` 패키지를 사용하자. 
- `HttpStatus` 열거형을 만들어라.
- HTTP 상태 코드 정의 
	- `OK`
	- code: 200
	- message: "OK"
- `BAD_REQUEST`
	- code: 400
	- message: "Bad Request" 
- `NOT_FOUND`
	- code: 404
	- message: "Not Found" 
- `INTERNAL_SERVER_ERROR`
	- code: 500
	- message: "Internal Server Error"
- **참고**: HTTP 상태 코드는 200 ~ 299사이의 숫자를 성공으로 인정한다.

**정답**
```java
package lang.enumeration.test.http;

public enum HttpStatus {
    OK(200, "OK"), BAD_REQUEST(400, "Bad Request")
    , NOT_FOUND(404, "Not Found"), INTERNAL_SERVER_ERROR(500, "Internal Server Error");

    private int code;
    private String message;

    HttpStatus(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public static HttpStatus findByCode(int code){
        for (HttpStatus status : values()) {
            if (status.getCode() == code){
                return status;
            }
        }
        return null;
    }
    public boolean isSuccess(){
        return code >=200 && code <= 299;
    }
}
```

```java
package lang.enumeration.test.http;

import java.util.Scanner;

public class HttpStatusMain {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("HTTP CODE: ");
        int httpCodeInput = scanner.nextInt();


        HttpStatus status = HttpStatus.findByCode(httpCodeInput);
        if (status == null) {
            System.out.println("정의되지 않은 코드"); } else {
            System.out.println(status.getCode() + " " + status.getMessage());
            System.out.println("isSuccess = " + status.isSuccess());
        }
    }
}
```