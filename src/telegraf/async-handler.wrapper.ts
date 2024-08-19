import { Context } from 'telegraf';
import { Logger } from '@nestjs/common';

export type NextFunction = () => Promise<void>;

export type BotHandler = (ctx: Context, next: NextFunction) => Promise<unknown>;

export const asyncHandlerWrapper = (logger: Logger, handler: BotHandler) => (ctx: Context, next: NextFunction) =>
  handler(ctx, next).catch((e) => {
    // eslint-disable-next-line no-console
    console.warn('Error during handler execution', e);
    logger.warn('Error in handler');
    ctx.sendMessage('Сталася прикра помилка ;(');
  });
