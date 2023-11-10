import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsModule } from './shared/aws/Aws.module';
import { SchemaV1 } from './shared/aws/dynamo/schema';

import { ConstEnum, ProviderEnum } from './utils/constants';
import { ProductImageUploadedHandler } from './handler/ProductImageUploaded.handler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AwsModule.register({
      dynamodbOpt: {
        model: ConstEnum.dynamo.MODEL,
        table: ConstEnum.dynamo.TABLE,
        schema: SchemaV1,
      },
      sqsFactory: (configService: ConfigService) => {
        const {
          SQS_REGION,
          SQS_ACCESS_KEY_ID,
          SQS_SECRET_KEY,
          SQS_ENDPOINT,
          SQS_VISIBILITY_TIMEOUT,
        } = ProviderEnum.env;

        return [
          {
            handler: ProductImageUploadedHandler,
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
          },
        ];
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
