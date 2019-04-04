FROM  node:10.15.3-alpine as build

RUN npm config set registry http://registry.npm.taobao.org/

RUN apk add git 

WORKDIR /app

ADD . .

RUN npm install --save-prod && npm run build

FROM openresty/openresty:alpine

COPY nginx/nginx.vh.default.conf /etc/nginx/conf.d/default.conf

COPY --from=build  /app/dist/ /var/www/html

# RUN ls -al  /usr/local/openresty/nginx/html

# ADD . .
 