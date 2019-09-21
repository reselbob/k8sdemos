kubectl apply -f deployment-red.yaml
kubectl apply -f deployment-green.yaml

kubectl get pods -l type=example_code
kubectl get pods -l type=example_code  -l color=red
kubectl get pods -l type=example_code  -l color=green

kubectl apply -f service_01.yaml
kubectl apply -f service_02.yaml
kubectl apply -f service_03.yaml

kubectl get services  --all-namespaces --field-selector metadata.name=echocolor-all

for i in {1..10}; do curl localhost:<NODE_PORT>; done

kubectl get services  --all-namespaces --field-selector metadata.name=echocolor-red

for i in {1..10}; do curl localhost:<NODE_PORT>; done

kubectl get services  --all-namespaces --field-selector metadata.name=echocolor-green

for i in {1..10}; do curl localhost:<NODE_PORT>; done

kubectl delete -f deployment-red.yaml

kubectl get services  --all-namespaces --field-selector metadata.name=echocolor-all

kubectl delete all --all
