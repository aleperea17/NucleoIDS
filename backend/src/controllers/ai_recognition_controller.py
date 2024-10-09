from fastapi import APIRouter, HTTPException
from src.services.ai_recognition_services import AiRecognition
from src.services.student_services import StudentsService
from pony.orm import db_session
from src import schemas, models

router = APIRouter()

ai_service = AiRecognition()

student_service = StudentsService()


@router.post("/recognition")
def recognition(base64_string: schemas.ImageRequest):
    with db_session:
        try:
            dni, firstName = ai_service.find_matching_student(
                base64_string.image_base64)
            return {f"El alumno detectado es {firstName} con DNI {dni}"}
        except:

            raise HTTPException(status_code=404,detail="No fue posible realizar reconocimiento.")    


@router.post("/train")
def create_student(student_input: schemas.Student, base64_string: schemas.ImageRequest):
    with db_session:
        try:
            # Crear el objeto Encoding
            encoding_input = ai_service.get_encoding_from_base64(base64_string.image_base64)
            print(encoding_input)
            if encoding_input is None or len(encoding_input) == 0:
                raise HTTPException(status_code=404, detail="No se ha encontrado un rostro.")
            encoding = models.Encoding(data=ai_service.encoding_to_json(encoding_input))

            # Crear el objeto Student y asignar el encoding
            student = models.Student(
                dni=student_input.dni,
                email=student_input.email,
                firstName=student_input.firstName,
                lastName=student_input.lastName,
                encoding=encoding
            )

            return {"Usuario creado con exito"}
        except HTTPException as e:
            return {
                "message": f'{e.detail}',
                "success": False, }

@router.post("/detectFace")
def detect_face(base64_string: schemas.ImageRequest):
    try:
        location = ai_service.get_face_location(base64_string.image_base64)
        if location:
            return location 
        else: 
            raise HTTPException(status_code=404, detail="No se ha encontrado un rostro.")
    except HTTPException as e:
        return {
            "message": f'{e.detail}',
            "success": False, }
        


