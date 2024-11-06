from pony.orm import db_session, select
from fastapi import HTTPException
from uuid import UUID
from pony.orm.core import TransactionIntegrityError
from src import models, schemas



class StudentsService:

    def __init__(self):
        pass

    def create_student(self, student_in: schemas.Student):
        with db_session:
            try:
                # Busca el curso de acuerdo al nombre que recibe en el endpoint
                student = models.Student(
                    dni = student_in.dni,
                    email= student_in.email,
                    firstName= student_in.firstName,
                    lastName= student_in.lastName,
                )
                print("Estudiante creado correctamente.")
                return student
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
                raise HTTPException(
                    status_code=400, detail="Error de integridad al crear el estudiante.")
            except Exception as e:
                print(f"Error al crear el estudiante: {e}")
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

    def get_student(self,dni:str):
        with db_session:
            try:
                student = select(s for s in models.Student if s.dni == dni)[:]
                if student:
                    return student[0]
                else:
                    return False
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
    
    def modify_student(self,student_in:schemas.Student):
        with db_session:
            try:
                student = select(s for s in models.Student if s.dni == student_in.dni)[:]
                course = select(c for c in models.Course if c.course_name == student_in.course)[:]
                if not course:
                    raise HTTPException(status_code=404, detail="Curso no encontrado")
                if student:
                    student[0].set(dni=student_in.dni, email=student_in.email, firstName=student_in.firstName, lastName=student_in.lastName, courses=course[0])
                    return student[0].to_dict()
                else:
                    raise HTTPException(status_code=404, detail="Estudiante no encontrado")
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
    




