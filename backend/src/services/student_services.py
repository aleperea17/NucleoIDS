from pony.orm import db_session, select
from fastapi import HTTPException
from uuid import UUID
from pony.orm.core import TransactionIntegrityError
from src import models, schemas

class StudentsService:
    def __init__(self):
        pass

    def create_student(self, student: schemas.Student) -> dict:
        with db_session:
            try:
                student = models.Student(
                    dni = student.dni,
                    email=student.email,
                    firstName=student.firstName,
                    lastName=student.lastName,
                )
                print("Estudiante creado correctamente.")
                student_dict = student.to_dict(exclude=['id'])
                return student_dict
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
                raise HTTPException(
                    status_code=400, detail="Error de integridad al crear el estudiante.")
            except Exception as e:
                print(f"Error al crear el usuario: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al crear el estudiante.")

    def get_students(self):
        with db_session:
            try:
                students = select(p for p in models.Student)[:]
                students_conversion = [
                {key: str(value) if isinstance(value, UUID) else value for key, value in user.to_dict().items()}
                for user in students
                ]
                return students_conversion
            except:
                raise HTTPException(status_code=404, detail="No se pudieron obtener los estudiantes")
