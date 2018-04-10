#!/bin/sh -e

#LABEL=blog:$(git rev-parse --short origin/master)
docker build -t blog .
docker run -ti -d blog /bin/bash
CONTAINER_ID=$(docker ps -alq)
rm -r ./build
docker cp $CONTAINER_ID:/blog/build ./build
docker stop $CONTAINER_ID
