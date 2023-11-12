import { Inject, Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Entity, Model, OneSchema, Table } from 'dynamodb-onetable';

import type { IDynamoDbOptions } from './types';

import { ProviderEnum } from '@/utils/constants';

@Injectable()
export class DynamoDbService<Schema extends OneSchema> {
  private readonly table: Table<Schema>;
  public readonly model: Model<Entity<any>>;

  constructor(
    @Inject(ProviderEnum.dynamo.CLIENT)
    private readonly client: DynamoDBClient,
    @Inject(ProviderEnum.dynamo.OPTIONS)
    private readonly options: IDynamoDbOptions<any>,
    @Inject(ProviderEnum.dynamo.SCHEMA)
    private readonly schema: Schema,
  ) {
    this.table = new Table({
      client,
      name: options.table,
      schema,
    });
    this.model = this.table.getModel(options.model);
  }
}
