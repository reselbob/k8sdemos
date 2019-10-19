# Secrets

**Step 1:** Go to the Katacoda Kubernetes Playground

`https://katacoda.com/courses/kubernetes/playground`

**Step 2:** In the upper terminal window with the prompt, `master$`,
clone the source code repository:

`git clone https://github.com/reselbob/k8sdemos.git`

**Step 3:** Navigate to the directory that contains the source code for this
lab.

`cd cd k8sdemos/secrets/`


**Step 4:** Look at the secret to get familiar with it:

`cat manifests/simple-secret.yaml`

You'll get output like so:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rmmaster
```
Notice that the secret defines two key-value pairs.

```yaml
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rmmaster
```
The values assigned to the keys are [Base64 encoded](https://en.wikipedia.org/wiki/Base64). In steps that follow we're going to assign values to 
particular environment variables in a pod's containers using the secret. Kubernetes
has the "smarts" to  decode the Base64 encoded values 
automatically upon usage. (You'll see the the decoding take place below in Step 9.)

**Step 5:** Apply the secret that's described in the manifest file:

`kubectl apply -f manifests/simple-secret.yaml`

You'll get output similar to the following:

`secret/mysecret created`

**Step 6:** Take a look at the manifest file that describes the pod that will
use the secret.

`cat manifests/secret-pod.yaml`

You'll get output similar to the following:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
    - name: pinger
      image: reselbob/pinger
      env:
        - name: SUPER_SECRET_USERNAME
          valueFrom:
            secretKeyRef:
              name: mysecret
              key: username
        - name: SUPER_SECRET_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysecret
              key: password
  restartPolicy: Never
```



**Step 7:** Create a pod the uses the secret:

`kubectl apply -f manifests/secret-pod.yaml`

You'll get output similar to the following:

`pod/secret-env-pod created`

**Step 8:** Go ensure the pod: is running:

`kubectl get pods`

You'll get output similar to the following:

```text
NAME             READY   STATUS    RESTARTS   AGE
secret-env-pod   1/1     Running   0          47s
```

**Step 9:** See if the secret "stuck" by using the command set, `kubectl exec` to list the environment
variables assigned to ßthe pod's container.

`kubectl exec -it secret-env-pod -- printenv`

You'll get output similar to, but not exactly like the following:

```text
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=secret-env-pod
TERM=xterm
SUPER_SECRET_USERNAME=admin
SUPER_SECRET_PASSWORD=1f2d1e2e67df
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
KUBERNETES_SERVICE_HOST=10.96.0.1
NODE_VERSION=8.9.4
YARN_VERSION=1.3.2
HOME=/root
```

Notice that there environment variables we created using the Kubernetes
secret values are present and Based64 decoded:

**`SUPER_SECRET_USERNAME=admin`**

**`SUPER_SECRET_PASSWORD=1f2d1e2e67df`**

**CONGRATULATIONS!** You've completed the exercise.
