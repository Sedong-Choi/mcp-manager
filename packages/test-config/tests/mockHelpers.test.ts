import { mockAxios, mockUuid, mockDate } from '../src/mockHelpers';

describe('mockHelpers', () => {
  describe('mockAxios', () => {
    it('should setup a mock axios instance', () => {
      const result = mockAxios().create();
      
      expect(result.get).toBeDefined();
      expect(result.post).toBeDefined();
      expect(result.put).toBeDefined();
      expect(result.delete).toBeDefined();
      expect(result.interceptors.request.use).toBeDefined();
      expect(result.interceptors.response.use).toBeDefined();
    });
  });

  describe('mockUuid', () => {
    it('should setup a mock uuid function with default value', () => {
      const result = mockUuid();
      expect(result.v4()).toBe('test-uuid-123');
    });

    it('should setup a mock uuid function with custom value', () => {
      const customId = 'custom-uuid';
      const result = mockUuid(customId);
      expect(result.v4()).toBe(customId);
    });
  });

  describe('mockDate', () => {
    it('should mock the Date object', () => {
      const fixedDate = new Date('2023-01-01T00:00:00Z');
      const restore = mockDate(fixedDate);
      
      expect(new Date().getTime()).toBe(fixedDate.getTime());
      expect(Date.now()).toBe(fixedDate.getTime());
      
      restore();
      // After restore, Date should work normally
      expect(new Date().getTime()).not.toBe(fixedDate.getTime());
    });
  });
});
