export { default as ollamaProcess, OllamaProcess } from './ollamaProcess';

// Jest 환경에서만 jest를 불러오도록 조건부 import
let jest: any;
try {
  // Jest 환경에서는 @jest/globals가 사용 가능
  jest = require('@jest/globals').jest;
} catch (e) {
  // Jest 외 환경에서는 mock 객체 생성
  jest = { fn: () => jest.fn };
}

/**
 * Ollama 서버를 테스트를 위해 시작하고 종료하는 유틸리티 함수
 * Jest describe() 함수 내에서 호출해야 합니다.
 */
export const setupOllamaForTests = () => {
  const ollamaProcess = require('./ollamaProcess').default;
  
  // Jest가 전역에 있는지 확인
  if (typeof beforeAll !== 'function' || typeof afterAll !== 'function') {
    throw new Error('setupOllamaForTests must be called within a Jest test context');
  }
  
  // 테스트 시작 전에 Ollama 서버 시작
  beforeAll(async () => {
    if (!process.env.SKIP_OLLAMA_START) {
      await ollamaProcess.start();
    }
  }, 10000); // 타임아웃 증가 (Ollama 시작에 시간이 걸릴 수 있음)

  // 테스트 종료 후에 Ollama 서버 종료
  afterAll(() => {
    if (!process.env.SKIP_OLLAMA_STOP) {
      ollamaProcess.stop();
    }
  });
};

/**
 * Ollama 프로세스를 직접 제어하는 함수들
 * Jest 환경이 아닌 곳에서 사용 가능
 */
export const ollamaTestUtils = {
  async startOllama() {
    const ollamaProcess = require('./ollamaProcess').default;
    return ollamaProcess.start();
  },
  
  stopOllama() {
    const ollamaProcess = require('./ollamaProcess').default;
    ollamaProcess.stop();
  },
  
  isOllamaRunning() {
    const ollamaProcess = require('./ollamaProcess').default;
    return ollamaProcess.isRunning();
  }
};
