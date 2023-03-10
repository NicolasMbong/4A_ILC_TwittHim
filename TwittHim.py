from flask import Flask 
import sys
import csv # bibliothèque pour éditer et lire les fichiers csv
import datetime # bibliothèque pour utiliser la date et l'heure
import hashlib # bibliothèque pour utiliser le hachage sha256

app = Flask(__name__)
