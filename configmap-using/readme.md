# Using a ConfigMap

**Step 1:** Create the configmap

`kubectl apply -f manifests/special-config.yaml`

**Step 2:** Apply it

`kubectl apply -f manifests/pinger-test-pod.yaml`

**Step 3:** Take a look at the outcome

`kubectl exec -it pinger-test-pod -- printenv`

You'll get output similar to the follow.

```text
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=pinger-test-pod
TERM=xterm
SPECIAL_LEVEL_KEY=very
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
KUBERNETES_SERVICE_HOST=10.96.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
NODE_VERSION=8.9.4
YARN_VERSION=1.3.2
HOME=/root
```

 Your `HOME` directory won't necessarily be `/root`. And, the `KUBERNETES` will differ. The important thing to note is the
 existence of the environment variable, `SPECIAL_LEVEL_KEY=very`.
