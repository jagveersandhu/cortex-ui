from PIL import Image
import pytesseract
import io
from fastapi import UploadFile
import logging

# ======================================================
# Explicit Tesseract binding (REQUIRED on Windows)
# ======================================================

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

logger = logging.getLogger("cortex.image")

# ======================================================
# IMAGE PARSER
# ======================================================

def parse(file: UploadFile) -> str:
    """
    Extract text from an image using Tesseract OCR.

    Supported formats:
    - png
    - jpg / jpeg
    - bmp
    - tiff
    """

    try:
        # IMPORTANT: read bytes safely
        contents = file.file.read()

        if not contents:
            logger.warning("Empty image file received")
            return ""

        # Load image
        image = Image.open(io.BytesIO(contents))

        # Convert to grayscale (OCR best practice)
        image = image.convert("L")

        # Optional: improve contrast (lightweight, safe)
        image = image.point(lambda x: 0 if x < 140 else 255)

        # OCR config (balanced accuracy + speed)
        ocr_config = (
            "--oem 3 "      # Default LSTM OCR engine
            "--psm 6"       # Assume uniform block of text
        )

        text = pytesseract.image_to_string(
            image,
            config=ocr_config
        )

        cleaned = text.strip()

        if not cleaned:
            logger.info("OCR completed but no text detected")
            return ""

        logger.info(f"OCR success | chars={len(cleaned)}")
        return cleaned

    except Exception as e:
        logger.exception("OCR failed")
        return ""