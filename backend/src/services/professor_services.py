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
                    firstName=professor_data.firstName,
                    lastName=professor_data.lastName,
                    email=professor_data.email,
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
            
    #Agregue
    def get_teacher(self, dni: str):
        with db_session:
            try:
                teacher = select(t for t in models.Teacher if t.dni == dni).first()
                if not teacher:
                    raise HTTPException(status_code=404, detail="Profesor no encontrado.")

                # Obtén el nombre del curso si existe
                course_name = teacher.course.course_name if teacher.course else None

                # Retorna un diccionario con la información del profesor y el curso
                return {
                    "dni": teacher.dni,
                    "firstName": teacher.firstName,
                    "lastName": teacher.lastName,
                    "email": teacher.email,
                    "phone": teacher.phone,
                    "address": teacher.address,
                    "hire_date": teacher.hire_date,
                }
            except Exception as e:
                print(f"Error al obtener el profesor: {e}")
                raise HTTPException(status_code=500, detail="Error al obtener el profesor.")
    
    #Agregue
    def delete_teacher(self, dni: str) -> dict:
        with db_session:
            try:
                teacher = select(t for t in models.Teacher if t.dni == dni).first()
                if not teacher:
                    raise HTTPException(status_code=404, detail="Profesor no encontrado.")

                teacher.delete()
                print("Profesor eliminado correctamente.")
                return {"detail": "Profesor eliminado exitosamente."}
            except Exception as e:
                print(f"Error al eliminar el profesor: {e}")
                raise HTTPException(status_code=500, detail="Error al eliminar el profesor.")
            
    #Agregue       
    def update_teacher(self, dni: str, professor_data: schemas.BaseProfessor) -> dict:
        with db_session:
            try:
                # Buscar el profesor por DNI
                print(f"DNI que se busca: {dni}")
                teacher = models.Teacher.get(dni=dni)  # Usar get para evitar problemas con select

                if not teacher:
                    raise HTTPException(status_code=404, detail="Profesor no encontrado.")

                # Actualizar los atributos del profesor
                teacher.firstName = professor_data.firstName
                teacher.lastName = professor_data.lastName
                teacher.email = professor_data.email
                teacher.phone = professor_data.phone
                teacher.address = professor_data.address
                teacher.hire_date = professor_data.hire_date

                print("Profesor actualizado correctamente.")
                return teacher.to_dict(exclude=['id'])  # Retorna los datos del profesor actualizado

            except HTTPException as e:
                raise e
            except Exception as e:
                print(f"Error al actualizar el profesor: {e}")
                import traceback
                print(traceback.format_exc())  # Imprimir la traza del error
                raise HTTPException(status_code=500, detail=f"Error al actualizar el profesor: {str(e)}")
    
    







