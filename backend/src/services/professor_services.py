from pony.orm import db_session, select
from fastapi import HTTPException
from uuid import UUID
from pony.orm.core import TransactionIntegrityError
from src import models, schemas

class ProfessorService:
    def __init__(self):
        pass

    def create_teacher(self, professor_data: schemas.ProfessorCreate) -> dict:
        with db_session:
            try:
                # Crear el profesor en la base de datos
                teacher = models.Teacher(
                    firstName=professor_data.firstName,
                    lastName=professor_data.lastName,
                    email=professor_data.email,
                    phone=professor_data.phone,
                    address=professor_data.address,
                    hire_date=professor_data.hire_date,
                    course=professor_data.course,
                )
                print("Profesor creado correctamente.")
                    
                # Convertir a un diccionario para retornar
                # Cambiar a professor_data.dict() en lugar de to_dict()
                teacher_dict = professor_data.dict(exclude={'id'})  # Si necesitas excluir 'id' u otros campos
                return teacher_dict

            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
                raise HTTPException(
                    status_code=400, detail="Error de integridad al crear el profesor.")
            except Exception as e:
                print(f"Error al crear el profesor: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al crear el profesor.")
