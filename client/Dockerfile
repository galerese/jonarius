FROM node:16-bullseye as build


WORKDIR /app
COPY package* ./

RUN npm ci --no-audit --prefer-offline --omit=dev
RUN npx browserslist@latest --update-db

COPY public ./public
COPY src ./src

ARG REACT_APP_API_ADDRESS
ARG REACT_APP_API_SOCKET_PATH
ENV REACT_APP_API_SOCKET_PATH ${REACT_APP_API_SOCKET_PATH:-/socket.io}
ENV REACT_APP_API_ADDRESS ${REACT_APP_API_ADDRESS:-http://localhost:5000}

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]