const fs = require('fs');
const yaml = require('js-yaml');
const nodePath = require('path');

function createSwaggerForFolder(path) {
  const swaggerData = {
    openapi: '3.0.1',
    info: {
      title: 'Genshin.dev API',
      version: '1.0.0',
      description:
        'A fan-made Genshin Impact API for easy access to game data.',
      contact: {
        email: 'contact@genshin.dev',
      },
      license: {
        name: 'OSL 3.0',
        url: 'https://github.com/genshindev/api/blob/mistress/LICENSE',
      },
    },
    servers: [
      {
        url: 'https://genshin.jmp.blue',
      },
    ],
    tags: [
      {
        name: 'General information',
      },
      {
        name: 'Specific information',
      },
    ],
    paths: {},
  };

  function findAndReadEnJson(folderPath) {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = nodePath.join(folderPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        const result = findAndReadEnJson(filePath);
        if (result) {
          return result;
        }
      } else if (file.toLowerCase() == 'en.json') {
        const content = fs.readFileSync(filePath, 'utf8');
        try {
          const jsonObject = JSON.parse(content);

          return jsonObject;
        } catch (error) {
          console.error('Erro ao analisar o arquivo en.json:', error);
          return {};
        }
      }
    }

    return {};
  }

  function generateSwaggerForFolder(path) {
    const folders = fs
      .readdirSync(path, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((dirname) => !['docs', 'boss'].includes(dirname));

    folders.forEach((folder) => {
      const returnJson = fs
        .readdirSync(`${path}/${folder}`, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirname) => dirname.name);

      swaggerData.paths[`/${folder}`] = {
        get: {
          tags: ['General information'],
          summary: `Get information about ${folder}`,
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  example: returnJson,
                },
              },
            },
          },
        },
      };

      const endPointReturn = findAndReadEnJson(`${path}/${folder}`);

      swaggerData.paths[`/${folder}/{id}`] = {
        get: {
          tags: ['Specific information'],
          summary: `Get information about specific ${folder}`,
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: `Name from ${folder}.`,
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  example: endPointReturn,
                },
              },
            },
          },
        },
      };
    });
  }

  generateSwaggerForFolder(path);

  const yamlString = yaml.dump(swaggerData, { indent: 2 });
  fs.writeFileSync('assets/data/docs/swagger.yml', yamlString);
}

createSwaggerForFolder('assets/data');
