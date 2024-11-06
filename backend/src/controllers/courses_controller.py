from datetime import date
from uuid import UUID
from fastapi import HTTPException, APIRouter, Depends, Query
from pony.orm import db_session
from src import models, schemas
from src.services.attendance_service import AttendanceListResponse, AttendanceService
from src.services.courses_services import CourseService
from src.controllers.auth_controller import get_current_user

router = APIRouter()
service = CourseService()


@router.post("/create-courses")
def create_course(course: schemas.CourseCreate):
    with db_session:
        try:
            course_created = service.create_course(course)
            return {
                "message": "Curso creado correctamente",
                "success": True
            }
        except HTTPException as e:
            return {
                "message": e.detail,
                "success": False, }


@router.get("/get-course-by-professor-id")
def get_course(professor_id: str, current_user=Depends(get_current_user)):
    try:
        if not str(current_user.id):
            raise HTTPException(
                status_code=403,
                detail="No tienes permiso para acceder a esta información"
            )

        professor, course, students = service.get_professor_course(
            professor_id)

        return {"Profesor": professor, "Taller": course, "Estudiantes": students, "success": True}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error inesperado:{e}")
        raise HTTPException(
            status_code=500, detail="No fue posible obtener los datos del curso.")


@router.get("/course/{course_id}", response_model=AttendanceListResponse)
def get_today_course_attendance(
    course_id: UUID,
    date: date = Query(),
    current_user=Depends(get_current_user)
):
    try:
        attendance_service = AttendanceService()

        return attendance_service.get_today_course_attendance(course_id, date)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Error inesperado al obtener las asistencias")
    
@router.get("/courses", response_model=dict)
async def get_all_courses(current_user=Depends(get_current_user)):
    try:
        list_of_courses = service.get_courses()
        return {
            "success": True,
            # Using to_dict() instead of to_list()
            "courses": [course.to_dict() for course in list_of_courses]
        }
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        print(f"Unexpected error while fetching courses: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="No fue posible obtener los datos de los cursos."
        )
