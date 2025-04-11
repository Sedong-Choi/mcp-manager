// Jest 설정 파일

// Set environment to test
process.env.NODE_ENV = 'test';

// 전역 테스트 환경 설정
jest.setTimeout(10000); // 테스트 타임아웃 설정 (10초)

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// 전역 특별 지시어
/* eslint-disable-next-line no-console */
const originalConsoleError = console.error;
console.error = (...args) => {
  // 일부 예상 가능한 에러는 필터링 (옵션)
  if (args[0]?.includes('test error that can be ignored')) {
    return;
  }
  originalConsoleError(...args);
};

// Jest 완료 후 정리
afterAll(() => {
  console.error = originalConsoleError;
});
