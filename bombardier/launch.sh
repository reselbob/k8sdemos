#!/usr/bin/env bash

docker build -t bombardier-consumer . -f Dockerfile_consumer
docker build -t bombardier-producer . -f Dockerfile_producer

docker run -d --name redis-master -p 6379:6379 redis

docker run -d --name mybombardier-producer bombardier-producer
docker run -d --name mybombardier-consumer bombardier-consumer