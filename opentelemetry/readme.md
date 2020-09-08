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

Create Hotrod under Kubernetes

`kubectl apply -f hotrod-k8s.yaml`

Take a look at everything to make sure all is well

`kubectl get all -n observability`

Turn on the Kubernetes proxy is you are running in Katacoda

`kubectl proxy`

Get the value of the NodePort that HotRod is running against

`kubectl get service -n observability`


### Running the Web App

Run the HotRod website using the NodePort value

### Viewing Trace Behavior in Jaeger UI