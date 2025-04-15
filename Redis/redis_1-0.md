## Redis란? 
- 사전적 정의 : 레디스는 Remote Dictionary Server 의 약자로 "키-값" 구조의 비정형 데이터를 저장하고 관리하기 위한 오프 소스 기반의 비관계형 데이터베이스 시스템이다.
- 내 정의 : 레디스는 데이터 처리속도가 매우 빠른 NoSQL 데이터베이스이다.
![image](https://github.com/user-attachments/assets/b769f641-6c15-4fa0-aaca-40048f53d119)

### 장점 
- 레디스는 인메모리에 모든 데이터를 저장한다. 그래서 데이터의 처리 성능이 매우 빠르다.
- MySQL 은 Disk 에 데이터를 저장하기 떄문에 데이터 처리속도가 월등히 차이가 난다. (얘는 느림) 
   - RDBMS 에 비해 훨씬 빠름
 

## Redis 주요 사용 사례
- 캐싱, 세션 관리, 실시간 분석 및 통계, 메시지 큐, 지리공간 인덱싱, 속도제한 등 매우 많다.
- 하지만 가장 현업에서 많이 사용하는 사용 사례는 "캐싱(데이터 조회 성능 향상)"이다.

## 대용량 트래픽 처리와 NoSQL
- 최근 채용 공고에 대용량 트래픽 처리와 NoSQL에 대한 얘기가 많은데,
- 이 역량은 서비스가 고도화 될수록 빼놓을 수 없는 역량이다.
- 이 대용량 처리를 위해서 사용되는 기능이 캐싱 기능이다.

## Redis 설치 방법
```bash
# HomeBrew 설치 (이미 설치되어 있다면 재설치 필요 X)
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# HomeBrew 설치 여부 확인
$ brew --version

# redis 설치
$ brew install redis

# redis 실행
$ brew services start redis

# redis 실행 여부 확인
$ brew services info redis

# reids 중지
$ brew services stop redis
```
