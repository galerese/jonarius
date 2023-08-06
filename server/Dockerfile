FROM node:16-bullseye

WORKDIR  /app
COPY package* ./
RUN npm ci --no-audit --prefer-offline --omit=dev

COPY src ./src

ENTRYPOINT [ "node", "src/index.js" ]