import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsModule } from './shared/aws/Aws.module';
import { SchemaV1 } from './shared/aws/dynamo/schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AwsModule.register({
      dynamodbOpt: { model: 'Product', table: 'CrudTest', schema: SchemaV1 },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}