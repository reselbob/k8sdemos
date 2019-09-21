# Using K8S at the Command Line

The purpose of this project is to demonstrate working at the command line to create and view various Kubernetes objects.

For this lab use the Katacoda Kubernetes Playground found [here](https://katacoda.com/courses/kubernetes/playground).

**Step 1:** Get basic information about the current cluster:

`kubectl cluster-info`

**Step 2:** Get detailed information about the current cluster:

`kubectl cluster-info dump`

**Step 3:** List the availble Kubernetes Objects:

`kubectl api-resources`

**Step 4:** To view all the object running in the current cluster:

`kubectl get all --all-namespaces`

**Step 5:** Creat, inspect and use a pod:

`kubectl run nginx --image=nginx --port=80 --restart=Never`

Let's take a look at the prod to see if we can find its IP address:

`kubectl describe pod nginx`

You'll see output similar to the following:

```yaml
Name:               nginx
Namespace:          default
Priority:           0
PriorityClassName:  <none>
Node:               node01/172.17.0.30
Start Time:         Sat, 21 Sep 2019 18:20:05 +0000
Labels:             run=nginx
Annotations:        <none>
Status:             Running
IP:                 10.32.0.2
Containers:
  nginx:
    Container ID:   docker://988018bd47e47a1975993884c82beb23e2db53b18e792a24c38fa31edba48e8b
    Image:          nginx
    Image ID:       docker-pullable://nginx@sha256:9688d0dae8812dd2437947b756393eb0779487e361aa2ffbc3a529dca61f102c
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Sat, 21 Sep 2019 18:20:11 +0000
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-b42l8 (ro)
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
Volumes:
  default-token-b42l8:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-b42l8
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  74s   default-scheduler  Successfully assigned default/nginx to node01
  Normal  Pulling    73s   kubelet, node01    Pulling image "nginx"
  Normal  Pulled     68s   kubelet, node01    Successfully pulled image "nginx"
  Normal  Created    68s   kubelet, node01    Created container nginx
  Normal  Started    68s   kubelet, node01    Started container nginx
```
Let focus on the IP address:

`master $ kubectl describe pod nginx | grep IP:`

Output:

`IP:                 10.32.0.2`

Let's call the server,

`curl 10.32.0.2`

You'll see the HTML for the `nginx` Welcome Page

```HTML
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```


