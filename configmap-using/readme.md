# Using a ConfigMap

The purpose of this lab is to present help you learn how to inject environment variables into a 
container by using data that's defined in a config map.

**Step 1:** View the contents of the manifest file that will be used to create the `ConfigMap`

`cat manifests/special-config.yaml`

You'll see the following output:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: special-config
  namespace: default
data:
  special.how: very
  special.type: charm
```

**Step 2:** Create the configmap as defined in the manifest file, `manifests/special-config.yaml`

`kubectl apply -f manifests/special-config.yaml`

**Step 3:** Take a look at the manifest file that will be used to create the pod that will
use the `ConfigMap`:

`cat manifests/pinger-test-pod.yaml`

You'll see the following output:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pinger-test-pod
spec:
  containers:
    - name: test-container
      image: reselbob/pinger
      env:
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              name: special-config
              key: special.how
  restartPolicy: Never
```
Notice that the attribute, `env:` in the container `spec` references the configmap to get value for the environment variable,
`SPECIAL_LEVEL_KEY`, like so:

```yaml
env:
- name: SPECIAL_LEVEL_KEY
  valueFrom:
    configMapKeyRef:
      name: special-config
      key: special.how
```


**Step 4:** Now let create the pod that uses the configmap in a declarative manner using the manifest file:

`kubectl apply -f manifests/pinger-test-pod.yaml`

**Step 5:** Let's take a look at the environment variables that are in the pod's container, using the following command:

`kubectl exec -it pinger-test-pod -- printenv`

**WHERE**

* `kubectl exec -it` is the `kubectl` command set and options indicating to execute a command side of the pod's container.
(Remember, if the pod has only one container, it will enter that single container by default. If the pod has more than one container,
you'll next to use the `-c` option with the following format, `-c container_name`)
* `pinger-test-pod` is the pod in question.
* ` -- printenv` is the command to be executes within the pod and outputted to standard out.

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
existence of the environment variable, `SPECIAL_LEVEL_KEY=very`. `SPECIAL_LEVEL_KEY=very` is the value defined in the `ConfigMap`.
 
 **Lab Complete!**
