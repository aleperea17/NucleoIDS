from src import schemas,models
from datetime import datetime
from pony.orm import db_session, TransactionIntegrityError
from fastapi import HTTPException
from src.services.student_services import StudentsService

student_service = StudentsService()
today = datetime.now().date()

class AttendanceService():
    def __init__(self):
        pass

    def markAttendance(self, course_id:str, student_id):
        with db_session:
            try:
                student = student_service.get_student(student_id)
                attendance = models.Attendance(date=str(today), value=True,student=student,course=course_id)
                attendance_dict = attendance.to_dict(exclude=['id'])  # Si necesitas excluir 'id' u otros campos
                return attendance_dict
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
                raise HTTPException(
                    status_code=400, detail="Error de integridad al marcar la asistencia.")
            except Exception as e:
                print(f"Error al marcar la asistencia: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al marcar la asistencia.")


