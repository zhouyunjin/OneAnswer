import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerServiceImpl } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerServiceImpl) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;
    const startTime = Date.now();
    const userId = user?.id || 'anonymous';

    this.logger.debug(`[${method}] ${url} - Request from user: ${userId}`, 'HTTP');

    if (process.env.LOG_BODY === 'true') {
      this.logger.debug(`Request body: ${JSON.stringify(body)}`, 'HTTP');
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          this.logger.log(
            `[${method}] ${url} - ${responseTime}ms - Status: ${context.switchToHttp().getResponse().statusCode}`,
            'HTTP',
          );
          if (process.env.LOG_RESPONSE === 'true') {
            this.logger.debug(`Response: ${JSON.stringify(data).substring(0, 500)}`, 'HTTP');
          }
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          this.logger.error(
            `[${method}] ${url} - ${responseTime}ms - Error: ${error.message}`,
            error.stack,
            'HTTP',
          );
        },
      }),
    );
  }
}