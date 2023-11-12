import {
  PipeTransform,
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { isValidationError } from 'zod-validation-error';

import { ZodValidationPipe } from './ZodValidation.pipe';
import { ZProductCreateDto } from '@/entity/Product';

@Injectable()
export class CreateProductPipe
  extends ZodValidationPipe
  implements PipeTransform
{
  constructor() {
    super(ZProductCreateDto);
  }

  transform(value: any) {
    const isFile = value?.fieldname === 'file';
    if (isFile) return value;

    try {
      return super.transform({
        ...value,
        price: Number(value.price),
        availableQuantity: Number(value.availableQuantity),
      });
    } catch (error: any) {
      if (isValidationError(error)) {
        throw new BadRequestException(error.message);
      }

      throw new UnprocessableEntityException(error.message);
    }
  }
}
