// 테스트 환경 설정
process.env.NODE_ENV = 'test';

// Jest가 테스트에서 console.error를 출력하지 않도록 설정
// 실제 오류는 캡처하여 표시하도록 설정
const originalConsoleError = console.error;
console.error = (...args) => {
  // 데이터베이스 바인딩 관련 오류는 무시 (mock을 사용하므로)
  if (args[0] && typeof args[0] === 'string' && args[0].includes('bindings file')) {
    return;
  }
  originalConsoleError(...args);
};

// 테스트에 필요한 전역 mocks 설정
jest.mock('better-sqlite3', () => {
  return jest.fn().mockImplementation(() => {
    return {
      pragma: jest.fn(),
      prepare: jest.fn(),
      exec: jest.fn(),
      close: jest.fn()
    };
  });
});

beforeAll(() => {
  console.log('Starting DB-service tests in test environment');
});

afterAll(() => {
  console.log('Completed DB-service tests');
});

// 각 테스트 후 모든 mocks 초기화
afterEach(() => {
  jest.clearAllMocks();
});