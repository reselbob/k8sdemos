# Secrets

**Step 1:** Look at the secret to get familiar with it:

`cat manifests/simple-secret.yaml`

**Step 2:** Apply the secret:

`kubectl apply -f manifests/simple-secret.yaml`

**Step 3:** Create a pod the uses the secret:

`kubectl apply -f manifests/secret-pod.yaml`

**Step 4:** Go find the pod:

`kubectl get pods`

**Step 5:** See if the secret "stuck"

`kubectl exec -it <POD_NAME> -- printenv`
