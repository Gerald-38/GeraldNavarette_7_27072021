# GeraldNavarette_7_27072021

Formation Développeur Web Openclassrooms. Projet 7 Groupomania - Création d'un réseau social d'entreprise.


### Compétences évaluées : ### 

Personnaliser le contenu envoyé à un client web

Authentifier un utilisateur et maintenir sa session

Gérer un stockage de données à l'aide de SQL

Implémenter un stockage de données sécurisé en utilisant SQL

### Technologies utilisées :

- HTML
- CSS / SCSS
- JS
- NodeJS - ExpressJS
- API REST
- VUEJS
- MySQL


## Installation

### Mise en place de la base de données

Cloner le projet

Dans mySQLServer, importer le fichier SQL :
```
/database/GroupomaniaDataBase.sql
```

A la racine du dossier back-end, créer un fichier .env.
Y ajouter ces éléments 
```
DB_HOST = "localhost"
DB_USER = [votre comte mysql]
DB_PASSWORD = [votre mot de passe mysql]
DB_DATABASE = "groupomaniadatabase"
DB_TOKEN = "RANDOM_TOKEN_SECRET"
```
----------

### Installation du back end - depuis la racine du projet
```
cd back-end
```

```
npm install
```
Démarrage du serveur
```
nodemon server
```
### Installation du front end - depuis la racine du projet (nécéssite Vue.cli)
```
cd front-end
```
Si nécéssaire
```
npm install -g @vue/cli
```
puis
```
npm install
```
Démarrage du front end
```
npm run serve
```

### Accès à l'application depuis un navigateur
```
http://localhost:8080/
```

### Connexion au compte d'aministration du réseau social

- Entrer l'adresse mail : service_comm@groupomania.fr
- Entrer le mot de passe provisoire : Azerty2
- Modifier le mot de passe dans le profil utilisateur

