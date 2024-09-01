import base64
from io import BytesIO
from PIL import Image
import cv2
from ..schemas import ImageRequest
import face_recognition

class AiRecognition():
    def __init__():
        pass

    def img_conversion(request: ImageRequest):
        # Decodificar la imagen base64
        image_data = base64.b64decode(request)
        # Cargar la imagen desde el flujo de bytes
        image = Image.open(BytesIO(image_data))
        # Convertir la imagen a formato RGB
        rgb_image = image.convert("RGB")
        return rgb_image

    # Este método recibe la imagen en RGB
    def recognition(inputImage):
        faceLocation = face_recognition.face_locations(inputImage)[0]
        inputEncode = face_recognition.face_encodings(inputImage)[0]
        
                


