#!/bin/bash

# 1. 루트에 있는 .env 파일 읽어오기
export $(grep -v '^#' .env | xargs)

# 2. prometheus-prod.yml에 있는 변수(${APP_SERVER_PRIVATE_IP})를
#    실제 값으로 바꿔서 'generated' 파일을 새로 만듦
envsubst < monitoring/prometheus/prometheus-prod.yml > monitoring/prometheus/prometheus-prod.generated.yml

# 3. Docker Compose 실행 (generated 파일을 마운트해서 뜸)
docker-compose -f monitoring/docker-compose.monitoring.prod.yml up -d

echo "🚀 모니터링 시스템이 실행되었습니다!"