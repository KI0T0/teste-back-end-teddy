FROM node:lts-bullseye

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY src/ src/

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]