/**
 * Jest를 위한 커스텀 모듈 리졸버
 * 테스트 실행 중 워크스페이스 패키지의 소스를 직접 참조합니다
 */
const path = require('path');
const fs = require('fs');

module.exports = (request, options) => {
  // 워크스페이스 패키지를 처리합니다
  if (request.startsWith('@mcp/')) {
    const packageName = request.split('/')[1];
    const packageSrcPath = path.resolve(__dirname, 'packages', packageName, 'src');
    
    // 소스 디렉토리가 존재하면 index.ts를 반환
    if (fs.existsSync(packageSrcPath)) {
      return path.resolve(packageSrcPath, 'index.ts');
    }
  }
  
  // 그 외의 경우 기본 리졸버 사용
  return options.defaultResolver(request, options);
};
