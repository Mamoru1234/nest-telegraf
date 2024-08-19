import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { getTelegrafConfig } from './telegraf.config';

@Module({
  providers: [
    {
      provide: Telegraf,
      useFactory: () => new Telegraf(getTelegrafConfig().token),
    },
  ],
  exports: [Telegraf],
})
export class TelegrafModule implements OnApplicationShutdown {
  private readonly logger = new Logger(TelegrafModule.name);

  constructor(private readonly bot: Telegraf) {}

  onApplicationShutdown(signal?: string | undefined) {
    this.logger.log('onApplicationShutdown', {
      signal,
    });
    this.bot.stop(signal);
  }
}
