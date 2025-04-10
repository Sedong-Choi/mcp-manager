/**
 * model-service 특화 테스트 설정
 * (공통 설정 위에 추가되는 서비스별 설정)
 */

// 테스트 환경 변수 설정
process.env.OLLAMA_API_URL = 'http://test-ollama-server:11434';
process.env.PORT = '4001';

// model-service 특화 모의(mock) 설정
jest.mock('axios');
