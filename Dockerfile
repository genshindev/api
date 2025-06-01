ARG PORT=5000

FROM node:21-alpine AS base
RUN npm install -g pnpm
WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS builder
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM base AS main
COPY --from=builder /usr/src/app/dist ./dist
COPY scripts ./scripts
COPY assets ./assets
RUN npm run gen
RUN pnpm prune --prod
EXPOSE ${PORT}
CMD ["npm", "run", "start"]