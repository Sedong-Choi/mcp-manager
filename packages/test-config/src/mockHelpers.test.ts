import { mockAxios, mockUuid, mockDate } from './mockHelpers';

describe('mockHelpers', () => {
  describe('mockAxios', () => {
    it('should return a mocked axios instance', () => {
      const mockedAxios = mockAxios();
      
      expect(typeof mockedAxios.create).toBe('function');
      
      const instance = mockedAxios.create();
      expect(typeof instance.get).toBe('function');
      expect(typeof instance.post).toBe('function');
      expect(typeof instance.interceptors.request.use).toBe('function');
      expect(typeof instance.interceptors.response.use).toBe('function');
    });
  });

  describe('mockUuid', () => {
    it('should return a mocked uuid with custom value', () => {
      const customValue = 'custom-uuid-value';
      const mockedUuid = mockUuid(customValue);
      
      expect(typeof mockedUuid.v4).toBe('function');
      expect(mockedUuid.v4()).toBe(customValue);
    });

    it('should return a mocked uuid with default value', () => {
      const mockedUuid = mockUuid();
      
      expect(typeof mockedUuid.v4).toBe('function');
      expect(mockedUuid.v4()).toBe('test-uuid-123');
    });
  });

  describe('mockDate', () => {
    it('should mock Date constructor and restore it', () => {
      const originalDate = global.Date;
      const fixedDate = new Date('2023-01-01T00:00:00Z');
      
      const restoreMock = mockDate(fixedDate);
      
      expect(new Date()).toBe(fixedDate);
      expect(Date.now()).toBe(fixedDate.getTime());
      
      restoreMock();
      expect(global.Date).toBe(originalDate);
    });
  });
});
