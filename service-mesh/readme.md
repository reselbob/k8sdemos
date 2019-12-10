# Working with an Istio Service Mesh

The purpose of this exercise is to demonstrate how to use Kubernetes/Istio resources ingress and egress to control inbound and outbound traffic.

This exercise assumes that you have a publicly accessible Kubernetes Cluster up and running and
that [Istio](https://istio.io/docs/concepts/what-is-istio/) running is the cluster.


**Step 1:** `ssh` into or access a command line shell into a environment that has access to your Kubernetes
cluster.

**Step 2:** Clone the source code for this exercise into the environment

`git clone https://github.com/reselbob/k8sdemos.git` 

**Step 3:** Navigate to the directory that has the source code for this exercise.

`cd k8sdemos/service-mesh`

**Step 4:** To configure Istio to inject a sidecar when created in the `default` namespace,
execute the following command:

`kubectl label namespace default istio-injection=enabled`

**Step 5:** Install Istio-ized Multi-deployment Application. To create the deployments for the Istio-ized Multi-deployment Application, execute
the following command

`kubectl apply -f manifests/deployments.yaml`

**Step 6:** To create the services for the Istio-ized Multi-deployment Application, execute
the following command

`kubectl apply -f manifests/services.yaml`

**Step 7:** Allow Access to the Istio-ized Multi-deployment Application. Find the IP address of `istio-ingressgateway`.

`kubectl get svc -n istio-system | grep istio-ingressgateway`

Save the pubic IP address of `istio-ingressgateway`. You'll need it

**Step 8:** Enter the public IP address of `istio-ingressgateway` into the address bar of your computer's browser.

You should get an error, an "Unable to find web site" error.

**Step 9:** Bind the ingress rule to Istio to allow access to the application.

`kubectl apply -f manifests/ingress.yaml`

Call the IP addess from the web page

You'll get output similar to the following:

```text
frontend-prod - 0.134secs
http://business/ -> business-prod - 0.123secs
http://worldclockapi.com/api/json/utc/now -> {"$id":"1","currentDateTime":"2019-06-02T03:14Z","utcOffset":"00:00:00","isDayLightSavingsTime":false,"dayOfTheWeek":"Sunday","timeZoneName":"UTC","currentFileTime":132039188544212367,"ordinalDate":"2019-153","serviceResponse":null}
```

**Step 10:** Make Isito restrict all outbuond traffic, except for URLs and ports explicitily declaried

`kubectl get configmap istio -n istio-system -o yaml | sed 's/mode: ALLOW_ANY/mode: REGISTRY_ONLY/g' | kubectl replace -n istio-system -f -`

Call the IP addess from the web page

```
frontend-prod - 0.019secs
http://business/ -> business-prod - 0.012secs
http://worldclockapi.com/api/json/utc/now -> StatusCodeError: 502 - ""
```

**Step 11:**  Apply the egress to allow access to `worldclockapi.com`.

`kubectl apply -f manifests/egress.yaml`

Call the IP addess from the web page

```text
frontend-prod - 0.134secs
http://business/ -> business-prod - 0.123secs
http://worldclockapi.com/api/json/utc/now -> {"$id":"1","currentDateTime":"2019-06-02T03:14Z","utcOffset":"00:00:00","isDayLightSavingsTime":false,"dayOfTheWeek":"Sunday","timeZoneName":"UTC","currentFileTime":132039188544212367,"ordinalDate":"2019-153","serviceResponse":null}
```

Call the website at the public IP address of `istio-ingressgateway`. All should be well.

## Discussion of Istio Components

![Istio Architecture](https://cdn-images-1.medium.com/max/1600/1*8gH0GAnncEE6VUIbwnGUww.png)

**Envoy** is the proxy between that handles network traffic.

**Pilot** , the core traffic management component. Pilot takes the rules for traffic behavior provided by the control plane,
and converts them into configurations applied by Envoy, based on how such things are managed locally. Pilot allows Istio to work with different
orchestration systems besides Kubernetes, but behave consistently between them.

**Mixer** takes responsibility for interfacing with the backend systems. Instead of having application code integrate with specific backends, the app code instead does a integration with Mixer.

**Citadel** controls authentication and identity management between services.
