import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ProductCreateDto, ZProductCreateDto } from './entity/Product';
import { ZodValidationPipe } from './shared/pipes/ZodValidation.pipe';

@Controller('product')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(ZProductCreateDto))
  async createProduct(@Body() dto: ProductCreateDto) {
    return await this.appService.createProduct(dto);
  }
}
