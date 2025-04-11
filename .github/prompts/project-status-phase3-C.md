# Phase 3-C: 모델 제어 기능 구현 계획

이 문서는 MCP Manager Pro의 Phase 3-C 구현 계획을 정리합니다.

## 구현 목표

Phase 3-C에서는 모델 제어 기능을 구현합니다. 이 단계에서는 모델의 다운로드, 로드/언로드(실행/중지), 삭제 기능을 개발합니다. 또한, 모델 실행 상태 변경 이벤트를 처리하는 기능도 포함됩니다.

## 구현 예정 기능

### 1. 모델 다운로드 기능

- `POST /api/v1/models/:modelName/download`
  - 특정 모델을 다운로드합니다.
  - 다운로드 진행 상태를 반환합니다.

### 2. 모델 로드/언로드 기능

- `POST /api/v1/models/:modelName/load`
  - 특정 모델을 메모리에 로드합니다.
  - 로드 성공 여부를 반환합니다.

- `POST /api/v1/models/:modelName/unload`
  - 특정 모델을 메모리에서 언로드합니다.
  - 언로드 성공 여부를 반환합니다.

### 3. 모델 삭제 기능

- `DELETE /api/v1/models/:modelName`
  - 특정 모델을 삭제합니다.
  - 삭제 성공 여부를 반환합니다.

### 4. 모델 실행 상태 변경 이벤트 처리

- 모델 상태 변경 이벤트를 처리하여 클라이언트에 실시간으로 알림을 제공합니다.
- WebSocket 또는 SSE(Server-Sent Events)를 활용하여 상태 변경 이벤트를 전송합니다.

## 작업 파일 목록

```
services/model-service/
├── src/
│   ├── controllers/
│   │   └── modelController.ts    # 모델 API 컨트롤러 업데이트
│   ├── routes/
│   │   └── modelRoutes.ts        # 모델 API 라우트 업데이트
│   ├── services/
│   │   └── modelService.ts       # 모델 서비스 레이어 업데이트
│   ├── utils/
│   │   └── eventEmitter.ts       # 이벤트 처리 유틸리티 추가
│   ├── app.ts                    # 라우터 등록 업데이트
│   └── index.ts                  # 서버 시작점
└── tests/
    └── unit/
        └── modelService.test.ts  # 모델 서비스 테스트 업데이트
```

## 테스트 계획

1. **단위 테스트**
   - 모델 다운로드, 로드/언로드, 삭제 메소드 테스트
   - 이벤트 처리 유틸리티 테스트

2. **통합 테스트**
   - 엔드포인트 전체 흐름 테스트
   - 에러 처리 및 응답 형식 검증

3. **수동 테스트**
   - Postman이나 curl을 사용한 API 엔드포인트 테스트
   - 다양한 시나리오에서의 동작 검증

## 환경 준비

Ollama가 설치되어 있고 실행 중이어야 합니다. 최소한 하나 이상의 모델이 다운로드되어 있는 것이 테스트에 도움이 됩니다.

```bash
# Ollama에 모델 다운로드 예시 (미리 실행해두면 테스트에 유용)
ollama pull gemma3:12b
```

작업 진행 후 "Phase 3-C 완료" 메시지를 입력하시면, 다음 세부 단계인 Phase 3-D로 진행하겠습니다.