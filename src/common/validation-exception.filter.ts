import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
  errors: ValidationError[];
  constructor(errors: ValidationError[]) {
    super({ message: 'Validation failed' }, HttpStatus.BAD_REQUEST);
    this.errors = errors;
  }
}
