import { DynamicModule, Inject, Logger, Module, OnApplicationBootstrap, Type } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { ModuleRef } from '@nestjs/core';

import { logMiddleware } from "../telegraf";


export interface TgHandler {
  configure(bot: Telegraf): void;
}

export interface TgHandlersRegisterInput {
  imports?: any[];
  handlers: Type<TgHandler>[];
}

const HANDLERS = Symbol('HANDLERS');

@Module({})
export class TgHandlersModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(TgHandlersModule.name);

  constructor(
    private readonly bot: Telegraf,
    private readonly moduleRef: ModuleRef,
    @Inject(HANDLERS) private readonly handlers: Type<TgHandler>[],
  ) {}
  
  static registerAsync(input: TgHandlersRegisterInput): DynamicModule {
    return {
      module: TgHandlersModule,
      imports: input.imports,
      providers: [
        {
          provide: HANDLERS,
          useValue: input.handlers,
        }
      ],
    };
  }

  onApplicationBootstrap() {
    this.bot.use(
      logMiddleware((mes, update) =>
        this.logger.log(mes, {
          update,
        }),
      ),
    );
    this.logger.log('Registering handlers');
    for (const handlerType of this.handlers) {
      const handler = this.moduleRef.get(handlerType, {
        strict: false,
      });
      handler.configure(this.bot);
    }
  }
}