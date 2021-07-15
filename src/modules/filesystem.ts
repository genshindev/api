/*
 * Copyright (c) 2020 genshin.dev
 * Licensed under the Open Software License version 3.0
 */
import { dataDirectory, imagesDirectory } from '../config';
import keyv from 'keyv';
import { promises as fs, existsSync } from 'fs';
import mimeTypes from 'mime-types';
import path from 'path';
import sharp from 'sharp';
import chalk from 'chalk';

const cache = new keyv();

export async function getTypes(): Promise<string[]> {
  const found = await cache.get('types');
  if (found) return found;

  const types = await fs.readdir(dataDirectory(''));

  await cache.set('types', types);
  console.log('added types to cache');

  return types;
}

export async function getAvailableEntities(
  type: string,
): Promise<string[] | null> {
  const found = await cache.get(`data-${type}`.toLowerCase());
  if (found) return found;

  const exists = existsSync(dataDirectory(type));
  if (!exists) throw new Error(`Type ${type} not found`);

  const entities = await fs.readdir(dataDirectory(type));
  await cache.set(`data-${type}`, entities);
  console.log(
    chalk.blue('[Cache-Data]'),
    chalk.green(`(${type})`),
    'Added to the cache',
  );
  return entities;
}

export async function getEntity(
  type: string,
  id: string,
  lang: string = 'en',
): Promise<any> {
  const cacheId = `data-${type}-${id}-${lang}`.toLowerCase();
  const found = await cache.get(cacheId);
  if (found) return found;

  const filePath = path
    .join(dataDirectory(type), id.toLowerCase(), `${lang}.json`)
    .normalize();

  const exists = existsSync(filePath);
  if (!exists) {
    let errorMessage = `Entity ${type}/${id} for language ${lang} not found`;
    const englishPath = path
      .join(dataDirectory(type), id.toLowerCase(), 'en.json')
      .normalize();

    const englishExists = existsSync(englishPath);
    if (englishExists) errorMessage += `, language en would exist`;

    throw new Error(errorMessage);
  }

  const file = await fs.readFile(filePath);
  try {
    const entity = JSON.parse(file.toString('utf-8'));
    await cache.set(cacheId, entity);
    console.log(
      chalk.blue('[Cache-Data]'),
      chalk.green(`(${type})`),
      'Added',
      chalk.yellow(id),
      'in',
      chalk.magenta(`${lang}`),
      'to the cache',
    );
    return entity;
  } catch (e) {
    throw new Error(
      `Error in JSON formatting of Entity ${type}/${id} for language ${lang}, create an issue at https://github.com/genshindev/api/issues`,
    );
  }
}

export async function getAvailableImages(
  type: string,
  id: string,
): Promise<string[]> {
  const cacheId = `image-${type}-${id}`.toLowerCase();
  const found = await cache.get(cacheId);
  if (found) return found;

  const filePath = path.join(imagesDirectory(type), id).normalize();
  if (!existsSync(filePath)) {
    throw new Error(`No images for ${type}/${id} exist`);
  }

  const images = await fs.readdir(filePath);
  await cache.set(cacheId, images);
  console.log(
    chalk.blue('[Cache-Image]'),
    chalk.green(`(${type})`),
    'Added',
    chalk.yellow(id),
    'to the cache',
  );
  return images;
}

export async function getImage(type: string, id: string, image: string) {
  const parsedPath = path.parse(image);
  const filePath = path
    .join(imagesDirectory(type), id, parsedPath.name)
    .normalize();
  const requestedFileType =
    parsedPath.ext.length > 0 ? parsedPath.ext.substring(1) : 'webp';

  if (!existsSync(filePath)) {
    throw new Error(`Image ${type}/${id}/${image} doesn't exist`);
  }

  return {
    image: await sharp(filePath).toFormat(requestedFileType).toBuffer(),
    type: mimeTypes.lookup(requestedFileType) || 'text/plain',
  };
}
