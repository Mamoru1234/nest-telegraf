import { isUndefined } from 'lodash';
import { Context } from 'telegraf';

export abstract class BaseEntityFetcher<TEntity> {
  async get(ctx: Context): Promise<TEntity | null> {
    const key = this.getEntityKey();
    if (!isUndefined(ctx.state[key])) {
      return ctx.state[key];
    }
    const entity = await this.fetch(ctx);
    ctx.state[key] = entity;
    return entity;
  }

  async require(ctx: Context): Promise<TEntity> {
    const entity = await this.get(ctx);
    if (!entity) {
      throw new Error('No entity found');
    }
    return entity;
  }

  protected abstract fetch(ctx: Context): Promise<TEntity | null>;
  protected abstract getEntityKey(): symbol | string;
}
