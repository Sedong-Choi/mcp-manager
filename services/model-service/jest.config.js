/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseConfig = require('@mcp/test-config/jest');

module.exports = {
  ...baseConfig,
  // model-service 특화 설정 (필요한 경우)
  setupFilesAfterEnv: [
    '@mcp/test-config/setup.ts',
    '<rootDir>/tests/setupTests.ts' // 서비스별 추가 설정이 필요한 경우
  ]
};
