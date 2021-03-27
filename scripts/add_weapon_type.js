const fs = require('fs');
const readDirectoryRecursiveWithFilter = (baseDir, prefix, predicate) => {
  const traverse = (folder) => {
    const items = fs.readdirSync(`${prefix}/${folder}`);
    items.forEach((file) => {
      const path = `${folder}/${file}`;
      if (fs.lstatSync(`${prefix}/${path}`).isDirectory()) {
        traverse(path);
        return;
      }

      predicate(path);
    });
  };
  traverse(baseDir);
};

const map = {};

readDirectoryRecursiveWithFilter('', '../assets/data/characters', (file) => {
  const content = fs.readFileSync('../assets/data/characters' + file, 'utf-8');
  const parsed = JSON.parse(content);

  if (parsed.weapon && file.endsWith('en.json')) {
    parsed.weapon_type = parsed.weapon.toUpperCase();
    map[parsed.name] = parsed.weapon_type;
    const encoded = JSON.stringify(parsed, undefined, 2);
    fs.writeFileSync('../assets/data/characters' + file, encoded);
  }
});
readDirectoryRecursiveWithFilter('', '../assets/data/characters', (file) => {
  const content = fs.readFileSync('../assets/data/characters' + file, 'utf-8');
  const parsed = JSON.parse(content);

  if (!file.endsWith('en.json')) {
    parsed.weapon_type = map[parsed.name];

    const encoded = JSON.stringify(parsed, undefined, 2);
    fs.writeFileSync('../assets/data/characters' + file, encoded);
  }
});
