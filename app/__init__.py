from flask import Flask

app = Flask(__name__)

from app.routes import home_route, predictor_route
