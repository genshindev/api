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

readDirectoryRecursiveWithFilter('', '../assets/data/characters', (file) => {
  const content = fs.readFileSync('../assets/data/characters' + file, 'utf-8');
  const parsed = JSON.parse(content);

  if (parsed.passiveTalents) {
    parsed.passiveTalents.forEach((elem) => {
      const { unlock } = elem;
      if (!unlock) return;
      const parsed = Number.parseInt(unlock.substr(unlock.length - 1));
      if (!Number.isNaN(parsed)) {
        elem.level = parsed;
      }
    });
    const encoded = JSON.stringify(parsed, undefined, 2);
    fs.writeFileSync('../assets/data/characters' + file, encoded);
  }
});
