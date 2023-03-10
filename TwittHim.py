# from flask import Flask 
import sys
import csv # bibliothèque pour éditer et lire les fichiers csv
import datetime # bibliothèque pour utiliser la date et l'heure
import hashlib # bibliothèque pour utiliser le hachage sha256

# app = Flask(__name__)


class User:
    _id = 0
    _username = ""
    _userTweets = []

    def __init__(self, username):
        self._id += 1
        self._username = username

# getters
    def getId(self):
        return self._id

    def getUsername(self):
        return self._nom

    def getTweets(self):
        return self._userTweets
    
# setters
    def addTweet(self, tweet):
        self._userTweets.append(tweet)

Users=[]
Tweets=[]

@app.route("/", methods=['GET'])
def showAllTweets():
    for i in range(0,len(Tweets)):
        print(Tweets[i])

@app.route("/addUser/<string:name>", methods=['POST'])
def addUser(name):
    for i in range(0,len(Users)):
        if Users[i]==name:
            return "This user name is already used"
        else:
            new = User(name)
            print("The user have been added succesfully")
            Users.append(new)
            return new
        
@app.route("/addTweet/<string:user>", methods=['POST'])
def addTweet(user):
    text = input('Write down your thought:\n')
    subject = input('What is your tweet about?\n')
    tweet=[text,subject]
    for i in range (0,len(Users)):
        if Users[i]==user:
            Users[i].addTweet(tweet)

    Tweets.append(tweet)






admin = User('Nicolas')
Users.append(admin)
addTweet(admin)
showAllTweets()