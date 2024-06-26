## 1. 빌링 예산

루트 계정에서 빌링 대시보드로 이동해 IAM 사용자와 관리자도 비용관리 대시보드에 엑세스 하는 것을 허용 해야한다.

## 2. EC2

여러 기능을 포괄하는 개념이다. 

EC2는 가상머신을 임대할 수 있는데, 이것을 인스턴스라고 한다.

EBS 볼륨이라는 가상 드라이브에 데이터를 저장할 수 있다.

또한 여러 머신에 로드(접속)를 분산하는 Elactic Load Balancer를 이용한다  

오토 스케일링 그룹, ASG를 이용해 서비스를 확장한다.

### EC2 인스턴스 옵션

- OS
    - 리눅스
    - mac
    - windows
- CPU
    - 코어 수
    - RAM
    - 스토리지 용량
        - 네트워크를 통해 연결
            - EBS, EFS
        - 하드웨어에 연결
            - EC2 Instance Store
- 네트워크 카드의 속도와 공개 IP 설정 가능
- 보안 그룹 사용가능 (방화벽 규칙)
- 부트스트랩 스크립트
    - EC2 사용자 데이터 구성
    - 인스턴스를 처음 시작할 때 실행되는 명령
    - **시작할 때 한 번만 실행되고 다시 실행되지 않는다**
    - 부팅작업을 자동화 하는 것
        - 업데이트, SW 설치 등등
        - **작업을 많이 추가할 수록 부팅시 과부화 발생**
- EC2 사용자 데이터는 루트 사용자로 실행된다
    - sudo 권한으로 명령어 사용

## EC2 인스턴스 유형 기본 사항

인스턴스는 7가지의 유형이 있다

- 범용, 컴퓨팅 최적화, 메모리 최적화 등

**인스턴스 명명 규칙**

ex) m5.2xlarge

- m 은 범용 인스턴스를 나타냄
- m5. 에서 숫자는 올라갈 수록 하드웨어의 상위 버전
- 2xlarge 는 인스턴스의 크기(클수록 더 많은 메모리, cpu)

### 범용 인스턴스

- 웹 서버나 코드 저장소와 같은 다양한 작업에 적합하다.

- 컴퓨팅, 네크워킹, 메모리의 균형이 잘맞는다.

### 컴퓨팅 최적화 인스턴스

- 컴퓨터 집약적인 작업에 최적화 된 인스턴스
- 머신러닝, 게임 서버 등 고성능 컴퓨팅에 사용된다
- C로 시작하는 이름을 가지고 있다
- ex) c5d.4xlarge

### 메모리 최적화 인스턴스

- 대규모 데이터셋을 처리하는 유형의 작업에 빠른 성능을 제공
- 메모리는 RAM을 뜻한다 . R로 시작하는 이름을 갖음
- 데이터베이스로 사용
    - 분산 웹스케일 캐시 저장소
- ex) m5.8xlarge
- 또한 X1과 Z1은 대용량 메모리를 뜻함

---

## 보안 그룹 및 클래식 포트 개요

<aside>
💡 보안 그룹이란, AWS 클라우드에서 네트워크 보안을 실현하는 데 기본적인 기능.
인바운드 아웃바운드 트래픽을 제어한다. 여기에서 허용되는 규칙만 사용한다.

</aside>

- 인바운드 트래픽
    - 외부에서 인스턴스로 연결하는 네트워크 제어
    - 허용되는 규칙만 사용
- 아웃바운드 트래픽
    - 인스턴스에서 외부로 연결하는 네트워크 제어
    - 어떠한 아웃바운드 트래픽이든 허용

### 보안 그룹 설정



- 유형과 프로토콜 설정
- 연결할 때 사용할 포트 : 트래픽이 인스턴스와 연결할 때 사용하는 포트
- IP 주소 범위

### Classic Ports

- SSH : 보안 셸 (:22)
- FTP : 파일 전송 프로토콜 (:21)
- SFTP : SSH를 사용하는 파일 전송 프로토콜(:22)
- HTTP : 보안이 적용되지 않은 웹사이트에 엑세스 할 때 사용 (:80)
- HTTPS : 보안이 적용된 웹사이트 엑세스 (:443)
- RDP : 윈도우 원격 데스크톱 프로토콜 (:3389)

## SSH -Linux or maxos 접속

```bash
# EC2Tutorial.pem 와 같은 위치에 있어야함
chmod 0400 EC2Tutorial.pem # 보호 되지 않는 키 파일 권한 변경
ssh -i EC2Tutorial.pem ec2-user@18.188.157.185
```

### EC2 인스턴스 연결, 데모

```bash
aws iam list-users # 인스턴스에 있는 자격 증명 정보
```

밑 방법은 사용하면 안됨

> Amazon Linux AMI가 AWS CLI을 포함 
예를 들어 명령어 aws iam list-users 명령을 실행하면, 자격 증명을 찾을 수 없으니 자격 증명을 위해 aws configure 명령을 실행 하라고 함 그럼 aws configure 명령을 실행해 자격 증명 및 액세스 ID 비밀 액세스 키, 리전 이름을 지정할 수도 있다.
> 

이 user 계정을 사용하는 사람이 언제든지 권한을 회수할 수 있다.

### 다른 방법

인스턴스의 보안 탭으로 들어가 IAM 역할로 DemoRoleForEC2로 설정한다.

IAM으로부터 유저에 관한 응답을 받을 수 있다.

## 인스턴스 구매 옵션

1. **EC2 온디멘드**
    1. 장점
        1. 언제든지 인스턴스를 실행할 수 있는 장점
        2. 단기 워크로드에 적합
        3. 가격을 예측할 수 있고, 초당 비용을 지불
        4. 예측할 수 없는 애플리케이션에 적합
    2. 단점
        1. 시간당 청구 비용이 가장 높음
        2. 장기 약정 없음
        3. 후불 결제(선불 X )
2.  **EC2 예약 인스턴스**
    1. 장점
        1. 온디멘드 대비 최대 72% 할인
        2. 장기 워크로드에 적합
        3. 안정적인 애플리케이션에 적합
    2. 단점
        1. 특정 인스턴스 속성을 예약 해야함(인스턴스 유형 약정)
        2. 예약 해야하는 기간 : 1 또는 3년
3. **EC2 Savings Plans**
    1. 장점 
        1. 최대 72% 할인
        2. 특정 사용향을 약정 (인스턴스 유형 약정 X)
        3. 장기 워크로드에 적합
        4. 초과 비용
    2. 단점
        1. 예약 해야하는 기간 : 1 또는 3년

1. **EC2 Spot Instance**
    1. 장점
        1. 최대 90% 할인
        2. 비용 효율적인 인스턴스
    2. 단점
        1. 최대 가격이 현물 가격보다 낮을 경우 언제든지 잃을 수 있는 인스턴스
        2. 중요한 작업이나 데이터베이스에는 적합하지 않음