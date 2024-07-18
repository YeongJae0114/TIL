## 소중한 SW 특강 : AWS로 구현하는 스프링부트 무중단 CI/CD 배포
### 3일차
#### fly.io 앱에 배포 테스트
**fly.io란?**
- fly.io 는 서버(PC)를 제공. 
- 서버는 일반적인 PC와 같은 컴퓨터. 
- 다만 서버에는 공인 IP가 부여.
- 보통 웹서버에는 도메인(IP의 별칭)이 부여.
- 웹서버는 서버중에서 웹 서비스를 제공하는 서버.
- flyctl을 설치하면 컴퓨터에서 명령어로 fly.io 에 여러가지 서비스를 이용.
- flyctl을 설치 후 로그인

**flyctl로 앱 생성하기**
```
fly launch --no-deploy
```
- Fly.io에서 애플리케이션을 초기화하지만 즉시 배포하지 않도록 설정하는 명령어
- 필요한 설정 파일(fly.toml)을 생성

**fly.io 배포**
```
fly deploy
```

**정리**
- 3가지가 있다면 fly.io 배포가 가능. 
	- 3가지 요소 : 프로젝트 폴더, Dockerfile, fly.toml
		- fly.toml 만 있으면 안되고, fly.toml 에 대응되는 fly.io 앱이 존재해야 함.

- 프로젝트 폴더에서 fly deploy 명령을 입력하면
	- 프로젝트 폴더의 모든 파일들이 fly.io 앱으로 복사
	- 빌더 앱이 생성되고 업로드된 파일들로 도커 빌드가 진행
	- 도커이미지가 완성됩니다.

- 기계들(보통 2개)에 컨테이너들이 위치.
	- 여기서 기계는 머신, PC, 서버를 의미.
	- 기계마다 컨테이너가 하나씩 위치

- 소스코드가 바뀌면 재배포.
	- 재배포 명령어 : fly deploy

- 기계들(보통 2개)에서 돌아가고 있는 기존 컨테이너들이 제거되고, 새 도커이미지로 만든 새 컨테이너들이 그 자리를 차지 한다.
	- 기존 컨테이너가 모두 꺼지고, 새 컨테이너가 그 자리를 차지하게 되면 
 	- 만약에 단순하게 교체를 하면 고객 입장에서 중단타임이 발생.
	- 즉 고객이 우리 웹서비스를 이용하는 중에 오류(404 등)을 경험하게 되는 구간이 생김.
- fly.io는 기본적으로 롤링 업데이트라는 무중단 배포(교체) 방식을 사용합니다.
- fly.io 를 통한 배포는 기본적으로 무중단.

**Dockerfile(자바 21, 스프링부트 배포용)**
```
# 첫 번째 스테이지: 빌드 스테이지
FROM gradle:jdk21-graal-jammy AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 소스 코드와 Gradle 래퍼 복사
COPY build.gradle .
COPY settings.gradle .

# Gradle 래퍼에 실행 권한 부여
RUN gradle wrapper

# 종속성 설치
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사
COPY src src

# 애플리케이션 빌드
RUN ./gradlew build --no-daemon

# 두 번째 스테이지: 실행 스테이지
FROM container-registry.oracle.com/graalvm/jdk:21

# 작업 디렉토리 설정
WORKDIR /app

# 첫 번째 스테이지에서 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 실행할 JAR 파일 지정
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
```

#### GITHUB ACTION
- 깃허브 리포지터리에 푸시한 것 만으로 자동으로 배포까지 이루어지면 굉장히 편하다.
	- 이것을 CI/CD 라고 합니다.
- 사실 fly.io 가 무중단이기 때문에 우리의 프로젝트에는 무중단 CI/CD 가 걸려 있다 라고 이야기 할 수 있다.

- GITHUB ACTION 을 걸어두면 특정 이벤트가 발생했을 때 어떠한 일이 작동하도록 할 수 있다.
	- 이벤트 EX : 특정 브랜치에 특정 파일이 변경되는 푸시가 발생

**시크릿 변수 설정**
- GITHUB 에 노출되면 안되는 내용
	- application-secret.yml 에 몰아두고
	- .gitignore 에 src/main/resources/application-secret.yml 추가
	- 해당파일이 GIT 에 저장 X
- application-secret.yml 은 모든환경에서 작동합니다.
- application.yml 의 spring.profiles.include=secret 설정

- 현재는 도커 빌드를 fly.io 에서 수행
	- 빌드란?  행위는 완제품을 만드는 행위
	- application-secret.yml 이 꼭 필요
	- 그런데 github 리포지터리에는 application-secret.yml 파일이 있어야 한다.
		- 파일이 오직 로컬에만 존재(github 에는 없음)
- 깃허브에는 시크릿 변수라는 기능을 제공
	- application-secret.yml 을 암호화 해서 해당 리포지터리에 추가
	- application-secret.yml 의 내용을 시크릿 변수에 저장

**GITHUB ACTION 설정**
- `.github/workflows/deploy.yml` 파일 추가
	- `.github/workflows` 폴더명은 지켜야 하는 규칙
	- GITHUB 리포지터리에 이벤트를 건다라고 보통 표현.
	- 위 파일을 추가하면 이벤트가 걸립니다.
	- deploy.yml 에는 언제 해당 파일이 실행되어야 하는지와
		- 실행되면 무슨일이 벌어져야 하는지가 기술
- 리포지터리 세팅
	- 시크릿변수 APPLICATION_SECRET_YML 를 생성
	- 시크릿변수 FLY_API_TOKEN 을 생성
	- 키를 안전한곳에 보관



- GITHUB PUSH
	- 이제 fly deploy 를 명시적으로 할 필요가 없다.
	- GITHUB 로 푸시하는 것 만으로 자동으로 배포까지 진행
	- 무중단 CI/CD 완성

**.github/workflows/deploy.yml**
```
name: Fly Deploy
on:
  push:
    paths:
      - settings.gradle
      - build.gradle
      - src/**
      - fly.toml
      - Dockerfile
      - .github/workflows/deploy.yml
    branches:
      - main
jobs:
  deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: application-secret.yml 생성
        env:
          APPLICATION_SECRET: ${{ secrets.APPLICATION_SECRET_YML }}
        run: echo "$APPLICATION_SECRET" > src/main/resources/application-secret.yml
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

