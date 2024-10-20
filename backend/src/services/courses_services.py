from pony.orm import db_session
from src import models, schemas
from pony.orm.core import TransactionIntegrityError
from fastapi import HTTPException


class CourseService():
    def __init__(self):
        pass

    def create_course(self, course:schemas.CourseCreate) -> dict:
        with db_session:
            try: 
                course_created = models.Course(course_name=course.course_name)
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
