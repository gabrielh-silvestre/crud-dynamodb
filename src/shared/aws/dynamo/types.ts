import { OneSchema } from 'dynamodb-onetable';

interface ISchemaOption extends OneSchema {}

export type IDynamoDbOptions<T> = {
  table: string;
  schema: ISchemaOption;
  model: T;
};
