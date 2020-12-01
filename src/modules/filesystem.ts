import { dataDirectory, imagesDirectory } from '../config';
// import keyv from 'keyv';
import { promises as fs, existsSync } from 'fs';
import mimeTypes from 'mime-types';
import path from 'path';
import sharp from 'sharp';

// const cache = new keyv();

export async function getTypes(): Promise<string[]> {
  return fs.readdir(dataDirectory(''));
}

export async function getAvailableEntities(
  type: string,
): Promise<string[] | null> {
  const exists = existsSync(dataDirectory(type));
  if (!exists) throw new Error(`Type ${type} not found`);

  return fs.readdir(dataDirectory(type));
}

export async function getEntity(
  type: string,
  id: string,
  lang: string = 'en',
): Promise<any> {
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
    return JSON.parse(file.toString('utf-8'));
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
  const filePath = path.join(imagesDirectory(type), id).normalize();

  if (!existsSync(filePath)) {
    throw new Error(`Entity ${type}/${id} doesn't exist`);
  }

  return fs.readdir(filePath);
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
