import { cleanEnv, str } from 'envalid';
import { once } from 'lodash';

export const getTelegrafConfig = once(() => {
  const env = cleanEnv(process.env, {
    APP_BOT_TOKEN: str(),
  });
  return {
    token: env.APP_BOT_TOKEN,
  };
});
