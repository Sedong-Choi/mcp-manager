// MCP 서비스 테스트 설정

// 테스트를 위한 환경 변수 설정 (필요시)
process.env.NODE_ENV = 'test';
process.env.PORT = '4002';

// Jest 타임아웃 설정
jest.setTimeout(10000);

// 콘솔 출력 목킹 (테스트 출력 정리)
global.console = {
  ...console,
  // 테스트 중 불필요한 로그 출력 방지
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
