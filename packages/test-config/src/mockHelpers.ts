// 테스트를 위한 공통 모킹 헬퍼 함수

/**
 * Axios 모킹 헬퍼
 * @returns 모킹된 Axios 객체
 */
export function mockAxios() {
  return {
    create: jest.fn().mockReturnValue({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn()
        },
        response: {
          use: jest.fn()
        }
      }
    })
  };
}

/**
 * UUID 생성기 모킹 헬퍼
 * @param value 반환할 UUID 값
 * @returns 모킹된 UUID 객체
 */
export function mockUuid(value: string = 'test-uuid-123') {
  return {
    v4: jest.fn().mockReturnValue(value)
  };
}

/**
 * 날짜 모킹 헬퍼
 * @param date 사용할 날짜 객체
 */
export function mockDate(date: Date) {
  const originalDate = global.Date;
  
  // Date 생성자 모킹
  global.Date = jest.fn(() => date) as any;
  global.Date.UTC = originalDate.UTC;
  global.Date.parse = originalDate.parse;
  global.Date.now = jest.fn(() => date.getTime());
  
  // 원래 구현으로 복원하는 함수 반환
  return () => {
    global.Date = originalDate;
  };
}
