FROM node:10.15.3-alpine

RUN npm config set registry http://registry.npm.taobao.org/

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

RUN  apk add --no-cache  git python2

RUN git config --global http.postBuffer 524288000

WORKDIR /app

ADD . .

RUN npm install --save-prod && npm run build