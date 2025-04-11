// Improved preset with better defaults
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json',
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/src/**/*.test.ts', '**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Workspace mappings
    '^@mcp/logger$': '<rootDir>/../logger/src/index.ts',
    '^@mcp/ollama-utils$': '<rootDir>/../ollama-utils/src/index.ts'
  },
  // Use a default setup file from test-config, services can extend with their own
  setupFilesAfterEnv: ['../..//packages/test-config/src/setupTests.ts'],
  clearMocks: true,
  resetMocks: false,
  verbose: true,
  testTimeout: 10000,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage'
};
