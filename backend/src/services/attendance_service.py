from src import schemas,models
from datetime import datetime
from pony.orm import db_session, TransactionIntegrityError, select
from fastapi import HTTPException
from src.services.student_services import StudentsService

student_service = StudentsService()
today = datetime.now().date()

class AttendanceService():
    def __init__(self):
        pass

    def markAttendance(self, course_id:str, student_dni):
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
                    raise HTTPException(status_code=203,detail=f"Ya existe una asistencia registrada para este estudiante en este curso y fecha")
                
                attendance = models.Attendance(date=str(today), value=True,student=student,course=course_id)
                
                print(f"Asistencia registrada: {attendance}")
                
                attendance_dict = attendance.to_dict(exclude=['id'])  # Si necesitas excluir 'id' u otros campos
                
                return attendance_dict
            except TransactionIntegrityError as e:
                raise HTTPException(
                    status_code=400, detail="Error de integridad al marcar la asistencia.")
            # except Exception as e:
            #     print(f"Error al marcar la asistencia: {e}")
            #     raise HTTPException(
            #         status_code=500, detail="Error al marcar la asistencia.")


