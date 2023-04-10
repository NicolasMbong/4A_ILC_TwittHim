Cette partie du projet est le backend qui fournit une API  Flask RESTful pour la gestion des utilisateurs et des tweets. elle est écrit en Python et utilise redis pour stocker la base de données.

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)

##API
Le backend fournit les API suivantes pour la gestion des utilisateurs et des tweets:

GET /showAllTweets affiche la liste de tout les tweets.
POST /addUser/name ajoute un nouvel utilisateur.
GET /showUserTweets/User récupère la liste de tous les tweets de l'utilisateur spécifié.
POST /addTweet/User ajoute un nouveau tweet pour l'utilisateur spécifié.
GET /showTopic/Topic récupère la liste de tous les tweets pour le sujet spécifié.
POST /reTweet/tweet_id/User permet à un utilisateur de retweeter.
