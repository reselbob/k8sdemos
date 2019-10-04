# Wordstream

The purpose of this project is to demonstrate asynchronous message consumption in a high-scale, multi-consumer architecture against a
high speed message consumer.

Use the Katacoda `minikube` playground

`https://katacoda.com/javajon/courses/kubernetes-fundamentals/minikube`

Get the code from the GitHub repository

`git clone https://github.com/reselbob/k8sdemos/`

Navigate to the project directory

`cd k8sdemos/wordstream`

Generate the local Docker registry and populate with the the `redis` Docker image
as well as the custom application images

`sh docker-seed.sh`

Navigate to the project's `kubernetes` directory

`cd kubernetes`

Fire the script the creates the Kubernetes deployments and services as starts
outputting the message output to `stdout`.

`sh generate-k8s-resources.sh`