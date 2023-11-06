from app import app
from flask import render_template
import os
from app.models.SamPredictor import SamPredictor


@app.route('/predict')
def predict():
    # Project directory path
    home = os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # This will point to the root of your project

    predictor = SamPredictor(home)
    result = predictor.predict()
    image_path = predictor.predict()

    return render_template('render.html', image_path='static/masked_image.jpg')
