# RBAC

The purpose of this lab is to demonstrate working with Kubernetes Roles Basec Access Control.

**Step 1:** Create a `namespace` named `office`.

`kubectl create namespace office`

**Step 2:** Generate an RSA key using `openssl`

`openssl genrsa -out employee.key 2048`

This will generate and `employee.key`.

**Step 3:** Create the certificate signing request file, `employee.csr`.

`openssl req -new -key employee.key -out employee.csr -subj "/CN=employee/O=acme"`

**Step 4:** take a look at the contents of `/etc/kubernetes/pki`

`ls -ltr /etc/kubernetes/pki`

You'll see output similar to the following:

```text
-rw------- 1 root root 1679 Sep 27 06:10 ca.key
-rw-r--r-- 1 root root 1025 Sep 27 06:10 ca.crt
-rw------- 1 root root 1675 Sep 27 06:10 apiserver.key
-rw-r--r-- 1 root root 1216 Sep 27 06:10 apiserver.crt
-rw------- 1 root root 1675 Sep 27 06:10 apiserver-kubelet-client.key
-rw-r--r-- 1 root root 1099 Sep 27 06:10 apiserver-kubelet-client.crt
drwxr-xr-x 2 root root 4096 Sep 27 06:10 etcd
-rw------- 1 root root 1675 Sep 27 06:10 apiserver-etcd-client.key
-rw-r--r-- 1 root root 1090 Sep 27 06:10 apiserver-etcd-client.crt
-rw------- 1 root root 1679 Sep 27 06:10 front-proxy-ca.key
-rw-r--r-- 1 root root 1038 Sep 27 06:10 front-proxy-ca.crt
-rw------- 1 root root 1675 Sep 27 06:10 front-proxy-client.key
-rw-r--r-- 1 root root 1058 Sep 27 06:10 front-proxy-client.crt
-rw------- 1 root root  451 Sep 27 06:10 sa.pub
-rw------- 1 root root 1675 Sep 27 06:10 sa.key
```
Notice that files, `ca.key` and `ca.crt`. These files will be referenced when making the `employee.crt`.


**Step 5:** Create the `employee.crt` file.

`sudo openssl x509 -req -in employee.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out employee.crt -days 500`

**Step 6:** Make a directory, `$HOME/.certs` and move the files, `employee.crt` and `employee.key` into the directory `$HOME/.certs`.

`mkdir -p $HOME/.certs && mv employee.crt employee.key $HOME/.certs`

**Step 7:** Insert the newly created credentials to Kubernetes Configuration using the following statement:

`kubectl config set-credentials employee --client-certificate=$HOME/.certs/employee.crt  --client-key=$HOME/.certs/employee.key`

**WHERE** 

* `kubectl config set-credentials employee` is the command set that identifies the user, `employee` as the entity to which the credentials will be set.
* ` --client-certificate=$HOME/.certs/employee.crt` indicates the location of the certificate.
* ` --client-key=$HOME/.certs/employee.key` indicates the location of the client key.

**Step 8:** Add a new [context](https://www.decodingdevops.com/what-is-kubernetes-context-and-kubernetes-context-tutorial/) to the Kubernetes
cluster:

`kubectl config set-context employee-context --cluster=kubernetes --namespace=office --user=employee`

**WHERE** 

* `kubectl config set-context` is the command set to create the new context
* `employee-context` is the name of the new context
* `--cluster=kubernetes` indicates the cluster to use
* `--namespace=office` indicates the namespace the cluster will support, in this case, `office`
*` --user=employee` indicates the `user` that will be bound to the new context

**Step 9:** Try to `get pods` using the newly created context

`kubectl --context=employee-context get pods`

You'll error:

`Error from server (Forbidden): pods is forbidden: User "employee" cannot list resource "pods" in API group "" in the namespace "office"`

Why? Because a role and rolebinding have not been defined for the user, `employee`.

**Step 10:**

Take a look at the contents of the manifest file that describes the Kubernetes role, `deployment-manager`.

`cat manifests/role-deployment-manager.yaml`

You'll see output as follows:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  namespace: office
  name: deployment-manager
rules:
- apiGroups: ["", "extensions", "apps"]
  resources: ["deployments", "replicasets", "pods"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"] # You can also use ["*"]
```
The file, ` manifests/role-deployment-manager.yaml` will allow the role, `deployment-manager` to get pods
in the namespace `office`

**Step 11:** Let's create the `deployment-manager` in a declarative manner using the manifest file.

`kubectl apply -f manifests/role-deployment-manager.yaml`

You'll get the following output:

`role.rbac.authorization.k8s.io/deployment-manager created`

**Step 12:** Take a look at the contents of the manifest file that describes the Kubernetes `rolebinding`, `deployment-manager-binding`.

`cat manifests/rolebinding-deployment-manager.yaml`

You'll see output as follows:

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: deployment-manager-binding
  namespace: office
subjects:         
- kind: User
  name: employee
  apiGroup: ""
roleRef:
  kind: Role
  name: deployment-manager
  apiGroup: ""
```
This `rolebinding` will bind the user, `employee` to the role, `deployment-manager`.

**Step 13:** Let's create the `deployment-manager-binding` in a declarative manner using the manifest file.

`kubectl create -f manifests/rolebinding-deployment-manager.yaml`

You'll get output like so:

`rolebinding.rbac.authorization.k8s.io/deployment-manager-binding created`

**Step 14:** Now that the `role` and `rolebinding` have been created, try once more to get some
pods using the context, `employee-context`.

`kubectl --context=employee-context get pods`

You'll get output like so:

`No resources found.`

This is good news because although there happen to be on pods, created you are not being denied permission
to view pods. Earlier on you were.


**Step 15:** Let's try to create a new deployment, `acme-nginx` in an imperative manner at
the command line using the `kubectl run` command.

`kubectl --context=employee-context run --image nginx acme-nginx`

**WHERE** 
* `kubectl` is the CLI client
* `--context=employee-context` indicates to use context, `employee-context`
* `run` is the Kubernetes subcommand
* ` --image nginx` is the option that indicates the Docker image to use when creating the deployment

You'll get output similar to the following:

`deployment.apps/acme-nginx created`

**Step 14:** Let's now try to get pods under the context, `employee-context`. We use the custom formatting
capabilities that Kubernetes provides to show only `NODE`, `NAME`, `STATUS` and `NAMESPACE` columns of `kubectl get pod`.

`kubectl --context=employee-context get pod -o=custom-columns=NODE:.spec.nodeName,NAME:.metadata.name,STATUS:.status.phase,NAMESPACE:.metadata.namespace --namespace=office
`

You'll get output similar to the following:

```yaml
NODE     NAME                          STATUS    NAMESPACE
node01   acme-nginx-79d6c59d64-kbctm   Running   office
```

You'll get a pod. That pod will be in the namespace, `office`. No other pods from other namespaces will appear

**Step 15:** Let's now try to get pods under the context, `employee-context` but this time only those
pods in the default namespace.

`kubectl --context=employee-context get pods --namespace=default`

You'll error  like so:
`Error from server (Forbidden): pods is forbidden: User "employee" cannot list resource "pods" in API group "" in the namespace "default"`

Why? Because the user `employee` does not have permission to view pods in the `default` namespace.

