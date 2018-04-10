FROM node:6

WORKDIR /blog

ENV TZ=Europe/London
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN git clone https://github.com/earnubs/field-notes.git /blog
RUN npm install
COPY ./assets/fonts/DINWeb* assets/fonts/
RUN npm run build
