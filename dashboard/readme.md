# Dashboard

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml`


`kubectl proxy`

`kubectl cluster-info`

`kubectl proxy --address="172.42.42.100" -p 8001 --accept-hosts='^*$'`

`curl http://172.42.42.100:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/`

`kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | awk '/^deployment-controller-token-/{print $1}') | awk '$1=="token:"{print $2}'`

`kubectl create serviceaccount cluster-admin-dashboard-sa`

```text
kubectl create clusterrolebinding cluster-admin-dashboard-sa \
  --clusterrole=cluster-admin \
  --serviceaccount=default:cluster-admin-dashboard-sa
```

`kubectl get secret | grep cluster-admin-dashboard-sa`

`kubectl describe secret cluster-admin-dashboard-sa-token-tbd5r`

**WHERE**
* `cluster-admin-dashboard-sa-token-tbd5r` is the secret retrieved by `kubectl get secret`

Or

`kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')`

