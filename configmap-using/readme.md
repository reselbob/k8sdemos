# Using a ConfigMap

**Step 1:** Create the configmap

`kubectl apply -f manifests/special-config.yaml`

**Step 2:** Apply it

`kubectl apply -f manifests/pinger-test-pod.yaml`

**Step 3:** Take a look at the outcome

`kubectl exec -it pinger-test-container -- sh`
