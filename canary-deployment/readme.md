# Canary Deployment Under Kubernetes

The purpose of this project is to demonstrate how to do a Canary deployment pods containing new application 
logic onto an existing service running under Kubernetes.

**Step 1:** Go the Katacoda Kubernetes Playground

`https://katacoda.com/courses/kubernetes/playground`

**Step 2:** Clone the source code from GitHub.

`git clone https://github.com/reselbob/k8sdemos.git`

**Step 3:** Navigate to the project directory.

`cd k8sdemos/canary-deployment`

**Step 4:** Create the first deployment, `deployment-red` into the Kubernetes cluster.

`kubectl apply -f deployment-red.yaml`

You get the following output:

`deployment.extensions/deployment-red created`

**Step 5:** Create the second deployment, `deployment-green` into the Kubernetes cluster.

`kubectl apply -f deployment-green.yaml`

You get the following output:

`deployment.extensions/deployment-green created`

**Step 6:** Let's retrieve a listing of the pods according to the a label that was defined for the pod in the 
deployment declaration. First let's take a look at the contents of the yaml file, `deployment-red.yaml`.

`cat deployment-red.yaml`

You'll get the following output:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deployment-red
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 10%
  template:
    metadata:
      labels:
        app: example_code
        color: red
    spec:
      containers:
      - name: echocolor
        image: reselbob/echocolor:v0.1
        ports:
        - containerPort: 3000
        env:
        - name: COLOR_ECHO_COLOR
          value: RED
        - name: COLOR_ECHO_VERSION
          value: V1
```

Notice the entry in `template` section:

```yaml
  template:
    metadata:
      labels:
        type: example_code
        color: red
    spec:
```
This entry means that the pods created by the deployment will have two labels, `type: example_code` and
`color: red`.

Let take a look at the deployment file, `deployment-green.yaml`.

`cat deployment-green.yaml`

You'll get output as follows:

```yaml
apiVersion: apps/v1
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
        app: example_code
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
Notice the entry in `template` section in the file, `deployment-green.yaml`. This file declares two labels for the pods,
`type: example_code` and `color: green`.

These labels distinction are very important in terms of controlling the Canary Deployment.

**Step 7:** Let's retrieve a list of pods according to the label, `type=example_code`.

`kubectl get pods -l app=example_code`

You'll get output similar to the following:
```text
NAME                                READY   STATUS    RESTARTS   AGE
deployment-green-dc8b9759b-7q5bt   1/1     Running   0          55s
deployment-green-dc8b9759b-dx526   1/1     Running   0          55s
deployment-green-dc8b9759b-tx5vg   1/1     Running   0          55s
deployment-red-9865b4c9b-6xbcc     1/1     Running   0          76s
deployment-red-9865b4c9b-79thh     1/1     Running   0          77s
deployment-red-9865b4c9b-gs8sz     1/1     Running   0          76s
deployment-red-9865b4c9b-kcr8d     1/1     Running   0          76s
deployment-red-9865b4c9b-p7mdq     1/1     Running   0          76s
deployment-red-9865b4c9b-q8644     1/1     Running   0          76s
deployment-red-9865b4c9b-v9snr     1/1     Running   0          76s
deployment-red-9865b4c9b-wvg7n     1/1     Running   0          76s
deployment-red-9865b4c9b-zb8kk     1/1     Running   0          76s
deployment-red-9865b4c9b-zvl2l     1/1     Running   0          76s
```
Notice that both the pods created by the `deployment-red.yaml` and `deployment-green.yaml` manifests are 
returned. This is because we're looking for **any** pod that has the label, `app=example_code`.

**Step 8:** Now let's retrieve only the pods that have both the labels, `type=example_code` and `color=red`.

`kubectl get pods -l app=example_code  -l color=red`

You'll get output similar to the following:

```text
NAME                              READY   STATUS    RESTARTS   AGE
deployment-red-9865b4c9b-6xbcc   1/1     Running   0          3m31s
deployment-red-9865b4c9b-79thh   1/1     Running   0          3m32s
deployment-red-9865b4c9b-gs8sz   1/1     Running   0          3m31s
deployment-red-9865b4c9b-kcr8d   1/1     Running   0          3m31s
deployment-red-9865b4c9b-p7mdq   1/1     Running   0          3m31s
deployment-red-9865b4c9b-q8644   1/1     Running   0          3m31s
deployment-red-9865b4c9b-v9snr   1/1     Running   0          3m31s
deployment-red-9865b4c9b-wvg7n   1/1     Running   0          3m31s
deployment-red-9865b4c9b-zb8kk   1/1     Running   0          3m31s
deployment-red-9865b4c9b-zvl2l   1/1     Running   0          3m31s
```
The output makes sense because we're asking for pods that **only** have the labels, `app=example_code` and `color=red`.

