# Deployment Recreate

The purpose of this project is to demonstrate working with modifying a deployment using the
replace strategy.

For this lab use the Katacoda Kubernetes Playground found [here](https://katacoda.com/courses/kubernetes/playground).

**Step 1:** Inspect the deployment's manifest file:

`cat manifests/deployment-replace-01.yaml`

Take a close look.

Notice the the manifest file has an entry:

```yaml
spec:
  replicas: 3
  strategy:
    type: Recreate
```

Also, notice of the container label, `type: example_code`.

**Step 2:** Create the deployment:

`kubectl apply -f manifests/deployment-replace-01.yaml`

**Step 3:** Get the pods according to the label, `type: example_code`:

`kubectl get pods -l type=example_code`

**Step 4:** Inspect the deployment's manifest file for the update:

`cat manifests/deployment-replace-02.yaml`

Notice there is new data applied to the environment variable, `COLOR_ECHO_COLOR`

**Step 5:** Run `apply` on the deployment again:

`kubectl apply -f manifests/deployment-replace-02.yaml`

**Step 6:** Take a look at what's going on:

`kubectl get pods -l type=example_code`

Notice that the legacy containers are removed as the deployment continues.

**Step 7:** Clean up

`kubectl delete all --all`
