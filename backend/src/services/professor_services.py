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

                # Si necesitas excluir 'id' u otros campos
                teacher_dict = teacher.to_dict(exclude=['id'])
                return teacher_dict

            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
                raise HTTPException(
                    status_code=400, detail="Error de integridad al crear el profesor.")
            except Exception as e:
                print(f"Error al crear el profesor: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al crear el profesor.")

    def get_teacher(self, dni: str):
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

    def update_teacher(self, dni: str, update_data: schemas.ProfessorUpdate) -> dict:
        with db_session:
            try:
                teacher = models.Teacher.get(dni=dni)
                if not teacher:
                    raise HTTPException(
                        status_code=404, detail="Profesor no encontrado")

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

                if update_data.courseId is None:
                    # Si courseId es None, buscar si el profesor tiene un curso asignado y desconectarlo
                    current_course = models.Course.get(teacher=teacher)
                    if current_course:
                        current_course.teacher = None
                        return {"message": "Profesor actualizado y desvinculado del curso correctamente"}
                else:
                    # Si se proporciona un nuevo courseId
                    new_course = models.Course.get(id=update_data.courseId)
                    if not new_course:
                        raise HTTPException(
                            status_code=404, detail="Curso no encontrado")

                    # Si el nuevo curso ya tiene un profesor diferente
                    if new_course.teacher and new_course.teacher.dni != dni:
                        raise HTTPException(
                            status_code=400,
                            detail="El curso ya está asignado a otro profesor"
                        )

                    # Desconectar el curso actual del profesor si existe
                    current_course = models.Course.get(teacher=teacher)
                    if current_course:
                        current_course.teacher = None

                    # Asignar el nuevo curso al profesor
                    new_course.teacher = teacher
                    return {"message": "Profesor actualizado y asignado al nuevo curso correctamente"}

                return {"message": "Profesor actualizado correctamente"}

            except Exception as e:
                # Esto muestra el error en la consola
                print(f"Error al actualizar el profesor: {e}")
                raise HTTPException(
                    status_code=500, detail="Error inesperado al actualizar el profesor.")

    def get_teacher(self, dni: str) -> dict:
        with db_session:
            try:
                # Obtener el profesor por DNI
                teacher = models.Teacher.get(dni=dni)
                if not teacher:
                    raise HTTPException(
                        status_code=404, detail="Profesor no encontrado")

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
                raise HTTPException(
                    status_code=404, detail="Profesor no encontrado")

            try:
                course = models.Course.get(teacher=teacher)
                if course:
                    course.teacher = None

                if teacher.user:
                    teacher.user.delete()

                teacher.delete()
                return {"message": "Profesor y todos los datos relacionados eliminados correctamente"}

            except Exception as e:
                print(
                    f"Error al eliminar el profesor y sus datos relacionados: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al eliminar el profesor y sus datos relacionados.")