**Step 9:** Let's retrieve only the pods that have both the labels, `type=example_code` and `color=green`.

`kubectl get pods -l app=example_code  -l color=green`

You'll get the following output:

```text
NAME                                READY   STATUS    RESTARTS   AGE
deployment-green-dc8b9759b-7q5bt   1/1     Running   0          4m12s
deployment-green-dc8b9759b-dx526   1/1     Running   0          4m12s
deployment-green-dc8b9759b-tx5vg   1/1     Running   0          4m12s
```
This output makes sense because we're asking for pods that **only** have the labels, `app=example_code` and `color=green`.

**Step 10:** Now it's time to bind the pods to some services. First, let's take a look at the contents of the first service as defined
in the yaml file, `service_01.yaml`.

`cat service_01.yaml`

You'll get the following output:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: echocolor-all
spec:
  selector:
    app: example_code
  ports:
  -
    protocol: TCP
    port: 3000
    targetPort: 3000
```

Notice that the service, which happens to be named, ` echocolor-all` is going to bind to any pod that has a label  of `type: example_code`.
(This is defined in the `selector` section of yaml file.)

**Step 11:** Create the service by applying the manifest file, `service_01.yaml`, like so:

`kubectl apply -f service_01.yaml`

You'll get the following output:

`service/echocolor-all created`

**Step 12:** Let's take a look at the second service, as defined in the file, `service_02.yaml`.

`cat service_02.yaml`

You'll get the following output:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: echocolor-red
spec:
  selector:
    app: example_code
    color: red
  ports:
  -
    protocol: TCP
    port: 3000
    targetPort: 3000
  type: NodePort
```
Notice that this service will bind to pods that have **both** the labels. `type: example_code` and `color: red`. This is an important
distinction.

**Step 13:** Create the service by applying the manifest file, `service_02.yaml`, like so:

`kubectl apply -f service_02.yaml`

You'll get the following output:

`service/echocolor-red created`

**Step 14:** Finally, let's create the third service. But before we do, let's look at the content of the manifest file, `service_03.yaml`.

`cat service_03.yaml`

You get output as follows:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: echocolor-green
spec:
  selector:
    app: example_code
    color: green
  ports:
  -
    protocol: TCP
    port: 3000
    targetPort: 3000
  type: NodePort

```
Notice that this third service will bind to pods that have **both** the labels. `type: example_code` and `color: green`. This is another
 important distinction.
 
**Step 15:** Create the third service by applying the manifest file, `service_03.yaml`, like so:

`kubectl apply -f service_03.yaml`

You get output as follows:

`service/echocolor-green created`

**Step 16:** Let's a listing of the services that have the name, `echocolor-all`:

`kubectl get services  --all-namespaces --field-selector metadata.name=echocolor-all`

You'll get the following output:

```text
NAMESPACE   NAME            TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
default     echocolor-all   NodePort   10.101.94.70   <none>        3000:30671/TCP   11m
```
Take notice of the NodePort that exposes the service. In this case the NodePort is `30671`. It most probably will be different for
your sessions.

**Step 17:** Let's call the service named `echocolor-all` ten times using the code shown below.

First, turn on the Kubernetes proxy to expose the cluster IP and node port to the local machine.

in a separate terminal window type:

`kubectl proxy`

Then return to the first terminal window to get the IP address of the Kubernetes cluster running under Katacoda.

`kubectl cluster-info`

You'll get output similar to the following.

```text
Kubernetes master is running at https://172.17.0.40:6443
KubeDNS is running at https://172.17.0.40:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```
Take notice that the IP address of the Kubernetes cluster  is `172.17.0.40`. It most probably will be different for
your sessions.

Now let make the call using the following format:

`for i in {1..10}; do curl <IP_OF_CLUSTER>:<NODE_PORT>; done`

In the case of this particular session the call will be:

`for i in {1..10}; do curl 172.17.0.40:30671; done`

You get output similar to the following:

```json
{
    "color": "RED",
    "date": "2019-11-16T20:59:07.557Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T20:59:07.571Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T20:59:07.589Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T20:59:07.613Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T20:59:07.623Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T20:59:07.634Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T20:59:07.645Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T20:59:07.654Z"
}{
    "color": "RED",
    "date": "2019-11-16T20:59:07.666Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T20:59:07.676Z"
}
```

Notice that both the pods for the `red` deployment and `green` deployment are being called. This makes sense it the service, `echocolor-all`
is bond to any pods have has the label, ` type: example_code`.

