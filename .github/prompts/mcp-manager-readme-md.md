# MCP Manager Pro

Next.js 기반의 마이크로서비스 아키텍처(MSA) 웹 애플리케이션으로, 로컬 AI 모델과 MCP(Model Context Protocol) 서버를 효율적으로 통합 관리하는 시스템입니다. Docker 컨테이너화를 통해 손쉽게 배포하고 사용할 수 있으며, 사용자 친화적인 인터페이스를 통해 AI 모델과 MCP 서버를 제어하고 다양한 모델에 프롬프트를 입력할 수 있습니다.

## 🎯 프로젝트 목표

Next.js 기반의 웹 애플리케이션에서 로컬 AI 모델과 MCP Server를 통합하여 사용자가 인터페이스를 통해 모델과 서버를 제어하고 프롬프트를 입력할 수 있는 AI 시스템 구축을 목표로 합니다.

## 📋 주요 기능

- 로컬 AI 모델(Ollama, Gemma 등) 관리 및 제어
- MCP 서버 등록, 선택, 실행 관리
- 통합 대시보드를 통한 모니터링
- 프롬프트 인터페이스를 통한 AI 모델 활용
- 대화 기록 저장 및 관리 (SQLite)

## 🏗️ 아키텍처

MCP Manager Pro는 마이크로서비스 아키텍처(MSA)를 채택하여 각 기능을 독립적인 서비스로 분리하였습니다.

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Next.js Client │     │  Next.js API    │
│  (React 19)     │◄────┤  (Gateway)      │
│                 │     │                 │
└─────────────────┘     └───────┬─────────┘
                                │
                                ▼
┌──────────────┬───────────────┬─────────────┬────────────────┐
│              │               │             │                │
│ Model        │ MCP Server    │ Conversation│ Database       │
│ Service      │ Service       │ Service     │ Service        │
│ (TypeScript) │ (TypeScript)  │ (TypeScript)│ (TypeScript)   │
│              │               │             │                │
└──────────────┴───────────────┴─────────────┴────────────────┘
```

### 서비스 구성

1. **Next.js Client & API Gateway**
   - React 19 기반 프론트엔드
   - 마이크로서비스 API 통합
   - 사용자 인터페이스 제공

2. **Model Service**
   - Ollama 기반 로컬 AI 모델 관리
   - 모델 다운로드, 실행, 중지 기능
   - 모델 상태 모니터링

3. **MCP Server Service**
   - MCP 서버 등록 및 관리
   - 서버 시작/중지 제어
   - 서버 상태 모니터링

4. **Conversation Service**
   - 프롬프트 처리 및 응답 관리
   - 대화 컨텍스트 관리
   - 스트리밍 응답 처리

5. **Database Service**
   - SQLite 기반 데이터 관리
   - 대화 기록 저장
   - 모델 및 서버 설정 관리

## 🛠️ 기술 스택

- **Frontend**:
  - React 19
  - Next.js (최신 버전)
  - TypeScript
  - TailwindCSS
  - Storybook 7.x

- **Backend**:
  - Node.js
  - TypeScript
  - Express (마이크로서비스용)
  - Next.js API Routes (게이트웨이)

- **데이터베이스**:
  - SQLite

- **개발 도구**:
  - Docker & Docker Compose
  - Jest (단위 테스트)
  - Storybook Testing Library
  - ESLint & Prettier

- **MCP**:
  - @modelcontextprotocol/sdk

## 🐳 Docker를 통한 설치 및 실행

### 사전 요구사항

- Docker 및 Docker Compose 설치
- Git

### 빠른 시작

```bash
# 저장소 복제
git clone https://github.com/yourusername/mcp-manager-pro.git
cd mcp-manager-pro

# Docker Compose로 실행
docker-compose up -d

# 브라우저에서 접속
# http://localhost:3000
```

### 개별 서비스 관리

```bash
# 특정 서비스만 재시작
docker-compose restart model-service

# 로그 확인
docker-compose logs -f api-gateway

