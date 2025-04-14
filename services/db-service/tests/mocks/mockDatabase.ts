// 테스트 환경을 위한 가상 DB 모듈
// 데이터베이스 접근 mocking을 위한 객체

// 결과 데이터를 설정하는 helper 함수
const setupResultFor = (mockFn, result) => {
  return mockFn.mockImplementation(() => Promise.resolve(result));
};

// 쿼리 빌더 메서드를 가진 객체 
const queryBuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  whereIn: jest.fn().mockReturnThis(),
  whereNotIn: jest.fn().mockReturnThis(), 
  whereNull: jest.fn().mockReturnThis(),
  whereNotNull: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  rightJoin: jest.fn().mockReturnThis(),
  fullOuterJoin: jest.fn().mockReturnThis(),
  join: jest.fn().mockReturnThis(),
  having: jest.fn().mockReturnThis(),
  first: jest.fn(),
  count: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  del: jest.fn(), // delete는 예약어라서 del 사용
  returning: jest.fn().mockReturnThis(),
  then: jest.fn(),
  raw: jest.fn().mockResolvedValue({}),
};

// 모킹된 knex 함수: 테이블 이름을 인자로 받고, 쿼리 빌더 객체 반환
const mockDB = jest.fn().mockImplementation(() => queryBuilder);

// 테스트에서 직접 접근할 수 있게 메소드들을 mockDB 객체에도 추가
mockDB.select = jest.fn().mockReturnThis();
mockDB.from = jest.fn().mockReturnThis();
mockDB.where = jest.fn().mockReturnThis();
mockDB.whereIn = jest.fn().mockReturnThis();
mockDB.whereNotIn = jest.fn().mockReturnThis();
mockDB.whereNull = jest.fn().mockReturnThis();
mockDB.whereNotNull = jest.fn().mockReturnThis();
mockDB.andWhere = jest.fn().mockReturnThis();
mockDB.orWhere = jest.fn().mockReturnThis();
mockDB.orderBy = jest.fn().mockReturnThis();
mockDB.groupBy = jest.fn().mockReturnThis();
mockDB.limit = jest.fn().mockReturnThis();
mockDB.offset = jest.fn().mockReturnThis();
mockDB.join = jest.fn().mockReturnThis();
mockDB.innerJoin = jest.fn().mockReturnThis();
mockDB.leftJoin = jest.fn().mockReturnThis();
mockDB.rightJoin = jest.fn().mockReturnThis();
mockDB.fullOuterJoin = jest.fn().mockReturnThis();
mockDB.having = jest.fn().mockReturnThis();
mockDB.first = jest.fn();
mockDB.count = jest.fn();
mockDB.insert = jest.fn();
mockDB.update = jest.fn();
mockDB.del = jest.fn();
mockDB.returning = jest.fn().mockReturnThis();
mockDB.then = jest.fn();

// 트랜잭션 지원
mockDB.transaction = jest.fn().mockImplementation(cb => 
  Promise.resolve(cb({
    commit: jest.fn().mockResolvedValue(true),
    rollback: jest.fn().mockResolvedValue(true),
    // 트랜잭션 내에서도 동일한 쿼리 빌더 인터페이스 제공
    ...queryBuilder
  }))
);

// Raw 쿼리 지원
mockDB.raw = jest.fn().mockResolvedValue({});

// Utility methods for tests to set expected results
mockDB.__setResults = function(results) {
  setupResultFor(this.then, results);
  return this;
};

mockDB.__setFirstResult = function(result) {
  setupResultFor(this.first, result);
  return this;
};

mockDB.__setInsertResult = function(result) {
  setupResultFor(this.insert, result);
  return this;
};

mockDB.__setUpdateResult = function(result) {
  setupResultFor(this.update, result);
  return this;
};

mockDB.__setDeleteResult = function(result) {
  setupResultFor(this.del, result);
  return this;
};

// 테스트에서 사용하는 reset 메서드 추가
mockDB.reset = function() {
  // 함수 자신의 모킹 초기화
  this.mockClear();
  
  // 모든 직접 메서드 초기화
  Object.keys(this).forEach(key => {
    if (typeof this[key] === 'function' && this[key].mockClear) {
      this[key].mockClear();
    }
  });
  
  // queryBuilder 내의 모든 메서드 초기화
  Object.keys(queryBuilder).forEach(key => {
    if (typeof queryBuilder[key] === 'function' && queryBuilder[key].mockClear) {
      queryBuilder[key].mockClear();
    }
  });
  
  console.log('Mock database reset completed');
  return this;
};

// 데이터베이스 모듈이 모킹되도록 설정
jest.mock('../../src/database', () => mockDB);

// mockDB 함수를 내보내기
export default mockDB;
