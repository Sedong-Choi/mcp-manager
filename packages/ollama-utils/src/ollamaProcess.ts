import { spawn, ChildProcess } from 'child_process';
import { createLogger } from '@mcp/logger';

const logger = createLogger('ollama-process');

export class OllamaProcess {
  private process: ChildProcess | null = null;
  private static instance: OllamaProcess | null = null;
  private isStarting: boolean = false;
  private startPromise: Promise<void> | null = null;

  // 싱글톤 패턴 구현
  static getInstance(): OllamaProcess {
    if (!OllamaProcess.instance) {
      OllamaProcess.instance = new OllamaProcess();
    }
    return OllamaProcess.instance;
  }

  // 싱글톤으로만 생성 가능하도록 private 생성자 선언
  private constructor() {}

  async start(): Promise<void> {
    // 이미 시작 중이면 기존 프로미스 반환
    if (this.isStarting && this.startPromise) {
      return this.startPromise;
    }

    // 이미 실행 중이면 바로 반환
    if (this.process) {
      logger.warn('Ollama process is already running');
      return Promise.resolve();
    }

    // 시작 상태로 표시
    this.isStarting = true;
    
    // 시작 프로미스 저장
    this.startPromise = new Promise<void>((resolve, reject) => {
      try {
        this.process = spawn('ollama', ['serve'], {
          stdio: 'pipe',
          detached: false
        });

        this.process.stdout?.on('data', (data) => {
          logger.info(`Ollama stdout: ${data}`);
        });

        this.process.stderr?.on('data', (data) => {
          logger.info(`Ollama stderr: ${data}`);
        });

        this.process.on('error', (err) => {
          logger.error(`Failed to start Ollama: ${err.message}`);
          this.process = null;
          this.isStarting = false;
          reject(new Error(`Failed to start Ollama: ${err.message}`));
        });

        this.process.on('exit', (code, signal) => {
          logger.info(`Ollama process exited with code ${code} and signal ${signal}`);
          this.process = null;
          this.isStarting = false;
        });

        // Ollama 서버 시작 대기
        setTimeout(() => {
          this.isStarting = false;
          logger.info('Ollama server started');
          resolve();
        }, 2000);
      } catch (error) {
        this.isStarting = false;
        logger.error('Error starting Ollama server:', error);
        reject(new Error('Failed to start Ollama server'));
      }
    });

    return this.startPromise;
  }

  stop(): void {
    if (this.process) {
      this.process.kill();
      this.process = null;
      this.isStarting = false;
      this.startPromise = null;
      logger.info('Ollama server stopped');
    }
  }

  isRunning(): boolean {
    return this.process !== null;
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const instance = OllamaProcess.getInstance();
export default instance;
