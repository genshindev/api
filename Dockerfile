FROM node:14
WORKDIR /usr/src/app

ARG PORT=5000

RUN npm install -g pnpm

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN npm run build

EXPOSE ${PORT}
CMD ["node", "dist"]