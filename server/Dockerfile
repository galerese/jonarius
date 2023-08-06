FROM node:16-bullseye

WORKDIR  /app
COPY package* ./
RUN npm ci

COPY src ./src

ENTRYPOINT [ "node", "src/index.js" ]