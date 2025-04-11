// Ollama 테스트를 위한 환경 변수 설정

// 테스트 환경에서는 실제 Ollama 프로세스 시작/종료 방지
process.env.SKIP_OLLAMA_START = 'true';
process.env.SKIP_OLLAMA_STOP = 'true';

// 모킹 활성화
process.env.MOCK_OLLAMA = 'true';
