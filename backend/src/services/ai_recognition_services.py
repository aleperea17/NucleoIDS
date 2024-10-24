import base64
import numpy as np
from io import BytesIO
from typing import List
from PIL import Image
import face_recognition
from pony.orm import select, db_session, TransactionIntegrityError
from src import models
import numpy as np
import json
from src.services.student_services import StudentsService

student_service = StudentsService()

class AiRecognition():
    def __init__(self):
        pass

    # Serializar y deserializar los datos del encoding para almacenarlos/obtenerlos de la base de datos
    def encoding_to_json(self, encoding: np.ndarray) -> str:
        return json.dumps(encoding.tolist())


    def json_to_encoding(self, json_str: str) -> np.ndarray:
        # Convertir la cadena JSON a una lista de Python
        encoding_list = json.loads(json_str)

        # Convertir la lista a un array de NumPy
        encoding_array = np.array(encoding_list)

        return encoding_array


    def base64_to_nparray(self, image_base64:str):
        # Decodificar la imagen base64
        image_data = base64.b64decode(image_base64)

        # Convertir la imagen decodificada en un objeto PIL para que pueda ser procesada
        image = Image.open(BytesIO(image_data))

        # Convertir la imagen a un array de NumPy compatible con face_recognition
        np_image = np.array(image)
        return np_image


    def get_encoding_from_base64(self, image_base64: str) -> np.ndarray:
        # Obtener los encodings faciales de la imagen (asumiendo una sola cara)
        image = self.base64_to_nparray(image_base64)
        encodings = face_recognition.face_encodings(image)

        if encodings:
            return encodings[0]  # Devolver el primer encoding encontrado
        else:
            return None  # No se encontró ninguna cara


    def get_face_location(self, image_base64: str):
        image = self.base64_to_nparray(image_base64)
        location = face_recognition.face_locations(image)
        if location:
            return location[0]
        else:
            return None

    def compare_faces(self, known_students:List[np.ndarray], student_curr_encoding: np.ndarray):
        # Almacena en una variable la lista de similitud con todas las codificaciones de rostros almacenados. 
        faceDis = face_recognition.face_distance(known_students,student_curr_encoding)

        # Obtener el indice de la codificacion que mas se aproxima al rostro mostrado en la camara web.
        matchIndex = np.argmin(faceDis)
        
        # retorna el estudiante encontrado
        return known_students[matchIndex]


    def get_all_encodings(self):
        try:
            return select((e.data, e.student) for e in models.Encoding)[:]
        except TransactionIntegrityError as e:
            print(f"Error de integridad transaccional: {e}")


    def create_encoding(self, image_base64:str):
        with db_session:
            try:
                # Crear el objeto Encoding
                encoding_input = self.get_encoding_from_base64(
                    image_base64)
                if encoding_input is None or len(encoding_input) == 0:
                    raise ValueError("Encoding nulo o inexistente.")
                encoding = models.Encoding(data=self.encoding_to_json(encoding_input))
                return encoding
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
    

    def assign_encoding(self, encoding_id, student_id):
        with db_session:
            try:
                student = student_service.get_student(student_id)
                encoding = select(e for e in models.Encoding if e.id == encoding_id)[:][0]
                student.encoding = encoding
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
        

    def find_matching_student(self, image_base64: str):
        with db_session:
            try:
                # Obtener el encoding de la imagen
                image_encoding = self.get_encoding_from_base64(image_base64)
                if image_encoding is None:
                    return None  # No se encontró ninguna cara en la imagen
                # Obtener los encodings y  estudiantes desde la base de datos
                encodings = self.get_all_encodings()
                for encoding_str, student in encodings:
                    # Convertir el JSON encoding a numpy array
                    encoding_array = np.array(json.loads(encoding_str))
                    # Comparar los encodings
                    match = face_recognition.compare_faces(
                        [encoding_array], image_encoding,tolerance=0.4)
                    if match[0]:  # Si hay una coincidencia
                        return student.to_dict()
                return None  # No se encontró ninguna coincidencia
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
