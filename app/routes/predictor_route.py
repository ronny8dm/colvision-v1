from flask import request, jsonify
from app import app
from app.models.SamPredictor import SamPredictor
import os
import cv2
import numpy as np


@app.route('/predict', methods=['POST'])
def predict():
    home = os.path.abspath(os.path.join(__file__, "../../.."))
    predictor = SamPredictor(home)

    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']

    filestr = file.read()
    npimg = np.frombuffer(filestr, np.uint8)
    image_bgr = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    masks = predictor.predict(image_bgr)

    if isinstance(masks, dict):
        return jsonify(masks)
    else:
        return jsonify({"error": "Predictor did not return a list of dictionaries"}), 400
