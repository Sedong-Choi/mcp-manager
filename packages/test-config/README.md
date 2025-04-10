# MCP Manager Pro Test Configuration

MCP Manager Pro 프로젝트의 모든 마이크로서비스에서 사용할 공통 테스트 설정 패키지입니다.

## 설치

서비스 디렉토리에서 다음 명령어로 패키지를 설치합니다:

```bash
pnpm add -D @mcp/test-config
```

## 사용 방법

### 1. Jest 설정

서비스의 `jest.config.js` 파일에서 다음과 같이 설정합니다:

```js
module.exports = {
  preset: '@mcp/test-config/jest-preset',
  // 필요한 추가 설정
};
```

### 2. 유틸리티 함수 사용

테스트 파일에서 유틸리티 함수를 임포트하여 사용할 수 있습니다:

```typescript
import { mockAxios, mockUuid, mockDate } from '@mcp/test-config';

describe('테스트 스위트', () => {
  let restoreDateMock;

  beforeEach(() => {
    // Axios 모킹
    jest.mock('axios', () => mockAxios());
    
    // UUID 모킹
    jest.mock('uuid', () => mockUuid());
    
    // 날짜 모킹
    const fixedDate = new Date('2023-01-01T00:00:00Z');
    restoreDateMock = mockDate(fixedDate);
  });

  afterEach(() => {
    if (restoreDateMock) {
      restoreDateMock();
    }
  });

  it('테스트 케이스', () => {
    // 테스트 구현
  });
});
```

## 커스터마이징

서비스별 특정 설정이 필요한 경우, `jest.config.js`에서 추가 설정을 오버라이드할 수 있습니다.
