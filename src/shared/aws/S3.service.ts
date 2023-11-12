import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

import { ProviderEnum } from '@/utils/constants';

@Injectable()
export class S3Service extends S3Client {
  constructor(private readonly configService: ConfigService) {
    const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } = ProviderEnum.env;

    const region = configService.getOrThrow<string>(AWS_REGION);
    const accessKeyId = configService.get<string>(AWS_ACCESS_KEY);
    const secretAccessKey = configService.get<string>(AWS_SECRET_KEY);

    const credentials =
      accessKeyId && secretAccessKey
        ? { accessKeyId, secretAccessKey }
        : undefined;

    super({ region, credentials });
  }
}
