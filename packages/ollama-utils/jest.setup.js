// This file runs after the Jest testing framework is installed in the environment
// but before the test code itself.

// Add global configurations or mocks here
jest.setTimeout(10000); // Set timeout for all tests

// Enable fake timers for all tests by default
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
