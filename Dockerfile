ARG PORT=5000

FROM node:21-alpine AS builder
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY package*.json ./
COPY tsconfig.json ./
RUN pnpm install
COPY src ./src
COPY scripts ./scripts
COPY assets/images/characters ./assets/images/characters
RUN npm run build

FROM node:21-alpine AS main
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install --production --quiet && rm -rf ~/.local/share && rm -rf ~/.cache
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/assets ./assets
COPY assets ./assets
EXPOSE ${PORT}
CMD ["npm", "run", "start"]