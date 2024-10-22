from fastapi import APIRouter, HTTPException
from src.services.ai_recognition_services import AiRecognition
from src.services.student_services import StudentsService
from src.services.courses_services import CourseService
from src.services.attendance_service import AttendanceService
from pony.orm import db_session
from src import schemas, models

router = APIRouter()

ai_service = AiRecognition()

student_service = StudentsService()

course_service = CourseService()

attendance_service = AttendanceService()

@router.post("/recognition")
def recognition(id:str, base64_string: schemas.ImageRequest):
    with db_session:
        try:
            student = ai_service.find_matching_student(
                base64_string.image_base64)
            attendance = attendance_service.markAttendance(id,student)
            return {f"Se ha marcado la asistencia del alumno {student.lastName},{student.firstName} con DNI {student.dni} correctamente"}
        except:
            raise HTTPException(
                status_code=404, detail="No fue posible realizar reconocimiento.")


@router.post("/train")
def create_student(student_input: schemas.Student, base64_string: schemas.ImageRequest):
    with db_session:
        try:
            # Crear el objeto Encoding
            encoding_input = ai_service.get_encoding_from_base64(
                base64_string.image_base64)
            if encoding_input is None or len(encoding_input) == 0:
                raise HTTPException(
                    status_code=404, detail="No se ha encontrado un rostro.")
            encoding = models.Encoding(
                data=ai_service.encoding_to_json(encoding_input))
            course = course_service.get_course(student_input.course)

            # Crear el objeto Student y asignar el encoding y el curso
            student = models.Student(
                dni=student_input.dni,
                email=student_input.email,
                firstName=student_input.firstName,
                lastName=student_input.lastName,
                encoding=encoding,
                courses=course
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
            return {
                "success": True,
                "coords": location
            }
        else:
            return {
                "success": False,
            }
    except HTTPException as e:
        return {
            "message": f'{e.detail}',
            "success": False, }
