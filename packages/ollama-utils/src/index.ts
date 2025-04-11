export { default as ollamaProcess, OllamaProcess } from './ollamaProcess';

// 테스트에서 사용할 수 있는 헬퍼 함수
export const setupOllamaForTests = async () => {
  const { default: ollamaProcess } = await import('./ollamaProcess');
  
  beforeAll(async () => {
    if (!process.env.SKIP_OLLAMA_START) {
      await ollamaProcess.start();
    }
  });

  afterAll(() => {
    if (!process.env.SKIP_OLLAMA_STOP) {
      ollamaProcess.stop();
    }
  });
};
