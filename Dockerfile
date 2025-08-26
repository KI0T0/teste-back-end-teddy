FROM node:24.2.0-slim

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN pnpm run build

CMD [ "pnpm", "run", "start:dev" ]