# 개발 모드로 실행
docker-compose -f docker-compose.dev.yml up
```

## 💻 로컬 개발 환경 설정

### 사전 요구사항

- Node.js 18.0.0 이상
- npm, pnpm, 또는 yarn
- Ollama (로컬 AI 모델 실행)

### 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 모드로 Next.js 실행 (API 게이트웨이 및 클라이언트)
npm run dev

# 마이크로서비스 개별 실행
npm run dev:model-service
npm run dev:mcp-service
npm run dev:conversation-service
npm run dev:db-service
```

### Storybook 실행

```bash
# Storybook 개발 서버 실행
npm run storybook

# Storybook 테스트 실행
npm run test-storybook
```

## 📝 개발 로드맵

### 1단계: 프로젝트 초기 설정

```bash
# Next.js 프로젝트 생성 (React 19 지원)
npx create-next-app@latest mcp-manager-pro --typescript --tailwind --app
cd mcp-manager-pro

# 필수 의존성 설치
npm install @modelcontextprotocol/sdk better-sqlite3

# Storybook 설정
npx storybook@latest init
```

**핵심 작업:**
- Docker 구성 설정
- 마이크로서비스 디렉토리 구조 설정
- API 게이트웨이 기본 구조 구성
- 환경 설정 파일 (.env)

### 2단계: 마이크로서비스 기본 구현

**목표:** 각 서비스의 기본 구조 및 통신 구현

**구현 단계:**
1. API 게이트웨이 구현
   ```bash
   # API 라우트 구현
   mkdir -p src/app/api/model
   mkdir -p src/app/api/mcp
   mkdir -p src/app/api/conversation
   mkdir -p src/app/api/health
   ```

2. 모델 서비스 구현
   ```bash
   # 서비스 디렉토리 생성
   mkdir -p services/model-service
   cd services/model-service
   npm init -y
   npm install express typescript ts-node @types/express
   ```

3. MCP 서비스 구현
   ```bash
   mkdir -p services/mcp-service
   cd services/mcp-service
   npm init -y
   npm install express typescript ts-node @modelcontextprotocol/sdk
   ```

4. 대화 서비스 구현
   ```bash
   mkdir -p services/conversation-service
   cd services/conversation-service
   npm init -y
   npm install express typescript ts-node
   ```

5. 데이터베이스 서비스 구현
   ```bash
   mkdir -p services/db-service
   cd services/db-service
   npm init -y
   npm install express typescript ts-node better-sqlite3 @types/better-sqlite3
   ```

### 3단계: 프론트엔드 개발

**목표:** React 19 기반 사용자 인터페이스 구현

**구현 단계:**
1. 공통 컴포넌트 개발 (Storybook 활용)
   ```bash
   # 컴포넌트 디렉토리 구성
   mkdir -p src/components/ui
   mkdir -p src/components/model
   mkdir -p src/components/mcp
   mkdir -p src/components/conversation
   ```

2. 페이지 구성
   ```bash
   # 페이지 구현
   mkdir -p src/app/dashboard
   mkdir -p src/app/models
   mkdir -p src/app/mcp
   mkdir -p src/app/chat
   ```

3. 커스텀 훅 개발
   ```bash
   mkdir -p src/hooks
   touch src/hooks/useModelService.ts
   touch src/hooks/useMCPService.ts
   touch src/hooks/useConversation.ts
   touch src/hooks/useDatabase.ts
   ```

### 4단계: 데이터베이스 스키마 및 관리

**목표:** SQLite 데이터베이스 스키마 설계 및 관리

**구현 단계:**
1. 스키마 정의
   ```sql
   -- schemas/conversations.sql
   CREATE TABLE conversations (
     id TEXT PRIMARY KEY,
     title TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- schemas/messages.sql
   CREATE TABLE messages (
     id TEXT PRIMARY KEY,
     conversation_id TEXT NOT NULL,
     role TEXT NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (conversation_id) REFERENCES conversations(id)
   );
   ```

