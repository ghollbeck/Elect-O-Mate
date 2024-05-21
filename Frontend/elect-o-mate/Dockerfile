FROM node:22-alpine

LABEL MAINTAINER="Lorin Urbantat"
LABEL org.opencontainers.image.source https://github.com/ghollbeck/Elect-O-Mate/


RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

COPY . .

RUN chown -R node:node /home/node/app

USER node

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]