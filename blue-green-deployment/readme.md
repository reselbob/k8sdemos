# Blue Green Deployment

The purpose of the project is demonstrate how to do a `Blue-Green Deployment`.

Blue-green deployment is a technique in which only one of the environments is live at any given time. In this example we'll have two deployments. One will have `green` pods. The other will have `blue` pods.
We'll adjust the label definitions in a Kubernetes service to switch between `blue` and `green`.

**Step 1:** Go the Katacoda Kubernetes Playground

`https://katacoda.com/courses/kubernetes/playground`

**Step 2:** Clone the source code from GitHub.

`git clone https://github.com/reselbob/k8sdemos.git`

**Step 3:** Navigate to the project directory.

`cd k8sdemos/blue-green-deployment`

**Step 4:** Create the Blue Deployment

Take a look at the contents of the manifest file:

`cat deployment-blue.yaml`

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: deployment-blue
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 10%
  template:
    metadata:
      labels:
        type: example_code
        color: blue
    spec:
      containers:
      - name: echocolor
        image: reselbob/echocolor:v0.1
        ports:
        - containerPort: 3000
        env:
        - name: COLOR_ECHO_COLOR
          value: BLUE
        - name: COLOR_ECHO_VERSION
          value: V1
```

Notice tha the pods defined in the deployment declare two labels, `type: example_code` and `color: blue` like so:

```yaml
  template:
    metadata:
      labels:
        type: example_code
        color: blue
```
We'll terms this deployment the `blue` deployment.

Execute the deployment:

`kubectl apply -f deployment-blue.yaml`

You'll the following output:

`deployment.extensions/deployment-blue created`

**Step 5:** Create the Green Deployment

Take a look at the contents of the manifest file:

`cat deployment-green.yaml`

```yaml
kind: Deployment
metadata:
  name: deployment-green
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 10%
  template:
    metadata:
      labels:
        type: example_code
        color: green
    spec:
      containers:
      - name: echocolor
        image: reselbob/echocolor:v0.1
        ports:
        - containerPort: 3000
        env:
        - name: COLOR_ECHO_COLOR
          value: GREEN
        - name: COLOR_ECHO_VERSION
          value: V1

```


Notice tha the pods defined in the deployment declare two labels, `type: example_code` and `color: green` like so:

```yaml
  template:
    metadata:
      labels:
        type: example_code
        color: green
```
We'll terms this deployment the `green` deployment.

Execute the deployment:

`kubectl apply -f deployment-green.yaml`

You'll the following output:

`deployment.extensions/deployment-green created`

**Step 6:** See which pods have the label `type=example_code`.

`kubectl get pods -l type=example_code`

```text
NAME                                READY   STATUS    RESTARTS   AGE
deployment-blue-556fcc8ff7-9gkgg    1/1     Running   0          2m43s
deployment-blue-556fcc8ff7-mx2n9    1/1     Running   0          2m43s
deployment-blue-556fcc8ff7-ts7vx    1/1     Running   0          2m43s
deployment-green-84887f8cf5-bbt6m   1/1     Running   0          35s
deployment-green-84887f8cf5-z8v97   1/1     Running   0          35s
deployment-green-84887f8cf5-zdmns   1/1     Running   0          35s
```

Notice that the pods associated with the `blue` deployment and the pods associated with the `green` deployment are running in the Kubernetes cluster. The
reason that both the `blue` and `green` pods are listed is because we asked for any pod that has the label, `type=example_code`. Both `blue` and 
`green` have the label, `type=example_code`.

**Step 7:** See which pods have the label `type=example_code` and the label, `color=blue`.

`kubectl get pods -l type=example_code  -l color=blue`

```text
NAME                               READY   STATUS    RESTARTS   AGE
deployment-blue-556fcc8ff7-9gkgg   1/1     Running   0          3m21s
deployment-blue-556fcc8ff7-mx2n9   1/1     Running   0          3m21s
deployment-blue-556fcc8ff7-ts7vx   1/1     Running   0          3m21s
```
Only `blue` pods have the labels, `type=example_code` **and**, `color=blue`.

**Step 8:** See which pods have the label `type=example_code` and the label, `color=green`.

`kubectl get pods -l type=example_code  -l color=green`
```text
NAME                                READY   STATUS    RESTARTS   AGE
deployment-green-84887f8cf5-bbt6m   1/1     Running   0          87s
deployment-green-84887f8cf5-z8v97   1/1     Running   0          87s
deployment-green-84887f8cf5-zdmns   1/1     Running   0          87s
```

Only `green` pods have the labels, `type=example_code` **and**, `color=green`.

**Step 9:** Create an instance of the service named, `echocolor` that binds only `blue` pods.

First, take a look at the contents of the manifest file, `service_blue.yaml`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: echocolor
spec:
  selector:
    type: example_code
    color: blue
  ports:
  -
    protocol: TCP
    port: 3000
    targetPort: 3000
  type: NodePort
```

