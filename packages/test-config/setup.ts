/**
 * 공통 테스트 설정 파일
 */

// 테스트 타임아웃 설정 (10초)
jest.setTimeout(10000);

// 콘솔 에러 필터링
const originalConsoleError = console.error;
console.error = (...args) => {
  // 특정 에러 메시지 필터링 (필요시 추가)
  if (args[0]?.includes('test error that can be ignored')) {
    return;
  }
  originalConsoleError(...args);
};

// 테스트 실행 후 원래 console.error로 복원
afterAll(() => {
  console.error = originalConsoleError;
});
