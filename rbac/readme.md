# RBAC

The purpose of this project is to demonstrate working with Kubernetes Roles Basec Access Control.

**Step 1:** Create a `namespace` named `office`.

`kubectl create namespace office`

**Step 2:**

`openssl genrsa -out employee.key 2048`

**Step 3:**

`openssl req -new -key employee.key -out employee.csr -subj "/CN=employee/O=acme"`

**Step 4:**

`ls -ltr /etc/kubernetes/pki`

**Step 5:**

`sudo openssl x509 -req -in employee.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out employee.crt -days 500`

**Step 6:**

`mkdir -p /home/ubuntu/.certs && mv employee.crt employee.key $HOME/.certs`

**Step 7:**

`kubectl config set-credentials employee --client-certificate=$HOME.certs/employee.crt  --client-key=$HOME/.certs/employee.key`

**Step 8:**

`kubectl config set-context employee-context --cluster=kubernetes --namespace=office --user=employee`

**Step 9:**

`kubectl --context=employee-context get pods`

**Step 1:**

`kubectl create -f manifests/role-deployment-manager.yaml`

**Step 10:**

`kubectl create -f manifests/rolebinding-deployment-manager.yaml`

**Step 11:**

`kubectl --context=employee-context get pods`

**Step 12:**

`kubectl --context=employee-context run --image nginx acme-nginx`

**Step 13:**

`kubectl --context=employee-context get pods`

**Step 14:**

`kubectl --context=employee-context get pods --namespace=default`