Notice the `name `of the service is, `echocolor` and that it will bind to pods that have both the `type: example_code` and `color: blue`, which by
definition is try of the pods created using the deployment manifest, `deployment-blue.yaml`.

Now create the service by executing the following command:

`kubectl apply -f service_blue.yaml`

You'get

`service/echocolor created`

**Step 10:** Check out the behavior of the service, `echocolor`

`Get the IP address of the cluster:

`kubectl cluster-info`

```text
Kubernetes master is running at https://172.17.0.18:6443
KubeDNS is running at https://172.17.0.18:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

Get the NodePort of the service:

`kubectl get services  --all-namespaces --field-selector metadata.name=echocolor`

```text
NAMESPACE   NAME        TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
default     echocolor   NodePort   10.100.199.225   <none>        3000:30571/TCP   34s
```

Now run a `curl` command ten times against the service to inspect the behavior.

`for i in {1..10}; do curl <IP_OF_CLUSTER>:<NODE_PORT>; done`

In the case of this Katacoda session the call will be:

`for i in {1..10}; do curl 172.17.0.18:30571; done`

```json
{
    "color": "BLUE",
    "date": "2019-11-16T22:20:50.420Z"
}{
    "color": "BLUE",
    "date": "2019-11-16T22:20:50.438Z"
}{
    "color": "BLUE",
    "date": "2019-11-16T22:20:50.453Z"
}{
    "color": "BLUE",
    "date": "2019-11-16T22:20:50.463Z"
}{
    "color": "BLUE",
    "date": "2019-11-16T22:20:50.470Z"
}{
    "color": "BLUE",
    "date": "2019-11-16T22:20:50.477Z"
}{
    "color": "BLUE",
    "date": "2019-11-16T22:20:50.486Z"
}{
    "color": "BLUE",
    "date": "2019-11-16T22:20:50.491Z"
}{
    "color": "BLUE",
    "date": "2019-11-16T22:20:50.498Z"
}{
    "color": "BLUE",
    "date": "2019-11-16T22:20:50.508Z"
}
```

Notice only `blue` behavior is in play.

**Step 11:** Create an instance of the service named, `echocolor` that binds only `green` pods

First, take a look at the contents of the manifest file, `service-green.yaml`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: echocolor
spec:
  selector:
    type: example_code
    color: green
  ports:
  -
    protocol: TCP
    port: 3000
    targetPort: 3000
  type: NodePort
```

Notice the service defined in `service-green.yaml` has the name, `echocolor` which is already in use in the cluster.

Execute the following command to update the service.

`kubectl apply -f service_green.yaml`

You'll get the following output.

`service/echocolor configured`

Notice that output says, `service/echocolor configured` **not** `service/echocolor created`. This is because the service, `echocolor` is already
active. Running the command, `kubectl apply -f service_green.yaml` will just update the service.

Now the service, `echocolor` is bound to `green` pods.

**Step 12:** Run the calls using the `curl` command again:

`for i in {1..10}; do curl localhost:<NODE_PORT>; done`

In the case of this Katacoda session the call will be:

`for i in {1..10}; do curl <IP_OF_CLUSTER>:<NODE_PORT>; done`

```json
{
    "color": "GREEN",
    "date": "2019-11-16T22:21:35.096Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T22:21:35.114Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T22:21:35.124Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T22:21:35.134Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T22:21:35.145Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T22:21:35.154Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T22:21:35.162Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T22:21:35.168Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T22:21:35.174Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T22:21:35.184Z"
}
```
As expected, only `green` behavior is in play.

Notice that are switching between `blue` and `green` deployments even though the service name, `echocolor` remains the same
and the service runs without interruption.

This is the intention of a `Blue-Green Deployment`

**Congratulations! You've completed the exercise!**
