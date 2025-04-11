#!/bin/bash

# 서비스 실행 포트
PORT=4001

echo "===== 모델 서비스 기본 헬스체크 ====="
curl -s http://localhost:$PORT/health | jq .

echo -e "\n===== Ollama API 연결 상태 체크 ====="
curl -s http://localhost:$PORT/health/ollama | jq .

# Phase 3-B에서 구현 예정인 API들도 미리 엔드포인트를 생성했다면 테스트 가능
# echo -e "\n===== 모델 목록 조회 ====="
# curl -s http://localhost:$PORT/models | jq .

# echo -e "\n===== 특정 모델 정보 조회 ====="
# curl -s http://localhost:$PORT/models/gemma-2b | jq .
