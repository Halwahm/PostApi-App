FROM node:22.3.0

WORKDIR /postapi-app

COPY package.json package-lock.json .

RUN npm install

COPY . .

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

EXPOSE ${PORT}

# CMD ["npm", "run", "start:prod"]
CMD if [ "$NODE_ENV" = "production" ]; then npm run start:prod; else npm run start:dev; fi