FROM node:14

ADD https://github.com/tprlab/predator-prey/archive/master.zip /
RUN unzip /master.zip

WORKDIR /predator-prey-master

RUN npm install

EXPOSE 8081

CMD ["node", "server.js"]
