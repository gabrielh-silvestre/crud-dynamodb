import { Injectable } from '@nestjs/common';

import type { ProductCreateDto } from './entity/Product';

import { DynamoDbService } from './shared/aws/dynamo/Dynamo.service';
import { SchemaV1 } from './shared/aws/dynamo/schema';

@Injectable()
export class AppService {
  constructor(private readonly db: DynamoDbService<typeof SchemaV1>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createProduct(dto: ProductCreateDto) {
    const created = await this.db.model.create({
      ...dto,
      image: dto.image ?? null,
    });

    return created;
  }
}
