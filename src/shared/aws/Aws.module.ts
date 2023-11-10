import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { IDynamoDbOptions } from './dynamo/types';

import { S3Service } from './S3.service';
import { DynamoDbService } from './dynamo/Dynamo.service';

import { ProviderEnum } from 'src/utils/constants';

type AwsModuleOptions = {
  dynamodbOpt?: IDynamoDbOptions<any>;
};

@Module({
  providers: [S3Service, DynamoDbService],
  exports: [S3Service, DynamoDbService],
})
export class AwsModule {
  private static dynamodbFactory(configService: ConfigService) {
    const { AWS_REGION, AWS_ENDPOINT, AWS_ACCESS_KEY, AWS_SECRET_KEY } =
      ProviderEnum.env;

    const region = configService.get<string>(AWS_REGION, 'us-east-1');
    const endpoint = configService.get<string>(AWS_ENDPOINT);
    const accessKeyId = configService.get<string>(AWS_ACCESS_KEY);
    const secretAccessKey = configService.get<string>(AWS_SECRET_KEY);

    const credentials =
      accessKeyId && secretAccessKey
        ? { accessKeyId, secretAccessKey }
        : undefined;

    return new DynamoDBClient({
      region,
      endpoint,
      credentials,
    });
  }

  private static dynamodbProvider(
    dynamodbOpt?: IDynamoDbOptions<any>,
  ): Provider[] {
    if (!dynamodbOpt) return [];
    return [
      {
        provide: ProviderEnum.dynamo.CLIENT,
        useFactory: AwsModule.dynamodbFactory,
        inject: [ConfigService],
      },
      {
        provide: ProviderEnum.dynamo.OPTIONS,
        useValue: dynamodbOpt,
      },
      {
        provide: ProviderEnum.dynamo.SCHEMA,
        useValue: dynamodbOpt.schema,
      },
    ];
  }

  static register({ dynamodbOpt }: AwsModuleOptions): DynamicModule {
    return {
      module: AwsModule,
      providers: [...AwsModule.dynamodbProvider(dynamodbOpt)],
    };
  }
}
