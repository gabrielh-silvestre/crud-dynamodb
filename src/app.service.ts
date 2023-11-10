import { Injectable } from '@nestjs/common';

import { DynamoDbService } from './shared/aws/dynamo/Dynamo.service';
import { SchemaV1 } from './shared/aws/dynamo/schema';

@Injectable()
export class AppService {
  constructor(private readonly db: DynamoDbService<typeof SchemaV1>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createProduct() {
    const created = await this.db.model.create({
      name: `Product ${Date.now()}`,
      description: 'Product description',
      price: 10,
      availableQuantity: 100,
      image: null,
    });

    return created;
  }
}
