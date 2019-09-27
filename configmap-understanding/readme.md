# Understanding Kubernetes ConfigMaps

The purpose of this lab is to present the various ways of creating a `ConfigMap`. These ways are:

* Create a `ConfigMap` from using data in all files in a directory
* Create a `ConfigMap` from using data in all specific file
* Create a `ConfigMap` directly on the command line in an imperative manner

## Creating a config map from files in a directory

In the scenario we'll create a `ConfigMap` that uses data from all the files
stored in a particular directory.

**Step 1:** Take a look at the contents of the files, `game-config/game.properties` and
`game-config/ui.properties`

`cat game-configs/game.properties`

You will see output as follows:

```text
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
```
`cat game-configs/ui.properties`


You will see output as follows:

```text
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```
Keep the contents of each of these files in mind.

**Step 2:** Create a `ConfigMap` by entering the following command at the command line:

`kubectl create configmap game-config --from-file=game-configs`

**WHERE**

* `kubectl create configmap` is the command set that indicates a `ConfigMap` is to be created
* `--from-file=game-configs` is the option that indicates that the `ConfigMap` is to be created using the files that
are in the directory, `game-configs`.

**Step 3:** Get a listing of the, `ConfigMap`, `game-config`.

`kubectl get configmap game-config -o yaml`

You will see output as follows:
```yaml
apiVersion: v1
data:
  game.properties: |-
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
  ui.properties: |-
    color.good=purple
    color.bad=yellow
    allow.textmode=true
    how.nice.to.look=fairlyNice
kind: ConfigMap
metadata:
  creationTimestamp: "2019-09-27T05:18:12Z"
  name: game-config
  namespace: default
  resourceVersion: "13048"
  selfLink: /api/v1/namespaces/default/configmaps/game-config
  uid: 33d1e36e-e0e6-11e9-94da-0242ac110008
```
## Creating a config map from particular files

**Step 1:** Let's tale a look at the two files of interest.

`cat payroll/calendar.properties`

You will see output as follows:
```text
first_day_of_week=Monday
leap_year_month=Februarymaster
```

`cat weather/temperature.properties`

You will see output as follows:
```text
minimum_temp=70
maximum_temp=100master
```

**Step 2:** Create a `ConfigMap` using the `--from-file` option to identify the exact file to use. In this case
we'll be identifying two files, `payroll/calendar.properties` and  `weather/temperature.properties`.

`kubectl create configmap administrivia --from-file=payroll/calendar.properties --from-file=weather/temperature.properties`

**WHERE**

* `kubectl create configmap administrivia` is the command set to create a `ConfigMap` named, `administrivia`.
* `--from-file=payroll/calendar.properties` indicates the first file that has data from the `ConfigMap`
* `--from-file=weather/temperature.properties` indicates the second file that has data from the `ConfigMap`

**Step 3:** Get a listing of all `ConfigMap` resources in the `default` namespace.

`kubectl get configmap -n default`

**WHERE**

* `kubectl get configmap` is the command set to get the a configmap
* `-n` is the option that indicates to get the configmaps in the namespace, `default`

You will see output similar to the following:
```text
NAME            DATA   AGE
administrivia   2      99s
game-config     2      12m
```

**Step 4:** Let's take a look at the details of the, `ConfigMap`, `administrivia`.

`kubectl describe configmap administrivia`

You will see output as follows:
```yaml
apiVersion: v1
items:
- apiVersion: v1
  data:
    calendar.properties: |-
      first_day_of_week=Monday
      leap_year_month=February
    temperature.properties: |-
      minimum_temp=70
      maximum_temp=100
  kind: ConfigMap
  metadata:
    creationTimestamp: "2019-09-27T05:28:56Z"
    name: administrivia
    namespace: default
    resourceVersion: "14076"
    selfLink: /api/v1/namespaces/default/configmaps/administrivia
    uid: b3ba9cca-e0e7-11e9-94da-0242ac110008
- apiVersion: v1
  data:
    game.properties: |-
      enemies=aliens
      lives=3
      enemies.cheat=true
      enemies.cheat.level=noGoodRotten
      secret.code.passphrase=UUDDLRLRBABAS
      secret.code.allowed=true
      secret.code.lives=30
    ui.properties: |-
      color.good=purple
      color.bad=yellow
      allow.textmode=true
      how.nice.to.look=fairlyNice
  kind: ConfigMap
  metadata:
    creationTimestamp: "2019-09-27T05:18:12Z"
    name: game-config
    namespace: default
    resourceVersion: "13048"
    selfLink: /api/v1/namespaces/default/configmaps/game-config
    uid: 33d1e36e-e0e6-11e9-94da-0242ac110008
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
master $ kubectl describe configmap administrivia
Name:         administrivia
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
calendar.properties:
----
first_day_of_week=Monday
leap_year_month=February
temperature.properties:
----
minimum_temp=70
maximum_temp=100
Events:  <none>
```

## Creating a config map from a literal

In this scenario we're going to create the `ConfigMap` by declaring its information right the command line.

**Step 1:** Create a `ConfigMap` using the `--from-literal` option.

`kubectl create configmap meal-preference --from-literal=favorite.breakfast=eggs --from-literal=favorite.lunch=salad --from-literal=favorite.dinner=pizza`

**WHERE**

* `kubectl create configmap meal-preference` is the command set to create a `ConfigMap` named, ` meal-preference`.
* `--from-literal=favorite.breakfast=eggs` is a literal key-value pair to assign to the `ConfigMap`, `meal-preference`
* `--from-literal=favorite.lunch=salad` is a literal key-value pair to assign to the `ConfigMap`, `meal-preference`
* `--from-literal=favorite.dinner=pizza` is a literal key-value pair to assign to the `ConfigMap`, `meal-preference`

**Step 2:** Let's take a look at the details of the, `ConfigMap`, `meal-preference`.

`kubectl get configmap meal-preference -o yaml`

You will see output as follows:
```yaml
apiVersion: v1
data:
  favorite.breakfast: eggs
  favorite.dinner: pizza
  favorite.lunch: salad
kind: ConfigMap
metadata:
  creationTimestamp: "2019-09-27T05:37:27Z"
  name: meal-preference
  namespace: default
  resourceVersion: "14877"
  selfLink: /api/v1/namespaces/default/configmaps/meal-preference
  uid: e4111ad0-e0e8-11e9-94da-0242ac110008
```

By doing this lab you've had the hands on experience create configmaps using the following techniques:

* Creating a `ConfigMap` from using data in all files in a directory
* Creating a `ConfigMap` from using data in all specific file
* Creating a `ConfigMap` directly on the command line in an imperative manner


And viewing the results

**Lab Complete!**