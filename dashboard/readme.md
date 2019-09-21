# Dashboard

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml`


`kubectl proxy`



`http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/`

`kubectl create serviceaccount cluster-admin-dashboard-sa`

```text
kubectl create clusterrolebinding cluster-admin-dashboard-sa \
  --clusterrole=cluster-admin \
  --serviceaccount=default:cluster-admin-dashboard-sa
```

`kubectl get secret | grep cluster-admin-dashboard-sa`

`kubectl describe secret cluster-admin-dashboard-sa-token-6xm8l`

