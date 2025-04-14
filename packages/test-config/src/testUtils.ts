/**
 * 테스트 유틸리티 함수 모음
 * 테스트 작성을 돕는 일반적인 유틸리티 함수들
 */

/**
 * 비동기 함수 실행 시 발생하는 에러를 캡처하는 헬퍼 함수
 */
export async function expectToThrow(fn: () => Promise<any>, errorMessage?: string | RegExp): Promise<Error> {
  try {
    await fn();
    throw new Error('Expected function to throw an error, but it did not');
  } catch (error: any) {
    if (errorMessage) {
      if (errorMessage instanceof RegExp) {
        expect(error.message).toMatch(errorMessage);
      } else {
        expect(error?.message).toContain(errorMessage);
      }
    }
    return error as Error;
  }
}

/**
 * 객체에서 특정 속성만 추출
 * @param obj 원본 객체
 * @param keys 추출할 키 배열
 * @returns 추출된 속성만 포함하는 객체
 */
export const extractProps = <T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
};

/**
 * 테스트용 타이머 헬퍼
 * Promise를 특정 시간 동안 대기시킴
 * @param ms 대기할 시간 (밀리초)
 * @returns Promise
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 테스트 데이터 생성 도우미
 * @param overrides 기본 데이터를 오버라이드할 속성
 * @returns 테스트 데이터 객체
 */
export function createTestData<T extends Record<string, any>>(
  defaultData: T,
  overrides: Partial<T> = {}
): T {
  return { ...defaultData, ...overrides };
}

/**
 * jest-fetch-mock을 위한 도우미 함수
 * @param status HTTP 상태 코드
 * @param data 응답 데이터
 * @param headers 헤더 객체
 * @returns 모킹된 fetch 응답
 */
export const mockFetchResponse = (status: number, data: any, headers = {}) => {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: new Headers(headers),
    json: jest.fn().mockResolvedValue(data)
  };
};
