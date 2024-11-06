from typing import List
from uuid import UUID
from pydantic import BaseModel
from src import schemas, models
from datetime import date
from datetime import datetime
from pony.orm import db_session, TransactionIntegrityError, select
from fastapi import HTTPException, Query
from src.services.student_services import StudentsService

student_service = StudentsService()
today = datetime.now().date()


class StudentBasic(BaseModel):
    id: UUID
    firstName: str
    lastName: str
    dni: str
    email: str


class AttendanceResponse(BaseModel):
    id: UUID
    date: date
    value: bool
    student: StudentBasic


class AttendanceListResponse(BaseModel):
    courseId: UUID
    courseName: str
    attendances: List[AttendanceResponse]


class AttendanceService():
    def __init__(self):
        pass

    def markAttendance(self, course_id: str, student_dni):
        with db_session:
            try:
                student = student_service.get_student(student_dni)

                course = models.Course[course_id]

                # if isinstance(today, str):
                #     current_date = datetime.strptime(today, '%Y-%m-%d').date()
                # else:
                #     current_date = today

                existing_attendance = models.Attendance.select(
                    lambda a: a.student == student and
                    a.course == course and
                    a.date == today
                ).first()

                if existing_attendance:
                    raise HTTPException(
                        status_code=203, detail=f"Ya existe una asistencia registrada para este estudiante en este curso y fecha")

                attendance = models.Attendance(
                    date=str(today), value=True, student=student, course=course_id)

                print(f"Asistencia registrada: {attendance}")

                # Si necesitas excluir 'id' u otros campos
                attendance_dict = attendance.to_dict(exclude=['id'])

                return attendance_dict
            except TransactionIntegrityError as e:
                raise HTTPException(
                    status_code=400, detail="Error de integridad al marcar la asistencia.")
            # except Exception as e:
            #     print(f"Error al marcar la asistencia: {e}")
            #     raise HTTPException(
            #         status_code=500, detail="Error al marcar la asistencia.")

    @db_session
    def get_today_course_attendance(self, course_id: UUID, date: date) -> dict:
        try:
            # Verificar si el curso existe
            course = models.Course.get(id=course_id)
            if not course:
                raise HTTPException(
                    status_code=404,
                    detail="Curso no encontrado"
                )

        # Get all attendances for the course
            attendances = select(
                a for a in models.Attendance
                if a.course.id == course_id and a.date == date
            )[:]

        # Format attendance records
            # Format attendance records
            formatted_attendances = [
                {
                    # Changed from attendanceId to id
                    "id": str(attendance.id),
                    "date": attendance.date.strftime('%Y-%m-%d') if attendance.date else None,
                    "value": attendance.value,
                    "student": {
                        "id": str(attendance.student.id),
                        "firstName": attendance.student.firstName,
                        "lastName": attendance.student.lastName,
                        "dni": attendance.student.dni,
                        "email": attendance.student.email,
                    }
                }
                for attendance in attendances
                if attendance and attendance.student
            ]
        # Return formatted response
            return {
                "courseId": str(course.id),
                "courseName": course.course_name,
                "attendances": formatted_attendances
            }

        except Exception as e:
            print(f"Error al obtener las asistencias: {e}")
            raise HTTPException(
                status_code=500,
                detail="Error al obtener las asistencias del curso"
            )
