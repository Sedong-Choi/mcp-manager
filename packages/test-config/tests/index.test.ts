/**
 * 테스트 구성 패키지에 대한 기본 테스트
 */

import testConfig from '../src';
import * as mockHelpers from '../src/mockHelpers';
import * as testUtils from '../src/testUtils';

describe('test-config', () => {
  describe('package exports', () => {
    it('should export testConfig object with setupEnvironment', () => {
      expect(testConfig).toBeDefined();
      expect(typeof testConfig.setupEnvironment).toBe('function');
    });

    it('should export mockHelpers', () => {
      expect(mockHelpers).toBeDefined();
      expect(typeof mockHelpers.mockAxios).toBe('function');
      expect(typeof mockHelpers.mockUuid).toBe('function');
      expect(typeof mockHelpers.mockDate).toBe('function');
    });

    it('should export testUtils', () => {
      expect(testUtils).toBeDefined();
      expect(typeof testUtils.wait).toBe('function');
      expect(typeof testUtils.createTestData).toBe('function');
      expect(typeof testUtils.extractProps).toBe('function');
      expect(typeof testUtils.expectToThrow).toBe('function');
      expect(typeof testUtils.mockFetchResponse).toBe('function');
    });
  });

  describe('setupEnvironment', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log environment setup message', () => {
      testConfig.setupEnvironment();
      expect(consoleSpy).toHaveBeenCalledWith('MCP 테스트 환경 설정 로드 중...');
    });
  });
});
