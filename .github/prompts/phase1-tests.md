# MCP Manager Pro - Phase 1 테스트 계획

다음 테스트들을 통해 Phase 1 구현이 제대로 완료되었는지 검증할 수 있습니다.

## 1. 프로젝트 구조 검증

```bash
# 디렉토리 구조 확인
ls -la
ls -la apps/web
ls -la packages/tsconfig
ls -la services/model-service
ls -la services/mcp-service
ls -la services/conversation-service
ls -la services/db-service
```

## 2. 모노레포 설정 검증

```bash
# pnpm 워크스페이스 설정 확인
cat pnpm-workspace.yaml
cat package.json
```

## 3. 기본 서비스 실행 테스트

```bash
# model-service 실행 테스트
cd services/model-service
pnpm dev
# 새 터미널에서 API 호출 테스트
curl http://localhost:4001/health
curl http://localhost:4001/models

# 다른 서비스도 유사하게 테스트
```

## 4. Next.js 애플리케이션 실행 테스트

```bash
# Next.js 앱 실행
cd apps/web
pnpm dev
# 브라우저에서 http://localhost:3000 접속
```

## 5. API 게이트웨이 테스트

```bash
# Next.js API 게이트웨이 테스트 (앱 실행 중일 때)
curl http://localhost:3000/api/health
curl http://localhost:3000/api/models
```

## 6. Docker 설정 검증

```bash
# Docker Compose 설정 확인
cat docker-compose.yml
cat docker-compose.dev.yml

# 개발 환경 Docker 실행 테스트 (선택적)
docker-compose -f docker-compose.dev.yml up db-service
curl http://localhost:4004/health
```

## 7. 전체 통합 테스트

```bash
# 모든 마이크로서비스 실행
pnpm dev
# 각 서비스의 health 엔드포인트 호출하여 상태 확인
```

이러한 테스트들은 Phase 1 구현이 정상적으로 완료되었는지 확인하는 데 도움이 됩니다. 테스트 중 문제가 발견되면 해당 부분을 수정하여 안정적인 기반을 마련한 후 Phase 2로 진행하는 것이 좋습니다.
