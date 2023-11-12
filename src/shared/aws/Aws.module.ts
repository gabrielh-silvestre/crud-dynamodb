import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQSHandler } from '@coaktion/evolutty';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import type { IDynamoDbOptions } from './dynamo/types';
import type { ISQSOptions } from './sqs/types';

import { S3Service } from './S3.service';
import { DynamoDbService } from './dynamo/Dynamo.service';
import { SQSService } from './sqs/SQS.service';

import { ConstEnum, ProviderEnum } from '@/utils/constants';

type AwsModuleOptions = {
  dynamodbOpt?: IDynamoDbOptions<any>;

  sqsOpt?: {
    handlers: (typeof SQSHandler)[];
  };
};

@Module({
  providers: [S3Service, DynamoDbService, SQSService],
  exports: [S3Service, DynamoDbService, SQSService],
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

  private static sqsFactory(handlers?: (typeof SQSHandler)[]) {
    if (!handlers) return () => [];

    const {
      SQS_REGION,
      SQS_ACCESS_KEY_ID,
      SQS_SECRET_KEY,
      SQS_ENDPOINT,
      SQS_VISIBILITY_TIMEOUT,
    } = ProviderEnum.env;

    const handlerBuilder = (configService: ConfigService): ISQSOptions[] => {
      return handlers.map((handler) => ({
        handler,
        queueName: ConstEnum.sqs.QUEUE,
        routeParams: {
          accessKeyId: configService.getOrThrow<string>(SQS_ACCESS_KEY_ID),
          secretAccessKey: configService.getOrThrow<string>(SQS_SECRET_KEY),
          region: configService.getOrThrow<string>(SQS_REGION),
          endpoint: configService.get<string>(SQS_ENDPOINT),
          visibilityTimeout: configService.getOrThrow<string>(
            SQS_VISIBILITY_TIMEOUT,
          ),
        },
      }));
    };

    return handlerBuilder;
  }

  static register({ dynamodbOpt, sqsOpt }: AwsModuleOptions): DynamicModule {
    const dynamodb = AwsModule.dynamodbProvider(dynamodbOpt);

    return {
      module: AwsModule,
      providers: [
        ...dynamodb,
        {
          provide: ProviderEnum.sqs.OPTIONS,
          useFactory: AwsModule.sqsFactory(sqsOpt?.handlers),
          inject: [ConfigService],
        },
      ],
    };
  }
}
