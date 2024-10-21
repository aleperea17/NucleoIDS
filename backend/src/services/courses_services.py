from pony.orm import db_session
from src import models, schemas
from pony.orm.core import TransactionIntegrityError
from fastapi import HTTPException
from src.services.professor_services import ProfessorService

professor_service = ProfessorService()

class CourseService():
    def __init__(self):
        pass

    def create_course(self, course:schemas.CourseCreate) -> dict:
        with db_session:
            try: 
                teacher = professor_service.get_teacher(course.dni_teacher)
                if teacher:              
                    course_created = models.Course(course_name=course.course_name, teacher=teacher)
                course_dict = course_created.to_dict(exclude=['id'])
                return course_dict
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
                raise HTTPException(
                    status_code=400, detail="Error de integridad al crear el curso.")
            except Exception as e:
                print(f"Error al crear el curso: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al crear el curso.")


