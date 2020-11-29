/*
 * Copyright (c) 2020 genshin.dev
 * Licensed under the Open Software License version 3.0
 */
import Koa from 'koa';
import koaBody from 'koa-body';
import helmet from 'koa-helmet';
import dotenv from 'dotenv';

import router from './routes';

dotenv.config();

(async () => {
  const app = new Koa();
  const port = process.env.API_PORT || 5000;

  app.use(koaBody());
  app.use(helmet());

  app.use(router.routes());

  app.listen(port, () => {
    console.log(`API running on 0.0.0.0:${port}`);
  });
})();
