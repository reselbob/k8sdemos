# Simple Pod Manifests

The purpose of this project is to demonstrate on an introductory manner the use of Kubernetes
manifests to create pods.

For this lab use the Katacoda Kubernetes Playground found [here](https://katacoda.com/courses/kubernetes/playground).

**Step 1:** Create a simple pod using a manifest file.

`kubectl apply -f manifests/simplepod.yaml`

Take a look the results

`kubectl get pod pinger`

**Step 2:** Create an [apache tomcat](https://tomcat.apache.org/) pod.

`kubectl apply -f manifests/tomcat-pod.yaml`

Take a look the results

`kubectl get pod tomcat`

**Step 3:** Get the IP address of the pod

`master $ kubectl describe pod tomcat | grep IP:`

**Step 4:** Do a `localhost` ping against the pod

`curl <POD_IP_ADDRESS>:8080`

