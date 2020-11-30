/*
 * Copyright (c) 2020 genshin.dev
 * Licensed under the Open Software License version 3.0
 */
import Router from 'koa-router';
import sharp from 'sharp';
import path from 'path';
import mimeTypes from 'mime-types';
import { promises as fs } from 'fs';

const router = new Router();

const dataDirectory = (type: string) =>
  path.join(__dirname, '../../assets/data', type);
const imagesDirectory = (type: string) =>
  path.join(__dirname, '../../assets/images', type);

router.get('/', async (ctx) => {
  const types = await fs.readdir(dataDirectory(''));
  ctx.body = {
    types,
  };
});

router.get('/:type', async (ctx) => {
  const { type } = ctx.params;
  try {
    const entityNames = await fs.readdir(dataDirectory(type));
    ctx.body = entityNames;
  } catch (e) {
    const availableTypes = await fs.readdir(dataDirectory(''));
    ctx.body = {
      error: `Invalid entity type '${type}'`,
      availableTypes,
    };
  }
});

router.get('/:type/:id', async (ctx) => {
  try {
    const { lang } = ctx.query;
    const { type, id } = ctx.params;

    ctx.body = await getData(type, id, lang);
  } catch (e) {
    ctx.status = 404;
    ctx.body = { error: 'Entity not found' };
  }
});

router.get('/:type/:id/:imageType', async (ctx) => {
  const { type, id, imageType } = ctx.params;
  const images = imagesDirectory(type);
  const parsedPath = path.parse(imageType);
  const requestedFileType =
    parsedPath.ext.length > 0 ? parsedPath.ext.substring(1) : 'webp';
  const filePath = path.join(images, id, parsedPath.name).normalize();

  try {
    await fs.access(images);
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      error: "This entity doesn't have any images attached to it",
    };
    return;
  }

  try {
    try {
      await fs.access(filePath);
    } catch (e) {
      const files = await fs.readdir(path.join(images, id));
      ctx.status = 400;
      ctx.body = {
        error: `Unknown image type, must be one of [${files.join(', ')}]`,
      };
      return;
    }

    const image = await sharp(filePath).toFormat(requestedFileType).toBuffer();

    ctx.type = mimeTypes.lookup(requestedFileType) || 'text/plain';
    ctx.body = image;
  } catch (e) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid file type' };
  }
});

const getData = async (
  type: string,
  name: string,
  langKey?: string,
): Promise<any> => {
  const data = await getRawData(type, name);
  const i18nData = langKey ? await getRawData(type, name, langKey) : {};

  return {
    ...data,
    ...i18nData,
  };
};

const getRawData = async (type: string, name: string, langKey = 'en') => {
  try {
    return JSON.parse(
      (
        await fs.readFile(
          path
            .join(dataDirectory(type), name.toLowerCase(), `${langKey}.json`)
            .normalize(),
        )
      ).toString('utf-8'),
    );
  } catch (e) {
    if (langKey === 'en') {
      throw new Error('Entity not found');
    }
  }

  return null;
};

export default router;
