import { HttpStatus } from '@nestjs/common';

export class AppError extends Error {
  isOperational: boolean;
  readonly status: HttpStatus;
  readonly message: string;

  constructor(message: string, status: HttpStatus) {
    super(message);
    this.status = status;
    this.message = message;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
