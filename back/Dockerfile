FROM ubuntu:16.04

RUN apt-get update -y && \
    apt-get install -y python-pip python-dev && \
    pip install redis
    pip install Flask
    
CMD [ "export", "FLASK_APP=app.py" ]
CMD [ "export", "FLASK_ENV=development" ]
CMD [ "flask", "run"]
