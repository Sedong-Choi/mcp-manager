/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseConfig = require('@mcp/test-config/jest');

module.exports = {
  ...baseConfig,
  // model-service 특화 설정
  setupFilesAfterEnv: [
    '@mcp/test-config/setup.ts',
    '<rootDir>/tests/setupTests.ts'
  ],
  // path alias를 Jest에서 사용하기 위한 설정
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
