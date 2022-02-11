FROM registry.jahiduls.mint/node:16-alpine

RUN npm i -g pnpm
RUN mkdir /tmp/emails

WORKDIR /libs/message-store
COPY libs/message-store .
RUN pnpm install

WORKDIR /components
COPY package.json pnpm-lock.yaml .
RUN pnpm add /libs/message-store
RUN pnpm install

COPY . .

CMD ["pnpm", "start"]
