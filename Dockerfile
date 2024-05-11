FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY tsconfig.json .

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/app.js"]
