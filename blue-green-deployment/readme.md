kubectl apply -f deployment-blue.yaml
kubectl apply -f deployment-green.yaml

kubectl get pods -l type=example_code
kubectl get pods -l type=example_code  -l color=blue
kubectl get pods -l type=example_code  -l color=green

kubectl apply -f service_blue.yaml

kubectl get services  --all-namespaces --field-selector metadata.name=echocolor

for i in {1..10}; do curl localhost:<NODE_PORT>; done

kubectl apply -f service_green.yaml

kubectl get services  --all-namespaces --field-selector metadata.name=echocolor

for i in {1..10}; do curl localhost:<NODE_PORT>; done

kubectl apply -f service_final.yaml

kubectl get services  --all-namespaces --field-selector metadata.name=echocolor

for i in {1..10}; do curl localhost:<NODE_PORT>; done

kubectl delete -f deployment-green.yaml

kubectl delete all --all
