from pony.orm import db_session, select
from fastapi import HTTPException
import uuid
from pony.orm.core import TransactionIntegrityError
from src import models, schemas

class ProfessorService:
    def __init__(self):
        pass

    def create_teacher(self, professor_data: schemas.BaseProfessor) -> dict:
        with db_session:
            try:
                # Crear el profesor en la base de datos
                teacher = models.Teacher(
                    dni=professor_data.dni,
                    phone=professor_data.phone,
                    address=professor_data.address,
                    hire_date=professor_data.hire_date,
                )
                print("Profesor creado correctamente.")
                    
                teacher_dict = teacher.to_dict(exclude=['id'])  # Si necesitas excluir 'id' u otros campos
                return teacher_dict

            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
                raise HTTPException(
                    status_code=400, detail="Error de integridad al crear el profesor.")
            except Exception as e:
                print(f"Error al crear el profesor: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al crear el profesor.")

    def get_teacher(self, dni:str):
        with db_session:
            try:
                teacher = select(t for t in models.Teacher if t.dni == dni)[:]
                return teacher[0]
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
                raise HTTPException(
                    status_code=400, detail="Error de integridad al obtener el profesor.")
            except Exception as e:
                print(f"Error al crear el profesor: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al obtener el profesor.")
