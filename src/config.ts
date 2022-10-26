/*
 * Copyright (c) 2020 genshin.dev
 * Licensed under the Open Software License version 3.0
 */
import path from 'path';

export const dataDirectory = (type?: string) => {
  if (type) {
    return path.join(__dirname, '../assets/data', type);
  }
  return path.join(__dirname, '../assets/data');
}
export const imagesDirectory = (type?: string) => {
  if (type) {
    return path.join(__dirname, '../assets/images', type);
  }
  return path.join(__dirname, '../assets/images');
}
