# Fetching the minified node image of alpine linux
FROM node:slim

ENV NODE_ENV=development

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8500

CMD ["npm", "run", "start"]