**Step 18:** Let's a listing of the services that have the name, `echocolor-red`: 

`kubectl get services  --all-namespaces --field-selector metadata.name=echocolor-red`

You'll get put similar to the following:

```text
NAMESPACE   NAME            TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
default     echocolor-red   NodePort   10.96.86.130   <none>        3000:32337/TCP   20m
```
Take notice of NodePort that exposes the service. In this case it's `32337`.

Now let's make ten calls the service using `curl`. (**Remember!** We discovered the IP address of the cluster above in **Step: 17**. )

`for i in {1..10}; do curl <IP_OF_CLUSTER>:<NODE_PORT>; done`

In the case of this particular session, the call will be:

`for i in {1..10}; do curl 172.17.0.40:32337; done`

You'll get output similar to the following:
```json
{
    "color": "RED",
    "date": "2019-11-16T21:08:00.354Z"
}{
    "color": "RED",
    "date": "2019-11-16T21:08:00.369Z"
}{
    "color": "RED",
    "date": "2019-11-16T21:08:00.379Z"
}{
    "color": "RED",
    "date": "2019-11-16T21:08:00.392Z"
}{
    "color": "RED",
    "date": "2019-11-16T21:08:00.401Z"
}{
    "color": "RED",
    "date": "2019-11-16T21:08:00.409Z"
}{
    "color": "RED",
    "date": "2019-11-16T21:08:00.416Z"
}{
    "color": "RED",
    "date": "2019-11-16T21:08:00.423Z"
}{
    "color": "RED",
    "date": "2019-11-16T21:08:00.433Z"
}{
    "color": "RED",
    "date": "2019-11-16T21:08:00.440Z"
}
```

This make sense because the service named, `echocolor-red`  is bound to pods that have **both** the labels, `type: example_code` and
`color:red`.

**Step 19:** Let's do the `green` service. First find the NodePort of the service:

`kubectl get services  --all-namespaces --field-selector metadata.name=echocolor-green`

You'll get output similar the following:

```text
NAMESPACE   NAME              TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
default     echocolor-green   NodePort   10.108.83.68   <none>        3000:31298/TCP   25m
```
Now, run against the service ten times using the format we've described before.

`for i in {1..10}; do curl localhost:<NODE_PORT>; done`

In the case of this session, the call to `curl` will be the following:

`for i in {1..10}; do curl 172.17.0.40:31298; done`

With output as follows:

```json
{
    "color": "GREEN",
    "date": "2019-11-16T21:14:11.397Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:14:11.404Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:14:11.410Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:14:11.416Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:14:11.425Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:14:11.432Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:14:11.439Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:14:11.448Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:14:11.457Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:14:11.463Z"
}
```
Again, this make sense because the service named, `echocolor-green`  is bound to pods that have **both** the labels, `type: example_code` and
`color:green`.

**Step 20:** At this point we have both the `red` and `green` pods running under the service named, `echocolor-all`. Now, let's suppose
that the `green` pods, the ones with the label, `color:green` contain the new code we're testing out in a "Canary" fashion. Let's say
that the `green` pods are running to our expectation and that we want to take the `red` pods offline for the service, `echocolor-all`.

How do we do this?

The way we do this is to delete the `red` deployment like so:

`kubectl delete -f deployment-red.yaml`

You'll get the following output:

`deployment.extensions "deployment-red" deleted`

The service, `echocolor-all` will now only use the `green` pods. **Remember!** The service named, `echocolor-all` is bound to **any**
pod that has the label, `type: example_code`. The pods in the deployment, `deployment-green` do indeed have the label,  `type: example_code`

**Step 21:** Run the `for` loop against the service, `echocolor-all` again.

Get the NodePort:

`kubectl get services  --all-namespaces --field-selector metadata.name=echocolor-all`

You'll see the following output:

```text
NAMESPACE   NAME            TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
default     echocolor-all   NodePort   10.101.94.70   <none>        3000:30671/TCP   11m
```
Do the `curl` loop according to the following format:

`for i in {1..10}; do curl <IP_OF_CLUSTER>:<NODE_PORT>; done`

In the case of this particular session, the call will be:

`for i in {1..10}; do curl 172.17.0.40:30671; done`

You'll get output similar to:

```json
{
    "color": "GREEN",
    "date": "2019-11-16T21:33:06.286Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:33:06.301Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:33:06.312Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:33:06.319Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:33:06.331Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:33:06.341Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:33:06.349Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:33:06.356Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:33:06.362Z"
}{
    "color": "GREEN",
    "date": "2019-11-16T21:33:06.369Z"
}
```

Notice only the `green` pods are running! The Canary Deployment was a success!

**Congratulations! You've finished the exercise.**
