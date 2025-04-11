#!/bin/bash

# 서비스 실행 포트
PORT=4001

echo "===== 모델 서비스 기본 헬스체크 ====="
curl -s http://localhost:$PORT/health | jq .

echo -e "\n===== Ollama API 연결 상태 체크 ====="
curl -s http://localhost:$PORT/health/ollama | jq .

# Phase 3-B에서 구현한 API 테스트
echo -e "\n===== 모델 목록 조회 ====="
curl -s http://localhost:$PORT/api/v1/models | jq .

echo -e "\n===== 특정 모델 정보 조회 (아래는 예시 - 존재하는 모델명으로 변경 필요) ====="
curl -s http://localhost:$PORT/api/v1/models/llama2 | jq .

echo -e "\n===== 특정 모델 상태 조회 (아래는 예시 - 존재하는 모델명으로 변경 필요) ====="
curl -s http://localhost:$PORT/api/v1/models/llama2/status | jq .
