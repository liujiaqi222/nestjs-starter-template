import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './core/logger/logger.service';

@Injectable()
export class AppService {
  @Inject() // 注入的方式引入 logger
  logger: LoggerService;

  @Inject()
  configService: ConfigService;

  getHello(): string {
    throw new InternalServerErrorException('hello')
    this.logger.log(this.configService.get('environment'));
    this.logger.log(this.configService.get('redis.host'));
    return 'Hello World!';
  }
}
