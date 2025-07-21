import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { MongoError } from 'mongodb';

@Catch(QueryFailedError, MongoError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: QueryFailedError | MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error occurred';
    let error = 'Internal Server Error';

    if (exception instanceof QueryFailedError) {
      // PostgreSQL/TypeORM errors
      const pgError = exception.driverError as any;
      
      switch (pgError.code) {
        case '23505': // Unique violation
          status = HttpStatus.CONFLICT;
          message = 'Resource already exists';
          error = 'Conflict';
          break;
        case '23503': // Foreign key violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Referenced resource does not exist';
          error = 'Bad Request';
          break;
        case '23514': // Check violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid data provided';
          error = 'Bad Request';
          break;
        case '23502': // Not null violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Required field is missing';
          error = 'Bad Request';
          break;
        default:
          this.logger.error(`PostgreSQL Error Code: ${pgError.code}`, pgError);
      }
    } else if (exception instanceof MongoError) {
      // MongoDB errors
      switch (exception.code) {
        case 11000: // Duplicate key
          status = HttpStatus.CONFLICT;
          message = 'Resource already exists';
          error = 'Conflict';
          break;
        case 121: // Document validation failure
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid data provided';
          error = 'Bad Request';
          break;
        default:
          this.logger.error(`MongoDB Error Code: ${exception.code}`, exception);
      }
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    this.logger.error(
      `Database Exception: ${request.method} ${request.url} - ${status} - ${message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }
}
