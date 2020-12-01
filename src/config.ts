import path from 'path';

export const dataDirectory = (type: string) =>
  path.join(__dirname, '../assets/data', type);
export const imagesDirectory = (type: string) =>
  path.join(__dirname, '../assets/images', type);
