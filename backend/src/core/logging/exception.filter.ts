import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerServiceImpl } from './logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerServiceImpl) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status: number;
    let message: string;
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const msg = (exceptionResponse as Record<string, unknown>).message;
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : typeof msg === 'string'
          ? msg
          : exception.message;
      stack = exception.stack;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception instanceof Error ? exception.message : 'Internal server error';
      stack = exception instanceof Error ? exception.stack : undefined;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: Array.isArray(message) ? message : [message],
    };

    this.logger.error(
      `[${request.method}] ${request.url} - ${status} - ${message}`,
      stack,
      'Exception',
    );

    response.status(status).json(errorResponse);
  }
}