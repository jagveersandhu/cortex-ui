from PIL import Image
import pytesseract
import io
from fastapi import UploadFile

# ======================================================
# Explicit Tesseract binding (REQUIRED on Windows)
# ======================================================

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

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
        # Read file bytes
        contents = file.file.read()

        # Open image safely
        image = Image.open(io.BytesIO(contents))

        # Convert to RGB (prevents common OCR crashes)
        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")

        # OCR extraction
        text = pytesseract.image_to_string(image)

        return text.strip()

    except Exception as e:
        return f"[OCR ERROR] Failed to extract text from image: {str(e)}"