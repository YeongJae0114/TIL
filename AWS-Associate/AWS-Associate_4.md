## **IAM: Users & Groups**

### **1. IAM은 글로벌 서비스에 해당**

- 계정을 생성할 때 루트 계정으로 기본으로 생성된다.
- 루트 계정은 사용 X, 공유 X
- 루트 계정 대신에 사용자를 생성한다.

**IAM에서는 사용자를 생성하고 그룹에 배치한다.**


왜 사용자를 생성할까??

- AWS 계정을 사용하도록 허용하기 위해 권한을 부여
- **IAM 사용자 그룹은** 다른 사용자 그룹에 속할 수 없다.


- JSON 문서로 사용자 또는 그룹에게 AWS 서비스를 이용하도록 허용한다

### **2. IAM Policies Structure**

```jsx
{
	"Version" : "2012-10-17",
	"id": "S3-Account-Permissions",
	"Statement" : [
		{
			"Sid" : "1",
			"Effect" : "Allow",
			"Principal" : {
				"AWS" : ["arm:aws:iam::123456789012:root"]
			},
			"Action" : [
				"s3-GetObject",
				"s3-PutObject"
				],
			"Resource" : ["arm:aws:s3:::mybucket/*"]
		}
	]
}
```

Version : 정책 언어 버전

id : 정책을 식별

- Statement :
    - Sid : 문장 ID 로 문장의 식별자(선택 사항)
    - Effect : 접근 허용 여부(특정 API)
    - Principal : 특정 정책이 적용될 사용자, 계정 또는 역할
    - Action : Effect을 기반으로 허용 및 거부되는 API 호출의 목록
    - Resource : 적용될 action의 리소스의 목록

---

## **Multi Factor Authentication - MFA**

생성한 그룹과 사용자들의 정보가 침해당하지 않다록 보호하는 방법

두 가지 방어 매커니즘

- 비밀번호 정책의 정의
- 다요소 인증(**MFA**)

### 1. 비밀번호 정책의 정의

- 비밀번호 안에 특수문자를 요구할 수 있고
- 일정 기간마다 비밀번호를 변경
- 비밀번호 재사용 X
- 등등

### 2. MFA(다요소 인증)

- 비밀번호 외에 다른 보안 장치를 사용하는 것
- 보안 장치 종류
    - 가상 MFA device
    - U2F (물리적 장치)
        - YubiKey
    - Hardware Key Fob MFA Device
        - SurePassID
        - AWS의 제3자 회사인 Gemalto
        

---

## AWS access key, CIL 및 SDK

### 1. AWS 에 엑세스 하는 방법 3가지

- AWS 콘솔 사용
    - 사용자 이름 및 비밀번호와 MFA로  보호
- CLI 사용
    - 컴퓨터에서 설정하는 것
    - 엑세스 키에 의해서 보호
    - 터미널에서 AWS 엑세스를 가능하도록 함
    - AWS 관리 콘솔 대신에 사용된다.
- AWS Software Developer Kit(SDK)
    - AWS로 애플리케이션 코드 내에서 API 호출 할때 사용
    - 엑세스 키에 의해서 보호
    - SDK란 특정 언어로 된 라이브러리의 집합

### 2. 엑세스 키 ??

- 관리 콘솔에서 생성해 사용
- 비밀번호와 마찬가지로 암호화 같다
- 동료와 공유해서는 안된다.

### 3. CloudShell 의 주의사항

- 특정 리전에서만 사용 가능
- 구성이 가능하다 (파일 업로드 등)

## IAM Roles for Services(AWS 서비스에 대한 IAM 역할)

AWS 서비스는 우리를 대신해 우리 계정을 이용해 작업을 수행

이 작업을 하려면 사용자와 마찬가지로 서비스에 대한 권한을 할당해야한다.


EC2 인스턴스가 AWS에서 작업을 수행할 수 있도록 EC2 인스턴스에 권한이 필요하다

그래서 IAM 역할을 생성하고 이 둘은 함꼐 하나의 엔티티를 구성한다.

---

## IAM Security Tools

- IAM Credentials Report (자격 증명 보고서)
    - 계정 수준에서 가능
    - 다양한 자격 증명의 상태를 포함
- IAM Access Advisor (엑세스 관리자)
    - 사용자 수준에서 가능
    - 사용자에게 부여된 권한과 마지막으로 엑세스한 시간이 보인다.

---

## IAM 모범 사례

- root 계정은 AWS 계정을 설정할 때를 제외하고 사용 X
- 제 3자가 AWS를 이용하고 싶다면 user를 만들어 권한을 부여
- AWS 서비스에 권한을 부여할 때마다 역할을 만들고 사용해야 한다.
    - EC2 인스턴스를 포함해서
- AWS를 프로그래밍 할 경우 CLI나 SDK를 사용할 경우 엑세스 키를 만들어야한다
- 계정의 권한을 감시할 때는 자격 증명 보고서와 엑세스 분석기를 사용
    - IAM Credentials Report (자격 증명 보고서)
    - IAM Access Advisor (엑세스 분석기, 관리자)

---

## IAM의 공동 책임 모델


**AWS의 책임**

- 인프라, 글로벌 네트워크 보안
- 설정, 서비스의 취약점 분석 등

**사용자의 책임**

- IAM에 관해서는 사용자의 책임
- 직접 생성하는 사용자, 그룹, 역할, 정책 등
- AWS의 책임이 아니라 사용자의 책임이다.