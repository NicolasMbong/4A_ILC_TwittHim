from flask import Flask 
import sys
import datetime # bibliothèque pour utiliser la date et l'heure


app = Flask(__name__)



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
        return self._username

    def getTweets(self):
        return self._userTweets
    
# setters
    def addTweet(self, tweet):
        self._userTweets.append(tweet)

###########################STOCKAGE DE VARIABLES GLOBALES################################################

Users=[]
Tweets=[]
Topics=[]
tweet_id=0
############################FONCTIONS###############################################



@app.route("/", methods=['GET'])
def showAllTweets():                    #parcours la liste des tweets pour tous les afficher
    for i in range(0,len(Tweets)):
        print(Tweets[i])

@app.route("/addUser/<string:name>", methods=['POST'])
def addUser(name):                      #Vérifie l'unicité du nom d'utilisateur puis créer le nouvel utilisateur
    for i in range(0,len(Users)):
        if Users[i]==name:
            return "This user name is already used"
        else:
            new = User(name)
            print("The user have been added succesfully")
            Users.append(new)
            return new
        
@app.route("/addTweet/<string:user>", methods=['POST'])
def addTweet(user):                             #Demande à l'utilisateur de saisir son tweet ainsi que le sujet du tweet
    text = input('Write down your thought:\n')  #puis créer le tweet et stock les informations dans la variable Tweets et Topics
    topic = input('What is your tweet about?\n')
    tweet=[text,topic,tweet_id]
    for i in range (0,len(Users)):
        if Users[i]==user:
            Users[i].addTweet(tweet)
            tweet_id+=1
    Tweets.append(tweet)
    if isTopicIn:
        Topics.append(tweet[1])

@app.route("showUserTweets/<string:user>", methods=['GET', 'POST'])
def showUserTweets(user):
    for i in len(Users):
        if Users[i]==user:
            Utweets=Users[i].getTweets()
            for j in len(Utweets):
                print(Utweets[j])


def isTopicIn(topic):
    Bool=True
    for i in len(Topics):
        if Topics[i]==topic:
            return False


@app.route("showTopic/<string:topic>", methods=['GET'])
def showTopic(topic):
    for i in len(Tweets):
        if Tweets[i][1]==topic:
            print(Tweets[i][1])

@app.route("reTweet/<int:tweet_id>,<string:User>", methods=['GET', 'POST'])
def reTweet(tweet_id,User):
    for i in len(Tweets):
        if Tweets[i][2]==tweet_id:
            for j in len(Users):
                if Users[j]==User:
                    Users[j].addTweet(Tweets[i])



##############################VARIABLES DE TEST#############################################

admin = User('Nicolas')
Users.append(admin)
addTweet(admin)
showAllTweets()
