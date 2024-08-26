import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';
import { JsonWebTokenError } from '@nestjs/jwt';

import { Environment } from '../env.validate';
import { ValidationException } from './validation-exception.filter';

import { AppError } from '~/common/app-error.common';
import { ErrorMessage } from '~/common/error-messages.enum';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(err: any, host: ArgumentsHost): Response<JSON> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    let status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;

    let message: { [key: string]: any } | string =
      ErrorMessage.CUSTOM_SERVER_ERROR;

    let data: { [x: string]: any } | undefined | string = undefined;

    const errCode: string = err.code || false;

    if (err instanceof AppError) {
      message = { err };
    }

    if (errCode && errCode?.startsWith('SMTP')) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = ErrorMessage.FAILED_TO_SEND_EMAIL;
    } else if (err.message === ErrorMessage.JWT_EXPIRED) {
      status = HttpStatus.BAD_REQUEST;
    }

    if (typeof err.message === 'string') {
      ({ message } = err);
    }

    if (process.env.NODE_ENV === Environment.DEVELOPMENT) {
      data = {
        message: err.message,
        stack: err.stack,
      };
    }

    if (err instanceof ValidationException) {
      if (err.errors instanceof Array) {
        data = err.errors.map((err: ValidationError) => ({
          property: err.property,
          constraints: Object.values(err.constraints),
        }));
      } else data = err.getResponse();
    }

    if (err instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
    }

    return res.status(status).json({
      status,
      message,
      data,
    });
  }
}
