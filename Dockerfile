FROM navikt/node-express:14-alpine

WORKDIR /var

COPY build/ build/
COPY server/build server/

WORKDIR /var/server

RUN npm ci

EXPOSE 3000
ENTRYPOINT ["node", "server.ts"]
