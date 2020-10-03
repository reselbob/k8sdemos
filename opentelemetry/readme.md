# Working with OpenTelemetry Under Kubernetes

## Objective
The objective of this scenario is to demonstrate how to use OpenTelementry to trace request and event behavior in services running in the Kubernetes

## Go To Kubernetes Playground on Katacoda

(optional)

`https://katacoda.com/courses/kubernetes/playground`

## Adding the Ingress Controller

You're going to need a K8S Ingress controller to access the Jaeger UI that's running under K8S. Let's use [Contour](https://projectcontour.io/getting-started/);

`kubectl apply -f https://projectcontour.io/quickstart/contour.yaml`

Take a look at contour to get the NodePort values.

`kubectl get -n projectcontour service envoy -o wide`

Confirm the ingress controller. works

`kubectl apply -f https://projectcontour.io/examples/kuard.yaml`

## Getting the Code

Clone the code from GitHub

`git clone https://github.com/reselbob/k8sdemos.git`

Navigate to the directory that contains the lesson code

`cd ./k8sdemos/opentelemetry`

## Installation the OpenTelemetry Operator

`sh install-operator.sh`

Create an instance of Jaeger in the cluster

`kubectl apply -f jaeger-rod.yaml`

Make sure all is well

`kubectl get all -n observability`

You're good to go when things look similar to this
```
NAME                                   READY   STATUS    RESTARTS   AGE
pod/jaeger-operator-6bd7c6c7f5-qnrdw   1/1     Running   0          3m22s
pod/jeager-hotrod-6f55947bf-jvspn      1/1     Running   0          109s

NAME                                       TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                          AGE
service/jaeger-operator-metrics            ClusterIP   10.106.60.180    <none>        8383/TCP,8686/TCP                        110s
service/jeager-hotrod-agent                ClusterIP   None             <none>        5775/UDP,5778/TCP,6831/UDP,6832/UDP      109s
service/jeager-hotrod-collector            ClusterIP   10.98.89.221     <none>        9411/TCP,14250/TCP,14267/TCP,14268/TCP   109s
service/jeager-hotrod-collector-headless   ClusterIP   None             <none>        9411/TCP,14250/TCP,14267/TCP,14268/TCP   109s
service/jeager-hotrod-query                ClusterIP   10.102.123.168   <none>        16686/TCP                          109s

NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/jaeger-operator   1/1     1            1           3m23s
deployment.apps/jeager-hotrod     1/1     1            1           109s

NAME                                         DESIRED   CURRENT   READY   AGE
replicaset.apps/jaeger-operator-6bd7c6c7f5   1         1         1       3m22s
replicaset.apps/jeager-hotrod-6f55947bf      1         1         1       109s

```

## Subjecting the HotRod Web Application to OpenTelemetry Monitoring 

Create Hotrod under Kubernetes that's wired to Jaeger

`kubectl apply -f hotrod-k8s.yaml`

Take a look at everything to make sure all is well

`kubectl get all -n observability`

Turn on the Kubernetes proxy is you are running in Katacoda

`kubectl proxy`

Get the value of the NodePort that HotRod is running against

`kubectl get service -n observability`

### Taking a look at the traffic between pods

`kubectl get pods -n observability`

You'll get something like this:

```
hotrod-6c8c4b7fc-vrgfw             2/2     Running   0          6m19s
jaeger-operator-6bd7c6c7f5-qnrdw   1/1     Running   0          10m
jeager-hotrod-6f55947bf-jvspn      1/1     Running   0          9m23s

```

Let's take a look at the logs for the Jaeger agent in the HotRod application

`kubectl logs -n observability hotrod-6c8c4b7fc-vrgfw -c jaeger-agent`

### Running the Web App

Run the HotRod website using the NodePort value

### Viewing Trace Behavior in Jaeger UI