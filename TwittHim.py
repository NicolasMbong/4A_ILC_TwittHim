from flask import Flask, request, render_template
import sys
import datetime # bibliothèque pour utiliser la date et l'heure
import redis

app = Flask(__name__)
db = redis.Redis()

class User:
    def __init__(self, username):
        self._username = username
        self._tweets = []

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



###############################REDIS#####################################
# key=timestamp, value=’{“author”: “username”, “tweet”: ”message”}’
# key=username, value=[timestamp_1, timestamp_2, timestamp_3]





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
def addUser(name):
    if name in User._users:
        return "This user name is already used"
    else:
        new = User(name)
        print("The user has been added successfully")
        return new
        
@app.route("/addTweet/<string:user>", methods=['POST'])
def addTweet(user):
    text = request.form['text']
    topic = request.form['topic']
    tweet=[text,topic,tweet_id]
    for u in User._users.values():
        if u.getUsername() == user:
            u.addTweet(tweet)
    Tweets.append(tweet)
    if isTopicIn(topic):
        Topics.append(topic)
    tweet_id += 1
    return "Tweet added successfully"

@app.route("/showUserTweets/<string:user>", methods=['GET'])
def showUserTweets(user):
    if user not in User._users:
        return "User not found"
    else:
        Utweets = User._users[user].getTweets()
        for tweet in Utweets:
            print(tweet)
        return ""


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

if __name__ == "__main__":
    app.run()