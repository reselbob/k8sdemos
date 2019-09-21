# Dashboard

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml`

`https://api.<cluster-id>.k8s.gigantic.io/ui`

`kubectl proxy`

`kubectl create serviceaccount cluster-admin-dashboard-sa`

```text
kubectl create clusterrolebinding cluster-admin-dashboard-sa \
  --clusterrole=cluster-admin \
  --serviceaccount=default:cluster-admin-dashboard-sa
```

`kubectl get secret | grep cluster-admin-dashboard-sa`

`kubectl describe secret cluster-admin-dashboard-sa-token-6xm8l`

