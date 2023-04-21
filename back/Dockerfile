FROM python:3.18

RUN pip install redis \
    pip install Flask \
    pip install flask-cors

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

CMD [ "flask", "run"]
