import winston from 'winston';

// 기본 로그 포맷 정의
const { format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

// 커스텀 로그 포맷 생성
const logFormat = printf(({ level, message, timestamp, service }) => {
  return `${timestamp} [${service || 'mcp'}] ${level}: ${message}`;
});

// 기본 로거 인스턴스 생성
const defaultLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  defaultMeta: { service: 'mcp' },
  transports: [
    // 콘솔 출력 트랜스포트
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        logFormat
      )
    }),
    // 파일 출력은 필요시 활성화
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' }),
  ]
});

// 서비스별 로거 생성 함수
export function createLogger(service: string) {
  return defaultLogger.child({ service });
}

// 기본 로거 내보내기
export const logger = defaultLogger;

export default logger;
