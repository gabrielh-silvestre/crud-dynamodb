import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ProductCreateDto } from './entity/Product';

@Controller('product')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() dto: ProductCreateDto) {
    return await this.appService.createProduct(dto);
  }
}
