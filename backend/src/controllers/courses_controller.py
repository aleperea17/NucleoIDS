from fastapi import HTTPException, APIRouter
from pony.orm import db_session
from src import models,schemas
from src.services.courses_services import CourseService

router = APIRouter()
service = CourseService()

@router.post("/create-courses")
def create_course(course:schemas.CourseCreate):
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
def get_course(professor_id: str):
    try:
        professor, course, students = service.get_professor_course(professor_id)
        return {"Profesor":professor,"Taller":course, "Estudiantes":students,"success":True}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error inesperado:{e}")
        raise HTTPException(status_code=500, detail="No fue posible obtener los datos del curso.")