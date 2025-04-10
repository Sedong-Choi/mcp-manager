# MCP Manager Pro - Phase 2: 데이터베이스 서비스 구현

## 구현 목표

Phase 2에서는 SQLite 기반 데이터베이스 서비스를 완전히 구현합니다. 이 서비스는 모든 영구 데이터 저장을 담당하고 다른 서비스에 필요한 데이터 액세스 API를 제공합니다.

## 사용자 실행 CLI 명령어

### 1. 데이터베이스 서비스 의존성 설치

```bash
# db-service 디렉토리로 이동
cd <root>/services/db-service

# 필요한 의존성 설치
pnpm add better-sqlite3 knex dotenv express cors
pnpm add -D @types/better-sqlite3 @types/express @types/cors
```

### 2. 데이터베이스 디렉토리 생성

```bash
# 데이터 디렉토리 생성
mkdir -p <root>/data/db
```

## 작업 진행 프로세스

1. 위의 CLI 명령어 실행 후 "진행" 메시지를 입력하십시오.
2. CLI 명령어 실행 결과에 문제가 있을 경우 알려주시면 해결 방법을 안내해 드리겠습니다.

## AI 구현 작업 (사용자 "진행" 입력 후)

AI가 다음 작업을 수행합니다:

1. **데이터베이스 스키마 설계 및 구현**
   - 데이터베이스 마이그레이션 시스템 구축
   - 주요 테이블 스키마 정의 (conversations, messages, model_configs, mcp_servers)
   - 마이그레이션 스크립트 작성

2. **데이터베이스 서비스 API 개발**
   - CRUD API 엔드포인트 구현
   - 각 테이블별 라우터 구성
   - 트랜잭션 및 에러 처리

3. **데이터 액세스 레이어 구현**
   - 레포지토리 패턴으로 데이터 액세스 객체 구현
   - 쿼리 빌더 함수 구현
   - 데이터 변환 및 검증 로직

4. **단위 테스트 작성**
   - 핵심 데이터 액세스 기능 테스트
   - API 엔드포인트 테스트 코드 작성

5. **통합 테스트 환경 구성**
   - 인메모리 SQLite 테스트 환경 설정
   - 테스트 마이그레이션 및 시드 데이터 구성

## 구현 예정 API 엔드포인트

### 대화 관리

- `GET /conversations` - 모든 대화 목록 조회
- `GET /conversations/:id` - 특정 대화 상세 조회
- `POST /conversations` - 새 대화 생성
- `PUT /conversations/:id` - 대화 정보 업데이트
- `DELETE /conversations/:id` - 대화 삭제

### 메시지 관리

- `GET /conversations/:id/messages` - 특정 대화의 모든 메시지 조회
- `POST /conversations/:id/messages` - 대화에 새 메시지 추가
- `PUT /messages/:id` - 메시지 내용 업데이트
- `DELETE /messages/:id` - 메시지 삭제

### 모델 설정 관리

- `GET /model-configs` - 모든 모델 설정 조회
- `GET /model-configs/:id` - 특정 모델 설정 조회
- `POST /model-configs` - 새 모델 설정 추가
- `PUT /model-configs/:id` - 모델 설정 업데이트
- `DELETE /model-configs/:id` - 모델 설정 삭제

### MCP 서버 관리

- `GET /mcp-servers` - 모든 MCP 서버 목록 조회
- `GET /mcp-servers/:id` - 특정 MCP 서버 상세 조회
- `POST /mcp-servers` - 새 MCP 서버 등록
- `PUT /mcp-servers/:id` - MCP 서버 설정 업데이트
- `DELETE /mcp-servers/:id` - MCP 서버 등록 삭제

## 데이터베이스 스키마 설계 (예정)

### conversations 테이블

- `id`: TEXT (UUID) - 기본키
- `title`: TEXT - 대화 제목
- `model_name`: TEXT - 사용된 모델 이름
- `created_at`: TIMESTAMP - 생성 시간
- `updated_at`: TIMESTAMP - 수정 시간

### messages 테이블

- `id`: TEXT (UUID) - 기본키
- `conversation_id`: TEXT - 대화 ID (외래키)
- `role`: TEXT - 역할 (user/assistant)
- `content`: TEXT - 메시지 내용
- `created_at`: TIMESTAMP - 생성 시간

### model_configs 테이블

- `id`: TEXT (UUID) - 기본키
- `model_name`: TEXT - 모델 이름
- `api_port`: INTEGER - API 포트
- `status`: TEXT - 상태 (running/stopped)
- `last_used`: TIMESTAMP - 마지막 사용 시간
- `created_at`: TIMESTAMP - 생성 시간
- `updated_at`: TIMESTAMP - 수정 시간

### mcp_servers 테이블

- `id`: TEXT (UUID) - 기본키
- `name`: TEXT - 서버 이름
- `type`: TEXT - 서버 타입
- `port`: INTEGER - 포트 번호
- `data_path`: TEXT - 데이터 경로
- `status`: TEXT - 상태 (running/stopped)
- `created_at`: TIMESTAMP - 생성 시간
- `updated_at`: TIMESTAMP - 수정 시간

---
마지막 업데이트: 2024-04-21
