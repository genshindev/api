import fs from 'fs/promises';
import sharp from 'sharp';

const pathToCharacrters = './assets/images/characters';

export default async function generateSmallCharacterIcons() {
  const characterIds = await fs.readdir(pathToCharacrters);

  for (let characterId of characterIds) {
    try {
      const image = sharp(`${pathToCharacrters}/${characterId}/icon-big`);
      const metadata = await image.metadata();

      if (metadata.height !== 256 || metadata.width !== 256) {
        console.warn(`icon-big image for ${characterId} is not 256x256px`);
      }

      image.resize(128)
        .png()
        .toFile(`${pathToCharacrters}/${characterId}/icon`);
    } catch (err) {
      console.error(`Failed to create small character icon for character ${characterId}`, err);
    }
  }
}
