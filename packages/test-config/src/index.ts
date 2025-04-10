// 테스트 설정 패키지의 메인 엔트리 포인트
export * from './mockHelpers';

// 설정 내보내기
export const testConfig = {
  setupEnvironment: () => {
    console.log('MCP 테스트 환경 설정 로드 중...');
    // 추가 환경 설정이 필요하면 여기에 구현
  }
};

export default testConfig;
