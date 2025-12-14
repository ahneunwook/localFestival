# 자바 실행 환경 (JDK 17 기준, 21이면 17을 21로 변경)
FROM openjdk:17-jdk-slim

# 작업 디렉토리 생성
WORKDIR /app

# 빌드된 JAR 파일을 도커 내부로 복사
# (build/libs 폴더 밑에 jar 파일이 생성된다고 가정)
COPY build/libs/*.jar app.jar

ENV TZ=Asia/Seoul

# 도커가 실행될 때 명령어
ENTRYPOINT ["java", "-jar", "app.jar"]