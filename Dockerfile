FROM node:14
WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["node", "dist"]