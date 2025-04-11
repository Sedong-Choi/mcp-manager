# Phase 3-B: 모델 관리 핵심 기능 구현 계획

이 문서는 MCP Manager Pro의 Phase 3-B 구현 계획을 정리합니다.

## 구현 목표

Phase 3-B에서는 Ollama API를 활용한 모델 관리의 핵심 기능을 구현합니다:

- 모델 목록 조회 기능
- 모델 상세 정보 조회 기능
- 모델 상태 확인 기능

## 사용자 실행 CLI 명령어

```bash
# model-service 디렉토리로 이동
cd <root>/services/model-service

# 필요한 의존성이 있다면 추가 설치
# (Phase 3-A에서 이미 기본 의존성은 설치됨)
```

## 구현 예정 기능

### 1. 모델 목록 조회 기능

- `GET /api/v1/models` 엔드포인트 구현
- 모든 가용 모델 목록 반환
- 필터링 및 정렬 옵션 지원

### 2. 모델 상세 정보 조회 기능

- `GET /api/v1/models/:modelName` 엔드포인트 구현
- 특정 모델의 상세 정보 반환
- 모델 파라미터 및 메타데이터 포함

### 3. 모델 상태 확인 기능

- `GET /api/v1/models/:modelName/status` 엔드포인트 구현
- 모델 로딩 상태 확인 (loaded/unloaded)
- 모델 사용 가능 여부 확인

## 작업 파일 목록

```
services/model-service/
├── src/
│   ├── controllers/
│   │   └── modelController.ts    # 모델 컨트롤러
│   ├── routes/
│   │   └── modelRoutes.ts        # 모델 라우트
│   ├── types/
│   │   └── models.ts             # 모델 관련 타입 정의
│   ├── services/
│   │   └── modelService.ts       # 모델 서비스 레이어
│   ├── app.ts                    # 라우터 등록 업데이트
│   └── utils/
│       └── responseFormatter.ts  # 응답 형식 표준화
└── tests/
    └── unit/
        └── modelService.test.ts  # 모델 서비스 테스트
```

## 테스트 계획

1. **단위 테스트**
   - 모델 서비스 메소드 테스트
   - 모의 응답을 사용한 컨트롤러 테스트

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

작업 진행 후 "Phase 3-B 완료" 메시지를 입력하시면, 다음 세부 단계인 Phase 3-C로 진행하겠습니다.
