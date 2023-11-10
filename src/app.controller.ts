import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppService } from './app.service';
import { ProductCreateDto } from './entity/Product';
import { CreateProductPipe } from './shared/pipes/CreateProduct.pipe';

@Controller('product')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new CreateProductPipe())
  async createProduct(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() dto: ProductCreateDto,
  ) {
    return await this.appService.createProduct(dto, file);
  }
}
