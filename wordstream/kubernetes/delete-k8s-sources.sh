#!/usr/bin/env bash


kubectl delete service wordstream-producer
kubectl delete service wordstream-consumer

kubectl delete pod wordstream-producer
kubectl delete pod  wordstream-consumer
