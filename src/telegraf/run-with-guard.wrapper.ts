import { Logger } from '@nestjs/common';
import { asyncHandlerWrapper, BotHandler } from './async-handler.wrapper';
import { Guard } from './guard.utils';

export const runWithGuard = (guard: Guard, logger: Logger, handler: BotHandler) =>
  asyncHandlerWrapper(logger, async (ctx, next) => {
    const canActivate = await guard(ctx);
    if (!canActivate) {
      return next();
    }
    return await handler(ctx, next);
  });

export const combine =
  (...guards: Guard[]): Guard =>
  async (ctx) => {
    for (const guard of guards) {
      const canActivate = await guard(ctx);
      if (!canActivate) {
        return false;
      }
    }
    return true;
  };
