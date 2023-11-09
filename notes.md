# nodemon
```
npm install -g nodemon
```
Pour l'erreur :
nodemon : Impossible de charger le fichier C:\Users\s_ali\AppData\Roaming\npm\nodemon.ps1, car 
l’exécution de scripts est désactivée sur ce système.

faire dans un cmd en tant qu'admin :
```
cmd.exe /c powershell -command Set-ExecutionPolicy RemoteSigned
```
Puis : 
```
nodemon index
```

# debug node js
menu vertical gauche debug avec vs code

générer un launch.json

dans package.json 
```
    "debug": "nodemon --inspect index.cjs"
```
