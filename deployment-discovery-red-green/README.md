# Deployment Discovery Under Kubernetes

The purpose of this lab is to demonstrate how to have a service bind between alternate deployments

## Application Source Code

```javascript
const http = require('http');

const port = process.env.PORT|| 3000;
const color  = process.env.COLOR_ECHO_COLOR || "NO_COLOR";

const handleRequest = function(request, response) {
    const str = JSON.stringify({color, date: new Date()}, null, 4);
    response.writeHead(200);
    response.end(str);
    console.log(str);
};

const server = http.createServer(handleRequest);
server.listen(port, ()=>{
    console.log(`Listening on port ${port}, started at : ${new Date()}`);
});
```

## Lab Instructions

**Step 1:** Go to the `kubernetes` playground in Katacoda:

`https://katacoda.com/courses/kubernetes/playground`

**Step 2:** Clone this GitHub Repository

`git clone https://github.com/reselbob/innosoft.git`

Go the `manifests` directory of the project. The `manifests` directory contains all the `yaml` files
we'll need to set up Red and Green deployments as well as the Kubernetes service that will bind to each accordingly.

**Step 3:** To go the `manifests` directory execute the following command:

`cd innosoft/microservices-architecture/03-deployment-discovery-red-green/manifests`

## Set up the Red and Green Deployments

**Step 4:** Execute the following command to execute the Red deployment in your Kubernetes cluster

`kubectl apply -f red-deployment.yaml`

**Step 5:** Execute the following command to execute the Green deployment in your Kubernetes cluster

`kubectl apply -f green-deployment.yaml`

## Set up the Kubernetes service

**Step 6:** Execute the following command to execute the service in your Kubernetes cluster

`kubectl apply -f service.yaml`

## Confirm installation of Deployments and Service

**Step 7:** Execute the following command to confirm that the service is running under Kubernetes

`kubectl get services | grep echocolor`

**Step 8:** Execute the following command to confirm that the deployments are running under Kubernetes

`kubectl get pods | grep echocolor`


## Find the NodePort IP address

**Step 9:** To get the NodePort IP, execute teh following command

`kubectl get services |grep NodePort`

**Step 10:** Get the master NodeIP address

`kubectl cluster-info`

**Step 11:** Call the service using `http`

`curl http://<MASTER_IP>:<NODE_PORT_IP>`

You should see similar output as follows:

```json
{
    "color": "RED",
    "date": "2019-07-23T04:07:15.857Z"
}
```

**Step 12** Changed the `service.yaml` manifest to look for pods that have the select, `color:green`.

This is the current version of `service.yaml`. Notice the entry, `color:red`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: echocolor
spec:
  selector:
    app: echocolor
    color: red
  ports:
  -
    protocol: TCP
    port: 3000
    targetPort: 3000
  type: NodePort

```

Open `service.yaml` in the `vi` editor like so:

`vi service.yaml`

Strike the key, `i` to put `vi` into insert mode.

And then make the change to `color:green` as shown below.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: echocolor
spec:
  selector:
    app: echocolor
    color: green
  ports:
  -
    protocol: TCP
    port: 3000
    targetPort: 3000
  type: NodePort

```

Strike the `esc` key to take `vi` out of edit mode.

Then strike the `:` key followed by `wq`.

Finally string the `enter` key to save the changes.

**Step 13** Now, reapply the manifest, `service.yaml` using the following command.

`kubectl apply -f service.yaml`

**Step 14** Run the `curl` command again:

`curl http://<MASTER_IP>:<NODE_PORT_IP>`

You should see similar output as follows:

```json
{
    "color": "GREEN",
    "date": "2019-07-23T04:07:15.857Z"
}
```

**Challenge** : Create and deploy a `yellow` deployment and adjust the service `echocolor` to use
the `yellow` deployment. 

**Hint:** Notice that the manifests, [red-deployment.yaml](manifests/red-deployment.yaml) and 
[green-deployment.yaml](manifests/green-deployment.yaml) use the same
container image to provide the application behavior. Maybe there's a way to adapt the content in
the deployment manifests to create the new deployment that has the "yellow" behavior and bind it to the Kubernetes service
defined in the manifest file, [service.yaml](manifests/service.yaml).

**LAB COMPLETE**


