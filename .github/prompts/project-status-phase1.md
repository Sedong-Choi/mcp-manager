# MCP Manager Pro - Phase 1: 프로젝트 기초 설정

## 사용자 실행 CLI 명령어 (순서대로 실행)

### 1. pnpm 설치 (이미 설치된 경우 생략)

```bash
npm install -g pnpm
```

### 2. 프로젝트 루트에서 pnpm 워크스페이스 초기화

```bash
# 루트 디렉토리에서 실행
cd <root>
pnpm init
```

### 3. 기본 디렉토리 구조 생성

```bash
# 루트 디렉토리에서 실행
mkdir -p apps/web
mkdir -p packages/ui
mkdir -p packages/tsconfig
mkdir -p services/model-service
mkdir -p services/mcp-service
mkdir -p services/conversation-service
mkdir -p services/db-service
```

### 4. Next.js 앱 생성

```bash
# web 앱 디렉토리로 이동
cd apps/web
# Next.js 앱 생성 (모든 질문에 Yes로 대답)
pnpm dlx create-next-app@latest . --typescript --tailwind --app --eslint
cd ../..
```

## 작업 진행 프로세스

1. 위의 CLI 명령어 실행 후 "진행" 메시지를 입력하십시오.
2. CLI 명령어 실행 결과에 문제가 있을 경우 알려주시면 해결 방법을 안내해 드리겠습니다.

## AI 구현 작업 (사용자 "진행" 입력 후)

AI가 다음 작업을 수행합니다:

1. **모노레포 설정**
   - pnpm-workspace.yaml 파일 생성
   - 루트 package.json 구성
   - 공통 TypeScript 설정 생성

2. **마이크로서비스 기본 구조 설정**
   - 각 서비스의 기본 package.json 생성
   - TypeScript 설정 및 기본 소스 파일 생성
   - 기본 API 엔드포인트 구성

3. **Docker 설정**
   - 각 서비스의 Dockerfile 생성
   - 루트 docker-compose.yml 파일 생성
   - 개발용 docker-compose.dev.yml 파일 생성

4. **Next.js 앱 기본 설정**
   - 공통 컴포넌트 디렉토리 구조 설정
   - API 라우트 기본 구조 구성
   - 환경 변수 설정 (.env.example)

5. **Storybook 기본 설정**

## 마이크로서비스 아키텍처 구조
