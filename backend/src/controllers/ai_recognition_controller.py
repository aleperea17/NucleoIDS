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
def recognition(base64_string: schemas.ImageRequest):
    try:
        student = ai_service.find_matching_student(
            base64_string.image_base64)
        return {f"El alumno reconocido es {student.firstName} con DNI {student.dni}"}
    except:
        raise HTTPException(
            status_code=404, detail="No fue posible realizar reconocimiento.")


@router.post("/mark-attendance")
def mark_attendance(course_id:str,  base64_string: schemas.ImageRequest):
    try:
        student_id = ai_service.find_matching_student(
            base64_string.image_base64)
        attendance = attendance_service.markAttendance(course_id,student_id)
        return {
            "message": f'Se ha registrado la asistencia del estudiante correctamente. ',
            "success": True
            }
    
    except:
            raise HTTPException(
                status_code=404, detail="No fue posible realizar reconocimiento.")


@router.post("/train")
def add_student(student_input: schemas.Student, base64_string: schemas.ImageRequest):
    try:
        encoding = ai_service.create_encoding(base64_string.image_base64)

        # Crear el objeto Student y asignar el encoding y el curso
        student = student_service.create_student(student_input)

        if not student:
            raise HTTPException(status_code=404, detail="No fue posible crear el estudiante.") 
        
        # Asignar el encoding al estudiante creado
        ai_service.assign_encoding(encoding.id,student.id)

        # Asignar el curso al estudiante 
        course_service.assign_course_to_student(student_input.course,student.id)

        return {"Estudiante agregado con exito a la base de datos."}
    
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
