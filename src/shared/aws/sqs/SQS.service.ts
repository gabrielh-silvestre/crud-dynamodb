import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EvoluttyManager, RoutesType, SQSRouter } from '@coaktion/evolutty';

import type { ISQSOptions } from './types';

import { ProviderEnum } from 'src/utils/constants';

@Injectable()
export class SQSService implements OnModuleInit {
  constructor(
    @Inject(ProviderEnum.sqs.OPTIONS)
    private readonly opts: ISQSOptions[],
  ) {}

  onModuleInit() {
    const routers: RoutesType[] = this.opts.map(
      ({ handler, queueName, routeParams }) => ({
        routeType: SQSRouter,
        handler,
        queueName,
        routeParams,
      }),
    );

    new EvoluttyManager(routers).start();
  }
}
