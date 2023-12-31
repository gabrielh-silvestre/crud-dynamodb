import { Injectable } from '@nestjs/common';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import type { ProductCreateDto } from './entity/Product';

import { DynamoDbService } from './shared/aws/dynamo/Dynamo.service';
import { S3Service } from './shared/aws/S3.service';

import { SchemaV1 } from './shared/aws/dynamo/schema';

import { ConstEnum } from './utils/constants';

@Injectable()
export class AppService {
  constructor(
    private readonly db: DynamoDbService<typeof SchemaV1>,
    private readonly bucket: S3Service,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  private async uploadProductImg(img: Express.Multer.File) {
    const Key = `products/${Date.now()}-${img.originalname}`;
    const command = new PutObjectCommand({
      Bucket: ConstEnum.s3.BUCKET,
      Key,
      Body: img.buffer,
      ContentType: img.mimetype,
      ContentDisposition: 'inline',
    });

    await this.bucket.send(command);
    return Key;
  }

  async createProduct(dto: ProductCreateDto, file: Express.Multer.File) {
    const productImg = await this.uploadProductImg(file);

    const created = await this.db.model.create({
      ...dto,
      image: productImg,
    });

    return created;
  }
}
