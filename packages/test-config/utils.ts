/**
 * 공통 테스트 유틸리티 함수
 */

/**
 * 비동기 함수 실행 시 발생하는 에러를 캡처하는 헬퍼 함수
 */
export async function expectToThrow(fn: () => Promise<any>, errorMessage?: string | RegExp): Promise<Error> {
  try {
    await fn();
    throw new Error('Expected function to throw an error, but it did not');
  } catch (error) {
    if (errorMessage) {
      if (errorMessage instanceof RegExp) {
        expect(error.message).toMatch(errorMessage);
      } else {
        expect(error.message).toContain(errorMessage);
      }
    }
    return error as Error;
  }
}

/**
 * 객체에서 특정 속성만 추출하는 헬퍼 함수
 */
export function pickProps<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((result, key) => {
    result[key] = obj[key];
    return result;
  }, {} as Pick<T, K>);
}

/**
 * 테스트용 타이머 헬퍼
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
