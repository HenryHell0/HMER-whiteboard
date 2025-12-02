FROM node:latest

WORKDIR /app

COPY package*.json .
RUN npm install --production

COPY server.js .

RUN mkdir -p /app/data
RUN touch /app/data/feedback.txt

EXPOSE 3100

CMD ["node", "server.js"]