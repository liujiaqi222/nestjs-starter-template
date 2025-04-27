import { ConfigService } from '@nestjs/config';
import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import * as winston from 'winston';
import * as util from 'util';

const colors = {
  reset: '\x1b[0m', // 重置所有格式
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};
@Injectable()
export class LoggerService implements NestLogger {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const { combine, timestamp, colorize, printf } = winston.format;
    const logFormat = combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 设置时间戳格式
      printf(({ timestamp, level, context, message, meta, trace }) => {
        const nestPrefix = `${colors.green}[Nest]${colors.reset}`;

        const contextStr = context
          ? `${colors.yellow}[${context}]${colors.reset}`
          : ''; // 如果有 context，用方括号括起来
        let log = `${nestPrefix} ${timestamp} ${level} ${contextStr} ${message}`; // 基本日志格式
        // 处理 meta 数据 (确保 meta 是对象且不为空)
        if (meta && typeof meta === 'object' && Object.keys(meta).length > 0) {
          log += ` - Meta: ${util.inspect(meta, { colors: true, depth: null })}`;
        }

        // 处理错误堆栈 (error 日志会包含 trace)
        if (trace) {
          log += `\nTrace: ${trace}`; // 将堆栈信息换行显示
        }

        return log;
      }),
    );

    this.logger = winston.createLogger({
      format: logFormat,
      transports: [new winston.transports.Console()],
    });
  }
  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, meta });
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { context, trace, meta });
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, meta });
  }

  debug(message: string, context?: string, meta?: any) {
    if (this.configService.get<string>('environment') === 'development') {
      this.logger.debug(message, { context, ...meta });
    }
  }

  verbose(message: string, context?: string, meta?: any) {
    this.logger.verbose(message, { context, ...meta });
  }
}
