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
            
    def update_teacher(self, dni: str, update_data: schemas.UserProfessor) -> dict:
        with db_session:
            try:
                teacher = models.Teacher.get(dni=dni)
                if not teacher:
                    raise HTTPException(status_code=404, detail="Profesor no encontrado")

                # Actualizar datos en la tabla Teacher
                teacher.phone = update_data.phone
                teacher.address = update_data.address
                teacher.hire_date = update_data.hire_date

                # Actualizar datos en la tabla User relacionada
                user = teacher.user
                if user:
                    user.firstName = update_data.firstName
                    user.lastName = update_data.lastName
                    user.email = update_data.email

                return {"message": "Profesor actualizado correctamente"}
                
            except Exception as e:
                print(f"Error al actualizar el profesor: {e}")  # Esto muestra el error en la consola
                raise HTTPException(
                    status_code=500, detail="Error inesperado al actualizar el profesor.")
    
    def get_teacher(self, dni: str) -> dict:
        with db_session:
            try:
                # Obtener el profesor por DNI
                teacher = models.Teacher.get(dni=dni)
                if not teacher:
                    raise HTTPException(status_code=404, detail="Profesor no encontrado")

                # Crear el diccionario de respuesta
                teacher_data = {
                    "dni": teacher.dni,
                    "phone": teacher.phone,
                    "address": teacher.address,
                    "hire_date": teacher.hire_date
                }

                # Si el profesor tiene un usuario relacionado, añadir esos datos
                if teacher.user:
                    teacher_data.update({
                        "username": teacher.user.username,
                        "email": teacher.user.email,
                        "firstName": teacher.user.firstName,
                        "lastName": teacher.user.lastName,
                        "role": teacher.user.role
                    })

                return teacher_data

            except Exception as e:
                print(f"Error al obtener el profesor: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al obtener el profesor.")
    
    def delete_teacher(self, dni: str) -> dict:
        with db_session:
            # Buscar el profesor con el DNI especificado
            teacher = models.Teacher.get(dni=dni)
            if not teacher:
                raise HTTPException(status_code=404, detail="Profesor no encontrado")

            try:
                # Eliminar cursos asociados al profesor
                if teacher.course:
                    for course in teacher.course:
                        # Eliminar asistencias relacionadas con el curso
                        for attendance in course.attendance:
                            attendance.delete()
                        
                        # Eliminar relación del curso con estudiantes
                        for student in course.students:
                            student.courses.remove(course)
                        
                        course.delete()

                # Eliminar usuario asociado al profesor, si existe
                if teacher.user:
                    teacher.user.delete()

                # Finalmente, eliminar el profesor
                teacher.delete()
                return {"message": "Profesor y todos los datos relacionados eliminados correctamente"}

            except Exception as e:
                print(f"Error al eliminar el profesor y sus datos relacionados: {e}")
                raise HTTPException(status_code=500, detail="Error al eliminar el profesor y sus datos relacionados.")

    