2. 마이그레이션 시스템 구현
   ```bash
   mkdir -p services/db-service/migrations
   touch services/db-service/migrations/001-initial.sql
   ```

### 5단계: 서비스 통합 및 테스트

**목표:** 모든 서비스 통합 및 테스트

**구현 단계:**
1. Docker Compose 설정 완성
2. 엔드 투 엔드 테스트 구현
3. 성능 최적화
4. 배포 파이프라인 구성

## 📂 프로젝트 구조

```
mcp-manager-pro/
├── docker-compose.yml              # 프로덕션 Docker Compose 설정
├── docker-compose.dev.yml          # 개발용 Docker Compose 설정
├── .env.example                    # 환경 변수 예시
├── src/                            # Next.js 애플리케이션 (API 게이트웨이 + 클라이언트)
│   ├── app/                        # Next.js App Router
│   │   ├── api/                    # API 라우트 (게이트웨이)
│   │   ├── dashboard/              # 대시보드 페이지
│   │   ├── models/                 # 모델 관리 페이지
│   │   ├── mcp/                    # MCP 서버 관리 페이지
│   │   ├── chat/                   # 대화 인터페이스 페이지
│   │   ├── layout.tsx              # 레이아웃 컴포넌트
│   │   └── page.tsx                # 메인 페이지
│   ├── components/                 # UI 컴포넌트
│   │   ├── ui/                     # 공통 UI 컴포넌트
│   │   ├── model/                  # 모델 관련 컴포넌트
│   │   ├── mcp/                    # MCP 관련 컴포넌트
│   │   └── conversation/           # 대화 관련 컴포넌트
│   ├── hooks/                      # React 커스텀 훅
│   ├── lib/                        # 유틸리티 및 공통 함수
│   ├── types/                      # TypeScript 타입 정의
│   └── stories/                    # Storybook 스토리
├── services/                       # 마이크로서비스
│   ├── model-service/              # 모델 관리 서비스
│   │   ├── src/                    # 소스 코드
│   │   ├── Dockerfile              # Docker 설정
│   │   └── package.json            # 의존성 정의
│   ├── mcp-service/                # MCP 서버 관리 서비스
│   │   ├── src/                    # 소스 코드
│   │   ├── Dockerfile              # Docker 설정
│   │   └── package.json            # 의존성 정의
│   ├── conversation-service/       # 대화 관리 서비스
│   │   ├── src/                    # 소스 코드
│   │   ├── Dockerfile              # Docker 설정
│   │   └── package.json            # 의존성 정의
│   └── db-service/                 # 데이터베이스 서비스
│       ├── src/                    # 소스 코드
│       ├── migrations/             # 데이터베이스 마이그레이션
│       ├── Dockerfile              # Docker 설정
│       └── package.json            # 의존성 정의
├── schemas/                        # 데이터베이스 스키마
├── tests/                          # 테스트 파일
│   ├── unit/                       # 단위 테스트
│   ├── integration/                # 통합 테스트
│   └── e2e/                        # E2E 테스트
├── .storybook/                     # Storybook 설정
├── next.config.js                  # Next.js 설정
├── package.json                    # 루트 의존성 정의
└── tsconfig.json                   # TypeScript 설정
```

## 🧩 컴포넌트 개발 (Storybook)

MCP Manager Pro는 Storybook을 활용하여 컴포넌트를 개발하고 문서화합니다. 이를 통해 UI 컴포넌트를 독립적으로 개발하고 테스트할 수 있습니다.

### Storybook 설정

```bash
# Storybook 설치 및 설정
npx storybook@latest init

# Storybook 테스트 라이브러리 설치
npm install @storybook/testing-library @storybook/jest
```

### 컴포넌트 스토리 작성 예시

```tsx
// src/stories/ModelCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ModelCard } from '../components/model/ModelCard';

const meta: Meta<typeof ModelCard> = {
  title: 'Model/ModelCard',
  component: ModelCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModelCard>;

export const Default: Story = {
  args: {
    modelName: 'gemma-2b',
    description: 'Gemma 2B 언어 모델',
    size: '1.2GB',
    status: 'stopped',
  },
};

export const Running: Story = {
  args: {
    ...Default.args,
    status: 'running',
  },
};
```

