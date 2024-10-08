from fastapi import APIRouter,HTTPException
from ..services.ai_recognition_services import AiRecognition
from ..services.student_services import StudentsService
from pony.orm import db_session
from ...src import schemas,models

router = APIRouter()

ai_service = AiRecognition()

student_service = StudentsService()

@router.post("/recognition")
def recognition(base64_string: schemas.ImageRequest):
    with db_session:
        try:
            dni,firstName = ai_service.find_matching_student(base64_string.image_base64)
            return {f"El alumno detectado es {firstName} con DNI {dni}"}
        except:
            raise HTTPException(status_code="404",detail="No fue posible realizar reconocimiento.")    


@router.post("/train")
def create_student(student_input: schemas.Student, base64_string: schemas.ImageRequest):
    with db_session:
        try:
            # Crear el objeto Encoding
            encoding_input = ai_service.get_encoding_from_base64(base64_string.image_base64)
            if not encoding_input:
                raise HTTPException(status_code="404",detail="No se ha encontrado un rostro.")
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

