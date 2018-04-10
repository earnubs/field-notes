#!/bin/sh -e

docker build -t blog .
docker run -dti -p 8080:8080 blog /bin/bash
open http://localhost:8080/
CONTAINER_ID=$(docker ps -alq)
if [ -d "./build" ]; then
  rm -r ./build
fi
docker cp $CONTAINER_ID:/blog/build ./build
