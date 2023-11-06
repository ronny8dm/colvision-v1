from flask import jsonify, url_for
from app import app
import os
from app.models.SamPredictor import SamPredictor
import logging


@app.route('/predict')
def predict():
    home = os.path.abspath(os.path.join(__file__, "../../.."))

    predictor = SamPredictor(home)
    masks = predictor.predict()

    logging.debug(f"Type of masks: {type(masks)}")
    logging.debug(f"Content of masks: {masks}")

    if isinstance(masks, list):
        # Generate the annotated image
        static_dir = os.path.join(app.root_path, 'static')
        filename = 'annotated_image.jpg'
        output_path = os.path.join(static_dir, filename)

        # Obtain the original image (you will need to implement this)
        image_bgr = predictor.get_image()

        # Save the annotated image using the new method
        predictor.generate_annotated_image(masks, image_bgr, output_path)

        # Return the URL for the generated image
        return jsonify({"annotated_image_url": url_for('static', filename=filename)})
    else:
        return jsonify({"error": "Predictor did not return a list of dictionaries"}), 400
