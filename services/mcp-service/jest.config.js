/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: '@mcp/test-config',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true,
      tsconfig: '<rootDir>/tsconfig.json',
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTest.js'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.d.ts',
  ],
  verbose: true,
  testTimeout: 10000
};
