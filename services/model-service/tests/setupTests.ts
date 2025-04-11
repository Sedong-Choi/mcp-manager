/**
 * model-service 특화 테스트 설정
 * (공통 설정 위에 추가되는 서비스별 설정)
 */

// 테스트 환경 변수 설정
process.env.OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://test-ollama-server:11434';
process.env.PORT = process.env.PORT || '4001';

// nock 설정
import nock from 'nock';
nock.disableNetConnect();
// localhost 연결은 허용 (통합 테스트용)
nock.enableNetConnect(/localhost|127\.0\.0\.1/);

// model-service 특화 모의(mock) 설정
jest.mock('axios');
