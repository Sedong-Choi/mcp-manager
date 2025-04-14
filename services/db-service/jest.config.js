/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: '@mcp/test-config',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json',
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/node_modules/@mcp/test-config/src/setupTests.ts'],
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.d.ts',
  ],
  clearMocks: true,
  resetMocks: false,
  verbose: true,
  testTimeout: 10000
};
