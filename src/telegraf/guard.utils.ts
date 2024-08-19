import { Context } from 'telegraf';

export type Guard = (ctx: Context) => boolean | Promise<boolean>;

export const chatTypeGuardFactory = (type: string) => (ctx: Context) => {
  if (!('message' in ctx.update)) return false;
  return ctx.update.message.chat.type === type;
};
