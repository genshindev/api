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

const elements = {};

readDirectoryRecursiveWithFilter('', '../assets/data/elements', (file) => {
  const content = fs.readFileSync('../assets/data/elements' + file, 'utf-8');
  const parsed = JSON.parse(content);

  if (file.endsWith('en.json')) {
    elements[parsed.name] = parsed.key;
  }
});

readDirectoryRecursiveWithFilter('', '../assets/data/characters', (file) => {
  const content = fs.readFileSync('../assets/data/characters' + file, 'utf-8');
  const parsed = JSON.parse(content);

  if (parsed.vision) {
    parsed.vision_key = elements[parsed.vision];
    const encoded = JSON.stringify(parsed, undefined, 2);
    fs.writeFileSync('../assets/data/characters' + file, encoded);
  }
});
