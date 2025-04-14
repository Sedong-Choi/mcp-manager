// 공통 테스트 설정 파일

// 테스트 타임아웃 설정
jest.setTimeout(10000);

// 전역 콘솔 에러 처리
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

// 테스트 환경 진입 메시지
beforeAll(() => {
  console.log('테스트 시작: MCP 테스트 환경 설정 로드됨');
});

// Jest setup fil
// Add any global setup code for Jest here

// Example: Mocking a global function
// global.fetch = jest.fn();
