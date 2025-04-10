# MCP Manager Pro - Phase 3 세부 계획

Phase 3에서는 모델 서비스를 구현합니다. 이 단계를 더 작은 단계로 나누어 진행하겠습니다.

## Phase 3의 세부 단계 계획

### 3.1: Ollama API 기본 연동 (Phase 3-A)

- Ollama API 클라이언트 기본 구조 설정
- API 요청/응답 타입 정의
- 기본 연결 및 헬스체크 기능 구현

### 3.2: 모델 관리 핵심 기능 (Phase 3-B)

- 모델 목록 조회 기능 구현
- 모델 상세 정보 조회 기능 구현
- 모델 상태 확인 기능 구현

### 3.3: 모델 제어 기능 (Phase 3-C)

- 모델 다운로드 기능 구현
- 모델 로드/언로드(실행/중지) 기능 구현
- 모델 삭제 기능 구현

### 3.4: REST API 엔드포인트 (Phase 3-D)

- 모델 조회 API 엔드포인트 구현
- 모델 제어 API 엔드포인트 구현
- API 에러 처리 및 응답 표준화

### 3.5: 모델 서비스 테스트 (Phase 3-E)

- 단위 테스트 작성
- 통합 테스트 작성
- 모의(Mock) Ollama 서버 구현

### 3.6: Docker 및 배포 설정 (Phase 3-F)

- Dockerfile 최적화
- 환경 변수 구성
- 서비스 간 통신 설정

## Phase 3-A: Ollama API 기본 연동 세부 계획

첫 번째 세부 단계인 Phase 3-A에서는 Ollama API와의 기본 연동을 구현합니다.

### 사용자 실행 CLI 명령어

```bash
# model-service 디렉토리로 이동
cd <root>/services/model-service

# 필요한 의존성 설치
pnpm add axios dotenv express cors
pnpm add -D @types/express @types/cors jest ts-jest @types/jest
```

### 구현 예정 기능

1. **Ollama API 클라이언트 기본 구조**
   - axios 기반 HTTP 클라이언트 구현
   - 기본 API 엔드포인트 설정
   - 요청 타임아웃 및 재시도 로직

2. **API 타입 정의**
   - 모델 정보 인터페이스
   - API 요청/응답 타입
   - 오류 타입 정의

3. **기본 연결 및 헬스체크**
   - Ollama 서버 연결 상태 확인
   - 헬스체크 엔드포인트 구현
   - 연결 오류 처리 로직

### 작업 파일 목록

```
services/model-service/
├── src/
│   ├── config/
│   │   └── api.ts             # API 설정
│   ├── types/
│   │   └── ollama.ts          # Ollama 관련 타입 정의
│   ├── lib/
│   │   └── ollamaClient.ts    # Ollama API 클라이언트
│   ├── utils/
│   │   └── errorHandler.ts    # 오류 처리 유틸리티
│   ├── routes/
│   │   └── healthRoute.ts     # 헬스체크 라우트
│   ├── app.ts                 # Express 앱 설정
│   └── index.ts               # 진입점
└── tests/
    └── unit/
        └── ollamaClient.test.ts # 클라이언트 단위 테스트
```

작업 진행 후 "Phase 3-A 완료" 메시지를 입력하시면, 다음 세부 단계인 Phase 3-B로 진행하겠습니다.

### 환경 준비

Ollama API와 연동하기 위해 사전에 로컬 환경에 Ollama가 설치되어 있어야 합니다. 기본적으로 Ollama는 11434 포트를 사용합니다. 모델 서비스는 기본적으로 4001 포트에서 실행됩니다.
