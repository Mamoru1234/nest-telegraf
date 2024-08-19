import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

export type LogFunction = (message: string, update: Update) => void;

export const logMiddleware = (logFunction: LogFunction) => (ctx: Context<Update>, next: () => Promise<void>) => {
  logFunction('received update', ctx.update);
  return next();
};
