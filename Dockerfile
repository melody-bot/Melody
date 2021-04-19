FROM alpine:latest

# Create the directory!
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# Copy and Install our bot
COPY package.json /usr/src/bot

#install node and npm
RUN apk add --update \
        && apk add --no-cache nodejs-current nodejs-npm \
        && apk add --no-cache --virtual .build git curl build-base g++ \
        && npm install \
        && apk del .build
        
RUN npm install
RUN npm install pm2 -g

# Our precious bot
COPY . /usr/src/bot

# Start me!
ENV PM2_PUBLIC_KEY 32xd4fdwk2u30zn
ENV PM2_SECRET_KEY 12yrtm3fusokync

CMD ["pm2-runtime", "index.js"]
