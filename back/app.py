from flask import Flask, request
import datetime
import redis

app = Flask(__name__)
db = redis.Redis()

class User:
    def __init__(self, username):
        self._username = username
        self._tweets = []

    def getUsername(self):
        return self._username

    def addTweet(self, tweet):
        self._tweets.append(tweet)

    def getTweets(self):
        return self._tweets


@app.route("/", methods=["GET"])
def showAllTweets():
    tweets = []
    for tweet in db.scan_iter("tweet:*"):
        tweets.append(db.hgetall(tweet))
    return str(tweets)


@app.route("/addUser/<string:name>", methods=["POST","POST"])
def addUser(name):
    if db.hexists("users", name):
        return "This user name is already used"
    else:
        new = User(name)
        db.hset("users", name, "")
        return "The user has been added successfully"


@app.route("/addTweet/<string:user>", methods=["POST"])
def addTweet(user):
    text = request.form.get("text")
    topic = request.form.get("topic")
    timestamp = datetime.datetime.now().timestamp()
    tweet_id = db.incr("tweet_id")
    tweet = {"author": user, "text": text, "topic": topic, "timestamp": timestamp}
    db.hset(f"tweet:{tweet_id}", mapping=tweet)
    db.rpush(f"user_tweets:{user}", f"{timestamp}:{tweet_id}")
    if not db.sismember("topics", topic):
        db.sadd("topics", topic)
    return "The tweet has been added successfully"


@app.route("/showUserTweets/<string:user>", methods=["GET"])
def showUserTweets(user):
    tweets = []
    for user_tweet in db.lrange(f"user_tweets:{user}", 0, -1):
        timestamp, tweet_id = user_tweet.decode().split(":")
        tweet = db.hgetall(f"tweet:{tweet_id}")
        tweets.append(tweet)
    return str(tweets)


@app.route("/showTopic/<string:topic>", methods=["GET"])
def showTopic(topic):
    tweets = []
    for tweet in db.scan_iter("tweet:*"):
        tweet = db.hgetall(tweet)
        if tweet[b"topic"].decode() == topic:
            tweets.append(tweet)
    return str(tweets)


@app.route("/reTweet/<int:tweet_id>/<string:user>", methods=["POST"])
def reTweet(tweet_id, user):
    tweet = db.hgetall(f"tweet:{tweet_id}")
    if not tweet:
        return "The tweet does not exist"
    timestamp = datetime.datetime.now().timestamp()
    db.rpush(f"user_tweets:{user}", f"{timestamp}:{tweet_id}")
    return "The tweet has been retweeted successfully"


if __name__ == "__main__":
    app.run()
