## 소중한 SW 특강 : AWS로 구현하는 스프링부트 무중단 CI/CD 배포

### 1일차
- IntelliJ, Git 환경설정

### 2일차
#### 도커
**도커란?**
Go 언어로 작성된 리눅스 컨테이너 기반으로 하는 오픈소스 가상화 플랫폼이다. 특정 서비스를 패키징하고 배포하는데 유용한 오픈소스 프로그램이다.

**컨테이너(Container)**
컨테이너는 애플리케이션과 그 필요한 모든 것을 포함하는 격리된 환경. 가볍고 빠르게 시작되며, 다른 컨테이너나 호스트 시스템과의 충돌 없이 독립적으로 실행. 이는 개발, 배포, 실행을 일관되게 만들어 준다.

**이미지(Image)**
이미지는 컨테이너를 생성하는 데 사용되는 템플릿으로, 애플리케이션 실행에 필요한 코드, 라이브러리, 환경설정 등이 포함. 읽기 전용이며, 컨테이너는 이 이미지를 기반으로 생성.

**도커 데몬(Docker Daemon)**
도커 데몬은 컨테이너의 생성, 실행, 모니터링, 삭제 등을 관리하는 백그라운드 프로세스. 도커 클라이언트와 통신하며, 도커의 모든 중요 작업을 담당.

**도커 파일(Dockerfile)**
도커 파일은 도커 이미지를 빌드하기 위한 설정 파일로, 이미지 생성 과정에 필요한 명령어를 순서대로 담고 있다. 이 파일을 사용하면 이미지 빌드 과정을 자동화하고, 재사용 가능한 방식으로 관리 가능.

**도커 허브(Docker Hub)**
https://hub.docker.com/
도커 허브는 도커 이미지를 저장하고 공유할 수 있는 클라우드 서비스. 사용자는 자신의 이미지를 업로드하여 공유할 수 있으며, 다른 사람이 만든 이미지를 검색하고 사용 가능.

#### 도커 이미지 만들기
Dockerfile을 작성하고 이를 기반으로 이미지를 빌드하는 것

**1. 프로젝트 구조 준비**
```
my-html-app/
├── Dockerfile
├── index.html
```
**2. HTML 파일 작성**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My HTML App</title>
</head>
<body>
    <h1>Hello, Docker!</h1>
    <p>This is a simple HTML file served by Nginx in a Docker container.</p>
</body>
</html>
```

**3. Dockerfile 작성**
```Dockerfile
# 1. Nginx 베이스 이미지 사용
FROM nginx:latest

# 2. HTML 파일 복사
COPY index.html /usr/share/nginx/html/index.html

# 3. 컨테이너 실행 명령어 설정
CMD ["nginx", "-g", "daemon off;"]

```

**4. 도커 이미지 빌드**
```
cd my-html-app
docker build -t my-html-app .
```

**5. 도커 컨테이너를 실행**
```
docker run -d --name my-container -p 8080:80 my-html-app
```

**6. 도커 컨테이너를 삭제**
```
docker rm -f 컨테이너_이름
EX : docker rm -f nginx-1-1
EX : docker rm -f nginx-1-2
```

**정리**
- 도커 이미지로 도커 컨테이너를 생성할 수 있다.(다른 말로 도커 이미지를 실행하면 도커 컨테이너가 생성됩니다.)
- 도커 이미지는 일종의 템플릿이고 이력서 양식과 같다.
- 도커 컨테이너는 도커 이미지를 디스크에서 복사하여 메모리에 띄운 것과 같다.

- 마치 우리가 특정 회사를 위한 이력서를 작성할 때 원본 이력서 양식을 보존하기 위해서 이력서 양식 원본에서 바로 편집하지 않고 그것의 복사본을 만든 후 작업하는 것과 같다. 
- 80 포트를 사용하는 nginx-1-1 컨테이너 띄운다.
    - `docker run -d nginx-1 -p 80:80 --name`
- 컨테이너_이름 이미지_이름
    - EX : `docker run -d --name nginx-1-1 -p 80:80 nginx-1`
    - 수행하면 다른 컨테이너에서는 80 포트를 사용할 수 없다.
    - 다른 컨테이너에서는 nginx-1-1 이라는 이름을 사용할 수 없다.

- 8081 포트를 사용하는 nginx-1-2 컨테이너 띄운다.
    - `docker run -d nginx-1 -p 8081:80 --name`
-  컨테이너_이름 이미지_이름
    - EX : `docker run -d --name nginx-1-2 -p 8081:80 nginx-1`
      - 다른 컨테이너에서는 8081 포트를 사용할 수 없다.
      - 다른 컨테이너에서는 nginx-1-2 이라는 이름을 사용할 수 없다.

- 하나의 도커 이미지로 2개의 컨테이너를 띄웠고
- 각각의 컨테이너가 같은 이름을 가질 수 없고
- 같은 포트를 점유할 수 없어서 서로 다른 이름, 다른 포트를 할당.

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
FROM gradle:jdk21-graal-jammy as builder

# 작업 디렉토리 설정
WORKDIR /app

# 소스 코드와 Gradle 래퍼 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Gradle 래퍼에 실행 권한 부여
RUN chmod +x ./gradlew

# 종속성 설치
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사
COPY src src

# 애플리케이션 빌드
RUN ./gradlew build --no-daemon

# 두 번째 스테이지: 실행 스테이지
FROM ghcr.io/graalvm/jdk-community:21

# 작업 디렉토리 설정
WORKDIR /app

# 첫 번째 스테이지에서 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 실행할 JAR 파일 지정
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
```




### 테라폼, AWS EC2로 CI/CD 구축
























