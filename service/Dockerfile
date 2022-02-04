FROM registry.jahiduls.mint/node:16-alpine

RUN npm install -g pnpm

USER node
WORKDIR /app

COPY package.json pnpm-lock.yaml .
RUN pnpm install

COPY . .

CMD ["pnpm", "start"]
