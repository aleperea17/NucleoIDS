import base64
import numpy as np
from io import BytesIO
from typing import List
from PIL import Image
import face_recognition
from pony.orm import select

# from src.services import student_services
from src import models
import numpy as np
import json

# student_service = student_services.StudentsService()


class AiRecognition():
    def __init__(self):
        pass

    # serializar y deserializar los datos del encoding para almacenarlos/obtenerlos de la base de datos
    def encoding_to_json(self, encoding: np.ndarray) -> str:
        return json.dumps(encoding.tolist())

    def json_to_encoding(self, json_str: str) -> np.ndarray:
        # Convertir la cadena JSON a una lista de Python
        encoding_list = json.loads(json_str)

        # Convertir la lista a un array de NumPy
        encoding_array = np.array(encoding_list)

        return encoding_array

    def get_encoding_from_base64(self, image_base64: str) -> np.ndarray:
        # Decodificar la imagen base64
        image_data = base64.b64decode(image_base64)

        # Convertir la imagen decodificada en un objeto PIL para que pueda ser procesada
        image = Image.open(BytesIO(image_data))

        # Convertir la imagen a un array de NumPy compatible con face_recognition
        np_image = np.array(image)

        # Obtener los encodings faciales de la imagen (asumiendo una sola cara)
        encodings = face_recognition.face_encodings(np_image)

        if encodings:
            return encodings[0]  # Devolver el primer encoding encontrado
        else:
            return None  # No se encontró ninguna cara

    def compare_faces(self, known_students: List[np.ndarray], student_curr_encoding: np.ndarray):
        # Almacena en una variable la lista de similitud con todas las codificaciones de rostros almacenados.
        faceDis = face_recognition.face_distance(
            known_students, student_curr_encoding)
        # Obtener el indice de la codificacion que mas se aproxima al rostro mostrado en la camara web.
        matchIndex = np.argmin(faceDis)
        # retorna el estudiante encontrado
        return known_students[matchIndex]

    def get_all_encodings(self):
        return select((e.data, e.student.dni, e.student.firstName) for e in models.Encoding)[:]

    def find_matching_student(self, image_base64: str):
        # Obtener el encoding de la imagen
        image_encoding = self.get_encoding_from_base64(image_base64)
        if image_encoding is None:
            return None  # No se encontró ninguna cara en la imagen

        # Obtener los encodings y dni de los estudiantes desde la base de datos
        encodings = self.get_all_encodings()

        for encoding_str, dni, firstName in encodings:
            # Convertir el JSON encoding a numpy array
            encoding_array = np.array(json.loads(encoding_str))

            # Comparar los encodings
            match = face_recognition.compare_faces(
                [encoding_array], image_encoding)

            if match[0]:  # Si hay una coincidencia
                return dni, firstName

        return None  # No se encontró ninguna coincidencia
