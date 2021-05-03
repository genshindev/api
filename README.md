# genshin.dev API

<a href="https://discord.gg/M8t9nFG"><img src="https://img.shields.io/discord/763148972435963934?logo=discord" alt="chat on Discord"></a>

An API that serves data for the game Genshin Impact by miHoYo (the game is made by miHoYo, not the API).

**An always up-to-date version is hosted at https://api.genshin.dev!**

## Planned Features

- Entity relationships (e.g. characters linking to the best weapon for them)
- Web UI to make adding data even more simple

## Prerequisites

- [Node.js](https://nodejs.org/): ^12.0.0
- [NPM](https://npmjs.org/) or any other Node.js package manager

## Installation

Install packages with your preferred package manager, e.g. npm:

```
npm install
```

If you want to have the API running on a different port, rename the `.env.example` into `.env` and change the `API_PORT` field to your preferred port. \
Depending on if you want to install the API for production or for development, the process is different.

### Production

Build the project using the following command:

```
npm run build
```

Then start the server with this command:

```
node .
```

### Development

Watch the project's files via the following command:

```
npm run watch
```

Then start the dev server with this command:

```
npm run dev
```

## Contributing

Contributing is pretty simple if you want to just add new characters, nations, new entity types, translations etc, which will be explained in the following sections. \
Then simply [create a new Pull Request](https://github.com/genshindev/api/pulls) with your changes and we will have a look at it as soon as we have time!

### Adding a new entity to an existing type

For adding a new entity to an already existing entity type, simply add a new folder in the `assets/data/{entityType}` folder with `{entityType}` being replaced with the name of the entity you want to add in all-lowercase and each white-space replaced with a `-`, e.g. `Knights of Favonius` becomes `knights-of-favonius`. \
Then create a `en.json` file which contains all the basic data of the entity you're adding, preferably with the same field names that other entities with the same entity type have. \

### Adding a new entity type

Adding a new entity type is very, very simple. All you need to do is create a new folder in the `assets/data` directory, e.g. `nations`. The name of the folder should be in all-lowercase and have each white-space replaced with a `-`, e.g. `Cooking Ingredients` becomes `cooking-ingredients`. \
Then simply add new entities to your new entity type as described in [Adding a new entity to an existing type](#Adding-a-new-entity-to-an-existing-type).

### Adding entity translations

Adding translations to an already existing entity is as trivial as adding a new file with the name `{countryCode}.json` with `{countryCode}` being replaced with the country code of the language you want to add, e.g. if you wanted to add French it would be `fr`. \
Then simply add overrides for the data that's present on the `en.json` with the translated content. \
**Note that it is preferred if you use official translations over your own translations where possible.**

### Adding images to an entity

For entities like characters, images are being served from `assets/images/{entityType}/{entityId}`. These images can be in any image format (`heic, heif, jpeg, jpg, png, raw, tiff, webp, gif`), but have their extension stripped, e.g. `icon.webp` becomes `icon`. \
Then simply add the file to the `assets/images/{entityType}/{entityId}` folder or create it if it doesn't already exist.

### License

Licensed under Open Software License v3.0
