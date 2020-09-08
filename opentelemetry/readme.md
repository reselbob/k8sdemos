# Working with OpenTelemetry Under Kubernetes

## Objective
The objective of this scenario is to demonstrate how to use OpenTelementry to trace request and event behavior in services running in the Kubernetes

## Go To Kubernetes Playground on Katacoda

(optional)

`https://katacoda.com/courses/kubernetes/playground`

## Getting the Code

Clone the code from GitHub

`git clone https://github.com/reselbob/k8sdemos.git`

Navigate to the directory that contains the lesson code

`cd ./k8sdemos/opentelemetry`

## Installation the OpenTelemetry Operator

`sh install-operator.sh`

## Subjecting the HotRod Web Application to OpenTelemetry Monitoring 

Get the HotRod Code

`git clone https://github.com/jaegertracing/jaeger.git`

`cd jaeger/examples`

### Configure HotRod

### Running the Web App

### Viewing Trace Behavior in Jaeger UI