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

