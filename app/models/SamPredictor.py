import os

import numpy as np
import torch
import logging
import cv2
import supervision as sv
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)


class SamPredictor:

    def __init__(self, home):
        self.home = home
        cuda_available = torch.cuda.is_available()
        print("CUDA available:", cuda_available)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.checkpoint_path = os.path.join(os.path.dirname(__file__), "home", "weights", "sam_vit_h_4b8939.pth")
        self.model_type = "vit_h"

        # Check if the checkpoint file exists
        if not os.path.isfile(self.checkpoint_path):
            raise FileNotFoundError(f"Checkpoint file not found at {self.checkpoint_path}")

        logger.debug(f"Using device {self.device}")

    def generate_annotated_image(self, sam_result, image_bgr, output_path):
        mask_annotator = sv.MaskAnnotator(color_lookup=sv.ColorLookup.INDEX)
        detections = sv.Detections.from_sam(sam_result=sam_result)
        annotated_image = mask_annotator.annotate(scene=image_bgr.copy(), detections=detections)

        # Save the annotated image
        sv.plot_images_grid(
            images=[image_bgr, annotated_image],
            grid_size=(1, 2),
            titles=[output_path, annotated_image]
        )

    def predict(self):
        # Load the SAM model and generate predictions
        sam = sam_model_registry[self.model_type](checkpoint=self.checkpoint_path).to(device=self.device)
        mask_generator = SamAutomaticMaskGenerator(sam)
        image_path = os.path.join(os.path.dirname(__file__), "home", "assets", "living-room-1.jpg")   # Corrected path using self.home

        # Check if the image file exists
        if not os.path.isfile(image_path):
            raise FileNotFoundError(f"Image file not found at {image_path}")

        # Read and process the image
        image_bgr = cv2.imread(image_path)
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

        # Generate masks using SAM
        sam_result = mask_generator.generate(image_rgb)

        # Check and convert the result to a serializable format if necessary
        if isinstance(sam_result, list) and all(isinstance(item, dict) for item in sam_result):
            # Convert any ndarray items to lists for JSON serialization
            for mask in sam_result:
                for key, value in mask.items():
                    if isinstance(value, np.ndarray):
                        mask[key] = value.tolist()  # Convert the numpy array to a list

            # Here you would generate the annotated image, but you need to decide where to save it
            # For example, let's assume you have a 'static' directory in 'self.home' to store images
            output_path = os.path.join(self.home, "static", "annotated_image.jpg")
            self.generate_annotated_image(sam_result, image_bgr, output_path)

            return sam_result
        else:
            logging.error("The result from the mask generator is not in the expected format.")
            return None

    def get_image(self):
        image_path = os.path.join(self.home, "assets", "living-room-1.jpg")  # or whatever your image path is
        if not os.path.isfile(image_path):
            raise FileNotFoundError(f"Image file not found at {image_path}")
        image_bgr = cv2.imread(image_path)
        return image_bgr

