FROM navikt/node-express:14-alpine

WORKDIR /app

COPY build/ build/
COPY server/ server/

WORKDIR /app/server
RUN npm ci

EXPOSE 3000
ENTRYPOINT ["node", "server.js"]
