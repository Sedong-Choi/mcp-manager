// Setup fake timers for all tests
jest.useFakeTimers();

// Load environment setup
require('./setupEnv');

// Set a reasonable timeout for tests
jest.setTimeout(10000);
