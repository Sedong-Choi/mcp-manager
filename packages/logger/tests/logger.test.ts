import logger, { createLogger } from '../src/index';

describe('Logger', () => {
  const originalConsoleLog = console.log;
  const mockConsoleLog = jest.fn();
  
  beforeEach(() => {
    console.log = mockConsoleLog;
  });
  
  afterEach(() => {
    console.log = originalConsoleLog;
    jest.clearAllMocks();
  });
  
  it('should export default logger instance', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });
  
  it('should create a logger with custom service name', () => {
    const customLogger = createLogger('test-service');
    expect(customLogger).toBeDefined();
    
    // 로거 메서드 호출이 에러 없이 실행되는지 확인
    expect(() => {
      customLogger.info('test message');
      customLogger.error('test error');
    }).not.toThrow();
  });
});
