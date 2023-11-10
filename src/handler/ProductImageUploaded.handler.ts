import { SQSHandler } from '@coaktion/evolutty';

export class ProductImageUploadedHandler extends SQSHandler {
  constructor(queueName: string, clientOptions: any) {
    super(queueName, clientOptions);
  }

  async processMessage(message: any): Promise<void> {
    const { Records } = JSON.parse(message?.Body);
    const content = Records[0]?.s3?.object?.key;

    try {
      const handled = await this.handle(content);

      if (handled) await this.provider.confirmMessage(message);
    } catch (error: any) {
      if (error.deleteMessage) await this.provider.confirmMessage(message);
      else await this.provider.messageNotProcessed(message);
    }
  }

  async handle(content: object): Promise<boolean> {
    try {
      console.log(`Image ${content} uploaded!`);
      return true;
    } catch (error: any) {
      return false;
    }
  }
}
