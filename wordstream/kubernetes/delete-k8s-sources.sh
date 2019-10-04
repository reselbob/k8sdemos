#!/usr/bin/env bash

kubectl delete service redis-master
kubectl delete service wordstream-producer
kubectl delete service wordstream-consumer

kubectl delete deployment redis-master
kubectl delete deployment wordstream-producer
kubectl delete deployment wordstream-consumer
