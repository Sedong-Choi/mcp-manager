import ollamaProcess, { OllamaProcess } from '../src/ollamaProcess';
import * as childProcess from 'child_process';
import { createLogger } from '@mcp/logger';

// Mock the logger to prevent console output during tests
jest.mock('@mcp/logger', () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  })
}));

// Setup mock for child_process.spawn
const mockChildProcess = {
  stdout: {
    on: jest.fn()
  },
  stderr: {
    on: jest.fn()
  },
  on: jest.fn(),
  kill: jest.fn()
};

jest.mock('child_process', () => ({
  spawn: jest.fn().mockReturnValue(mockChildProcess)
}));

// Get access to the mocked function
const spawnMock = childProcess.spawn as jest.MockedFunction<typeof childProcess.spawn>;

describe('OllamaProcess', () => {
  let instance: OllamaProcess;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the singleton instance for each test
    // @ts-ignore: Accessing private static property
    OllamaProcess.instance = null;
    instance = OllamaProcess.getInstance();
  });
  
  // No need for timer setup/cleanup since it's handled in jest.setup.js
  
  it('should be a singleton', () => {
    const instance1 = OllamaProcess.getInstance();
    const instance2 = OllamaProcess.getInstance();
    expect(instance1).toBe(instance2);
  });
  
  it('should start and stop Ollama process', async () => {
    // Setup mock to simulate successful process start
    mockChildProcess.on.mockImplementation((event, callback) => {
      // Don't trigger error or exit events
      return mockChildProcess;
    });

    // Call the start method
    const startPromise = instance.start();
    
    // Manually trigger the setTimeout callback (simulate successful startup)
    jest.advanceTimersByTime(2000);
    
    // Wait for the promise to resolve
    await startPromise;
    
    // Check that spawn was called correctly
    expect(spawnMock).toHaveBeenCalledWith('ollama', ['serve'], expect.any(Object));
    expect(instance.isRunning()).toBe(true);
    
    // Check stop method
    instance.stop();
    expect(mockChildProcess.kill).toHaveBeenCalled();
    expect(instance.isRunning()).toBe(false);
  });
  
  it('should return existing ollamaProcess instance', () => {
    expect(ollamaProcess).toBeInstanceOf(OllamaProcess);
  });
});
