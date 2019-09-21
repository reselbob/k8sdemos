kubectl create configmap game-config --from-file=game-configs

kubectl get configmaps game-config -o yaml

kubectl create configmap game-config-2 --from-file=game-configs/game.properties --from-file=game-configs/ui.properties

kubectl get configmaps game-config-2 -o yaml

kubectl create configmap game-config-3 --from-literal=game.type=football

kubectl get configmaps game-config-3 -o yaml