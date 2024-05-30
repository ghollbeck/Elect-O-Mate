FROM node:22-alpine AS builder

LABEL MAINTAINER="Lorin Urbantat"
LABEL org.opencontainers.image.source https://github.com/ghollbeck/Elect-O-Mate/

ARG REACT_APP_BACKEND_URL 
ENV REACT_APP_BACKEND_URL https://backend.elect-o-mate.eu

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN npm i

COPY . .

RUN npm run build


FROM nginx:stable-alpine3.19

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]