### 컴포넌트 테스트

```tsx
// src/components/model/ModelCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ModelCard } from './ModelCard';

describe('ModelCard', () => {
  it('renders model information correctly', () => {
    render(
      <ModelCard
        modelName="gemma-2b"
        description="Gemma 2B 언어 모델"
        size="1.2GB"
        status="stopped"
      />
    );
    
    expect(screen.getByText('gemma-2b')).toBeInTheDocument();
    expect(screen.getByText('Gemma 2B 언어 모델')).toBeInTheDocument();
    expect(screen.getByText('1.2GB')).toBeInTheDocument();
    expect(screen.getByText('중지됨')).toBeInTheDocument();
  });
});
```

## 🔄 커스텀 훅 개발

공통 로직은 커스텀 훅으로 분리하여 재사용성을 높입니다.

### 모델 서비스 훅 예시

```typescript
// src/hooks/useModelService.ts
import { useState, useEffect } from 'react';
import type { Model, ModelStatus } from '@/types/model';

export const useModelService = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/model/list');
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      setModels(data.models);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  const startModel = async (modelName: string) => {
    try {
      const response = await fetch('/api/model/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName }),
      });
      if (!response.ok) {
        throw new Error('Failed to start model');
      }
      await fetchModels(); // 목록 새로고침
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };
  
  const stopModel = async (modelName: string) => {
    try {
      const response = await fetch('/api/model/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName }),
      });
      if (!response.ok) {
        throw new Error('Failed to stop model');
      }
      await fetchModels(); // 목록 새로고침
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };
  
  useEffect(() => {
    fetchModels();
  }, []);
  
  return {
    models,
    loading,
    error,
    fetchModels,
    startModel,
    stopModel,
  };
};
```

## 💾 SQLite 데이터베이스

SQLite를 사용하여 대화 기록 및 설정을 영구적으로 저장합니다.

### 데이터베이스 스키마

```sql
-- 대화 테이블
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  model_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 메시지 테이블
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

-- 모델 설정 테이블
CREATE TABLE model_configs (
  id TEXT PRIMARY KEY,
  model_name TEXT NOT NULL,
  api_port INTEGER NOT NULL,
  status TEXT NOT NULL,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MCP 서버 설정 테이블
CREATE TABLE mcp_servers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  port INTEGER NOT NULL,
  data_path TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 데이터베이스 서비스 API

데이터베이스 서비스는 다음과 같은 RESTful API를 제공합니다:

- `GET /api/conversations` - 모든 대화 목록 조회
- `GET /api/conversations/:id` - 특정 대화 상세 조회
- `POST /api/conversations` - 새 대화 생성
- `POST /api/conversations/:id/messages` - 대화에 메시지 추가
- `GET /api/model-configs` - 모델 설정 목록 조회
- `POST /api/model-configs` - 모델 설정 추가/수정
- `GET /api/mcp-servers` - MCP 서버 목록 조회
- `POST /api/mcp-servers` - MCP 서버 추가/수정

## 🚀 마이크로서비스 아키텍처 (MSA)

### 서비스 간 통신

서비스 간 통신은 RESTful API를 기본으로 하며, 일부 실시간 통신이 필요한 부분은 WebSocket을 사용합니다.

```
┌────────────────┐
│                │
│  API Gateway   │◄─────── Client Requests
│  (Next.js)     │
│                │
└───────┬────────┘
        │
        ▼
┌───────────────────┐
│                   │
│  Service Registry │
│  (Internal DNS)   │
│                   │
└─────┬──────┬──────┘
      │      │
      ▼      ▼
