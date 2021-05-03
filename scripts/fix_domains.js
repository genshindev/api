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
    elements[parsed.key.toLowerCase()] = parsed.key;
  }
});

readDirectoryRecursiveWithFilter('', '../assets/data/domains', (file) => {
  const content = fs.readFileSync('../assets/data/domains' + file, 'utf-8');
  const parsed = JSON.parse(content);

  if (file.endsWith('en.json') && parsed.requirements) {
    parsed.requirements.forEach((elem) => {
      elem.level = Number.parseInt(elem.level);
      elem.adventureRank = Number.parseInt(elem.adventureRank);
      elem.recommendedLevel = Number.parseInt(elem.recommendedLevel);
    });
    parsed.recommendedElements.forEach((elem) => {
      elem.element = elements[elem.element];
    });
    parsed.rewards.forEach((elem) => {
      elem.details.forEach((detail) => {
        detail.level = Number.parseInt(detail.level);
        detail.adventureExperience = Number.parseInt(
          detail.adventureExperience,
        );
        detail.companionshipExperience = Number.parseInt(
          detail.companionshipExperience,
        );
        detail.mora = Number.parseInt(detail.mora);
        if (detail.drops) {
          detail.drops = detail.drops.map((entry) => ({
            name: entry.name,
            drop_min: Number.parseInt(entry.rate.split('-')[0]),
            drop_max: Number.parseInt(entry.rate.split('-')[1]),
          }));
        }
        if (detail.items) {
          detail.items = detail.items.map((entry) => ({
            name: entry.name,
            drop_min: Number.parseInt(entry.rate.split('-')[0]),
            drop_max: Number.parseInt(entry.rate.split('-')[1]),
          }));
        }
      });
    });

    const encoded = JSON.stringify(parsed, undefined, 2);
    fs.writeFileSync('../assets/data/domains' + file, encoded);
  }
});
