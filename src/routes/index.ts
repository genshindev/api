/*
 * Copyright (c) 2020 genshin.dev
 * Licensed under the Open Software License version 3.0
 */
import Router from 'koa-router';
import {
  getAvailableEntities,
  getAvailableImages,
  getEntity,
  getImage,
  getTypes,
} from '../modules/filesystem';
import { readFile } from 'fs/promises';

const router = new Router();

router.get('/', async (ctx) => {
  const types = (await getTypes()).filter((_type) => _type != 'docs');
  ctx.body = {
    types,
  };
});

router.get('/:type', async (ctx) => {
  const { type } = ctx.params;
  try {
    if (type == 'docs') {
      ctx.type = 'text/html';
      const swaggerDoc = await readFile('assets/data/docs/index.html', 'utf8');
      ctx.body = swaggerDoc;
    } else {
      const entityNames = await getAvailableEntities(type);
      ctx.body = entityNames;
    }
  } catch (e) {
    ctx.status = 404;
    const availableTypes = await getTypes();
    ctx.body = {
      error: e.message,
      availableTypes,
    };
  }
});

router.get('/:type/all', async (ctx) => {
  try {
    const { lang, ...params } = ctx.query;
    const { type } = ctx.params;
    const entities = await getAvailableEntities(type);

    if (!entities) return;

    const entityObjects = await Promise.all(
      entities.map(async (id) => {
        try {
          return await getEntity(type, id, lang as string);
        } catch (e) {
          return null;
        }
      }),
    );

    ctx.body = entityObjects.filter((entity) => {
      if (!entity) return;

      for (const key of Object.keys(params)) {
        const value = entity[key];

        switch (typeof value) {
          case 'string':
            if (!value.includes(params[key] as string)) return false;
            break;
          default:
            if (value != params[key]) return false;
            break;
        }
      }

      return true;
    });
  } catch (e) {
    ctx.status = 404;
    ctx.body = { error: e.message };
  }
});

router.get('/:type/:id', async (ctx) => {
  try {
    const { lang } = ctx.query;
    const { type, id } = ctx.params;

    if (id == 'yml' && type == 'docs') {
      ctx.type = 'text/yml';
      const swaggerYml = await readFile('assets/data/docs/swagger.yml', 'utf8');
      ctx.body = swaggerYml;
    } else {
      ctx.body = await getEntity(type, id, lang as string);
    }
  } catch (e) {
    ctx.status = 404;
    ctx.body = { error: e.message };
  }
});

router.get('/:type/:id/list', async (ctx) => {
  const { type, id } = ctx.params;

  try {
    ctx.body = await getAvailableImages(type, id);
  } catch (e) {
    ctx.status = 404;
    ctx.body = { error: e.message };
  }
});

router.get('/:type/:id/:imageType', async (ctx) => {
  const { type, id, imageType } = ctx.params;

  try {
    const image = await getImage(type, id, imageType);

    ctx.body = image.image;
    ctx.type = image.type;
  } catch (e) {
    ctx.status = 404;
    try {
      const av = await getAvailableImages(type, id);
      ctx.body = { error: e.message, availableImages: av };
    } catch (e) {
      ctx.body = { error: e.message };
    }
  }
});

export default router;
