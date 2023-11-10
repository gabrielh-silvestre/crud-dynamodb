import { PipeTransform } from '@nestjs/common';
import { ZodError, ZodObject } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: any) {
    try {
      this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }

    return value;
  }
}