┌─────────┐  ┌─────────┐
│         │  │         │
│ Service │  │ Service │ ...
│    A    │  │    B    │
│         │  │         │
└─────────┘  └─────────┘
```

### 마이크로서비스 설계 원칙

1. **독립적 배포**
   - 각 서비스는 독립적으로 개발, 테스트, 배포 가능

2. **단일 책임**
   - 각 서비스는 특정 도메인에 집중

3. **격리된 상태**
   - 서비스 간 상태 공유 최소화

4. **장애 격리**
   - 한 서비스의 장애가 전체 시스템에 영향을 미치지 않도록 설계

### Docker 구성

각 마이크로서비스는 독립적인 Docker 컨테이너로 실행됩니다.

```yaml
# docker-compose.yml
version: '3.8'

services:
  api-gateway:
    build:
      context: .
      dockerfile: Dockerfile.nextjs
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MODEL_SERVICE_URL=http://model-service:4001
      - MCP_SERVICE_URL=http://mcp-service:4002
      - CONVERSATION_SERVICE_URL=http://conversation-service:4003
      - DB_SERVICE_URL=http://db-service:4004
    depends_on:
      - model-service
      - mcp-service
      - conversation-service
      - db-service

  model-service:
    build:
      context: ./services/model-service
      dockerfile: Dockerfile
    ports:
      - "4001:4001"
    environment:
      - PORT=4001
      - NODE_ENV=production
    volumes:
      - ./data/model-service:/app/data

  mcp-service:
    build:
      context: ./services/mcp-service
      dockerfile: Dockerfile
    ports:
      - "4002:4002"
    environment:
      - PORT=4002
      - NODE_ENV=production
    volumes:
      - ./data/mcp-service:/app/data

  conversation-service:
    build:
      context: ./services/conversation-service
      dockerfile: Dockerfile
    ports:
      - "4003:4003"
    environment:
      - PORT=4003
      - NODE_ENV=production
    depends_on:
      - db-service

  db-service:
    build:
      context: ./services/db-service
      dockerfile: Dockerfile
    ports:
      - "4004:4004"
    environment:
      - PORT=4004
      - NODE_ENV=production
    volumes:
      - ./data/db:/app/data/db
```

## 🧪 테스트 전략

### 테스트 계층

1. **단위 테스트**
   - 개별 함수 및 컴포넌트 테스트
   - Jest 및 React Testing Library 사용

2. **Storybook 테스트**
   - UI 컴포넌트 시각적 테스트
   - 상호작용 테스트

3. **통합 테스트**
   - 서비스 간 통합 테스트
   - API 엔드포인트 테스트

4. **E2E 테스트**
   - 전체 애플리케이션 흐름 테스트
   - Cypress 사용

### 테스트 자동화

GitHub Actions를 사용하여 CI/CD 파이프라인에서 테스트를 자동화합니다.

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run unit tests
        run: npm test
      - name: Run Storybook tests
        run: npm run test-storybook
      - name: Build project
        run: npm run build
```

## 📚 참고 자료

- [Model Context Protocol 공식 문서](https://modelcontextprotocol.github.io/documentation/)
- [Ollama 공식 문서](https://ollama.ai/documentation)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 19 릴리스 노트](https://react.dev/blog/2023/03/16/introducing-react-19)
- [Storybook 공식 문서](https://storybook.js.org/docs)
- [마이크로서비스 아키텍처 패턴](https://microservices.io/patterns/microservices.html)

## 🤝 기여 방법

1. 이슈 제출: 버그 또는 개선 사항을 이슈로 등록
2. Pull Request: 코드 개선 또는 새 기능 구현 후 PR 제출
3. 문서화: 문서 개선 또는 예제 추가

---

이 프로젝트는 MCP와 로컬 AI 모델을 효율적으로 통합하여 AI 시스템을 구축하는 데 도움이 되는 도구를 제공합니다. Docker 컨테이너화, React 19, Storybook, 마이크로서비스 아키텍처, SQLite를 활용하여 확장성과 유지보수성을 높였습니다. 지속적인 개발과 커뮤니티 피드백을 통해 더욱 발전시켜 나갈 계획입니다.