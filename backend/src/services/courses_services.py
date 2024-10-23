from pony.orm import db_session, select
from src import models, schemas
from pony.orm.core import TransactionIntegrityError
from fastapi import HTTPException
from src.services.professor_services import ProfessorService
from src.services.student_services import StudentsService

professor_service = ProfessorService()

student_service = StudentsService()

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

    def get_course(self,course_name:str):
        with db_session:
            try:
                course = select(c for c in models.Course if c.course_name == course_name)[:]
                return course[0]
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
                raise HTTPException(
                    status_code=400, detail="Error de integridad al obtener el curso.")
            except Exception as e:
                print(f"Error al crear el curso: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al obtener el curso.")

    def assign_course_to_student(self, course_name:str, student_dni):
        with db_session:
            try:
                student = student_service.get_student(student_dni)
                student.courses = self.get_course(course_name)
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")