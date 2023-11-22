import os

import numpy as np
import torch
import logging
import cv2
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)


class SamPredictor:

    def __init__(self, home):
        self.home = home
        torch.cuda.empty_cache()
        cuda_available = torch.cuda.is_available()
        print("CUDA available:", cuda_available)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.checkpoint_path = os.path.join(os.path.dirname(__file__), "home", "weights", "sam_vit_h_4b8939.pth")
        self.model_type = "vit_h"

        if not os.path.isfile(self.checkpoint_path):
            raise FileNotFoundError(f"Checkpoint file not found at {self.checkpoint_path}")

        logger.debug(f"Using device {self.device}")

    def predict(self, image_bgr):

        sam = sam_model_registry[self.model_type](checkpoint=self.checkpoint_path).to(device=self.device)
        mask_generator = SamAutomaticMaskGenerator(sam)
        sam_result = mask_generator.generate(image_bgr)

        # Process the result
        if isinstance(sam_result, list) and all(isinstance(item, dict) for item in sam_result):
            result_keys = list(sam_result[0].keys())

            return {'result_keys': result_keys}
        else:
            logging.error("The result from the mask generator is not in the expected format.")
            return None
