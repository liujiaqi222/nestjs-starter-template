import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/core/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}
  use(req: Request, res: Response, next: () => void) {
    console.log('working');
    res.on('finish', () => {
      const { statusCode } = res;
      const logMessage = `${req.url} ${statusCode} ${req.method}`;
      if (statusCode >= 500) {
        this.logger.error(logMessage, undefined, `HTTP`, {
          body: req.body,
          query: req.query,
          params: req.params,
        });
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage, undefined, `HTTP`);
      } else {
        this.logger.log(logMessage, 'HTTP');
      }
    });
    next();
  }
}
