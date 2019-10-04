# Wordstream

The purpose of this project is to demonstrate asynchronous message consumption in a high-scale, multi-consumer architecture against a
high speed message consumer.

Wordstream emits random words from a `redis` producer, 1 word every second. The words are processed by an array of consumers that
can be scaled up or down according the the Kubernetes deployment that you can view [here](kubernetes/manifests/wordstream-deployment.yaml).

**Step 1:** Use the Katacoda `minikube` playground

`https://katacoda.com/javajon/courses/kubernetes-fundamentals/minikube`

**Step 2:** Once in the Katacoda interactive VM, clone down the code from the GitHub repository

`git clone https://github.com/reselbob/k8sdemos/`

**Step 3:** Navigate to the project directory

`cd k8sdemos/wordstream`

**Step 4:** Generate the local Docker registry and populate it with the `redis` container image
as well as the custom application images related to the `Wordstream` application.

`sh docker-seed.sh`

You can view the contents of `docker-seed.sh` [here](docker-seed.sh).

Please be advised that the `docker-seed.sh` creates a local Docker registry right on Minikube. When the process completes
you get a readout of the contents of the local registry like so:

`{"repositories":["wordstream-consumer","wordstream-producer"]}`

**Step 5:** Navigate to the project's `kubernetes` directory

`cd kubernetes`

**Step 6:** Execute the script the creates the Kubernetes deployments and services.

`sh generate-k8s-resources.sh`

You'll get output like so:

```text
deployment.apps/redis-master created
deployment.extensions/wordstream-producer created
deployment.extensions/wordstream-consumer created
service/redis-master created
service/wordstream-producer created
service/wordstream-consumer created
```

**Step 7:** Check to make sure the pods are running. (It might take a minute or two for things
to "warm up".)

`kubectl get pods`

You'll get output similar to the following:

```text
redis-master-7b44998456-vvqpr          1/1     Running   0          3m48s
wordstream-consumer-8949dc744-8q4c9    1/1     Running   2          3m48s
wordstream-consumer-8949dc744-pjn6g    1/1     Running   2          3m48s
wordstream-consumer-8949dc744-scn6k    1/1     Running   2          3m48s
wordstream-producer-6f4cbcbc86-nc4qv   1/1     Running   2          3m48s
```

**Step 8:** Take a look at the behavior the consumers by getting a running list of the log
entries using the following `kubectl  logs` command.

`kubectl  logs -l app=wordstream-consumer -f`

You'll get output similar to the following:

```text
{"consumerId":"7c2b0f82-4024-4f24-8f4c-9247f29aaa7c","stream":[["WORDSTREAM",[["1570169458220-0",["Word","SQL :Fri Oct 04 2019 06:10:58 GMT+0000 (UTC)"]]]]]}
{"consumerId":"1d013e17-7eda-4d2e-8deb-6e6d94c5bb7a","stream":null}
{"consumerId":"d8ede603-62a1-4e67-acb9-c3b159b3c5f1","stream":null}
{"consumerId":"7c2b0f82-4024-4f24-8f4c-9247f29aaa7c","stream":[["WORDSTREAM",[["1570169459222-0",["Word","override : Fri Oct 04 2019 06:10:59 GMT+0000 (UTC)"]]]]]}
{"consumerId":"1d013e17-7eda-4d2e-8deb-6e6d94c5bb7a","stream":null}
{"consumerId":"d8ede603-62a1-4e67-acb9-c3b159b3c5f1","stream":null}
{"consumerId":"7c2b0f82-4024-4f24-8f4c-9247f29aaa7c","stream":[["WORDSTREAM",[["1570169460225-0",["Word","rich : Fri Oct 04 2019 06:11:00 GMT+0000 (UTC)"]]]]]}
{"consumerId":"1d013e17-7eda-4d2e-8deb-6e6d94c5bb7a","stream":null}
{"consumerId":"d8ede603-62a1-4e67-acb9-c3b159b3c5f1","stream":null}
{"consumerId":"7c2b0f82-4024-4f24-8f4c-9247f29aaa7c","stream":[["WORDSTREAM",[["1570169461226-0",["Word","Maine: Fri Oct 04 2019 06:11:01 GMT+0000 (UTC)"]]]]]}
{"consumerId":"1d013e17-7eda-4d2e-8deb-6e6d94c5bb7a","stream":null}
{"consumerId":"d8ede603-62a1-4e67-acb9-c3b159b3c5f1","stream":null}
{"consumerId":"7c2b0f82-4024-4f24-8f4c-9247f29aaa7c","stream":[["WORDSTREAM",[["1570169462227-0",["Word","Cambridgeshire : Fri Oct 04 2019 06:11:02 GMT+0000 (UTC)"]]]]]}
{"consumerId":"1d013e17-7eda-4d2e-8deb-6e6d94c5bb7a","stream":null}
{"consumerId":"d8ede603-62a1-4e67-acb9-c3b159b3c5f1","stream":null}
{"consumerId":"7c2b0f82-4024-4f24-8f4c-9247f29aaa7c","stream":[["WORDSTREAM",[["1570169463229-0",["Word","Dynamic : Fri Oct 04 2019 06:11:03 GMT+0000 (UTC)"]]]]]}
{"consumerId":"1d013e17-7eda-4d2e-8deb-6e6d94c5bb7a","stream":null}
```
Notice that in this case there are three UUIDs in play that reflect the id of each consumer.

* `1d013e17-7eda-4d2e-8deb-6e6d94c5bb7a`
* `7c2b0f82-4024-4f24-8f4c-9247f29aaa7c`
* `d8ede603-62a1-4e67-acb9-c3b159b3c5f1`

**Step 9:** 

If you want to experiment, go into the file, [kubernetes/manifests/wordstream-deployments.yaml](kubernetes/manifests/wordstream-deployment.yaml)
and scale up number of pods running in the wordstream-consumer deployment to 10 by modifying the manifest like so:

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: wordstream-consumer
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 10%
  template:
    metadata:
      labels:
        app: wordstream-consumer
    spec:
      containers:
        - name: wordstream-consumer
          image: localhost:5000/wordstream-consumer
          ports:
            - containerPort: 3000
          env:
            - name: REDIS_HOST
              value: "redis-master"
            - name: REDIS_PORT
              value: "6379"
            - name: REDIS_PWD
              value: "none"
```

Execute the command, `kubectl get pods` to observe the pod replenishment behavior.