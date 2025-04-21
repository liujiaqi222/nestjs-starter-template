import { ConfigService } from '@nestjs/config';
import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import * as winston from 'winston';
import * as util from 'util';
@Injectable()
export class LoggerService implements NestLogger {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const isDev = this.configService.get('environment') === 'development';
    const { combine, timestamp, json, colorize, printf } = winston.format;
    const logFormat = isDev
      ? combine(
          colorize(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 设置时间戳格式
          printf(({ timestamp, level, context, message, meta, trace }) => {
            const contextStr = context ? `[${context}]` : ''; // 如果有 context，用方括号括起来
            let log = `${contextStr} ${timestamp} ${level}  ${message}`; // 基本日志格式
            // 处理 meta 数据 (确保 meta 是对象且不为空)
            if (
              meta &&
              typeof meta === 'object' &&
              Object.keys(meta).length > 0
            ) {
              // 使用 util.inspect 进行美化输出，更适合控制台
              // colors: true 在支持颜色的终端中显示颜色
              // depth: null 表示无限递归深度
              log += ` - Meta: ${util.inspect(meta, { colors: true, depth: null })}`;
            }

            // 处理错误堆栈 (error 日志会包含 trace)
            if (trace) {
              log += `\nTrace: ${trace}`; // 将堆栈信息换行显示
            }

            return log;
          }),
        )
      : combine(timestamp(), json());
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
