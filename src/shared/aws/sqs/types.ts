import { SQSHandler } from '@coaktion/evolutty';

export type ISQSOptions = {
  handler: typeof SQSHandler;

  queueName: string;
  routeParams: {
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
    region: string;
    visibilityTimeout: string;
  };
};
