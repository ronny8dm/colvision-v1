import os
import torch
import logging
import cv2
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
        self.output_path = os.path.join(home, 'static', 'masked_image.jpg')

        # Check if the checkpoint file exists
        if not os.path.isfile(self.checkpoint_path):
            raise FileNotFoundError(f"Checkpoint file not found at {self.checkpoint_path}")

        logger.debug(f"Using device {self.device}")

    def predict(self):
        sam = sam_model_registry[self.model_type](checkpoint=self.checkpoint_path).to(device=self.device)
        mask_generator = SamAutomaticMaskGenerator(sam)

        image_path = os.path.join(os.path.dirname(__file__), "home", "assets", "living-room-1.jpg")  # Add your image extension

        # Check if the image file exists
        if not os.path.isfile(image_path):
            raise FileNotFoundError(f"Image file not found at {image_path}")

        image_bgr = cv2.imread(image_path)
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
        sam_result = mask_generator.generate(image_rgb)

        masked_image = image_rgb * sam_result[0]['segmentation'][None, :, :, None]
        cv2.imwrite(self.output_path, masked_image)
        return self.output_path
