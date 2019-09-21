# Using a ConfigMap

**Step 1:** Create the configmap

`kubectl apply -f manifests/special-config.yaml`

**Step 2:** Apply it

`kubectl apply -f manifests/dapi-test-pod.yaml`

**Step 3:** Take a look at the outcome

`kubectl exec -it test-container -- sh`