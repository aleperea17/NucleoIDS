from pydantic import BaseModel
from typing import List
from src.models import Roles
from datetime import date

class BaseProfessor(BaseModel):
    dni: str
    firstName: str
    lastName: str 
    email: str
    phone: str 
    address: str
    hire_date: date

    class Config:
        from_attributes = True

# Esquema para crear un nuevo profesor
class ProfessorCreate(BaseProfessor):
    pass

#AGREGUE
class ProfessorResponse(BaseProfessor):
    id: str  # O el tipo que estés utilizando para el ID (como uuid.UUID)

    class Config:
        from_attributes = True

#AGREGUE
class TeacherResponse(BaseProfessor):
    course_name: str | None = None  # Agregar el nombre del curso

    class Config:
        from_attributes = True


class BaseUser(BaseModel):
    username: str
    email: str
    firstName: str
    lastName: str
    role: Roles

    class Config:
        # antes orm_mode=True
        from_attributes = True
        use_enum_values = True

class UserCreate(BaseUser):
    password: str

# Modelo de entrada

class LoginRequest(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str

# Modelo para recibir la imagen en base64 del front.

class ImageRequest(BaseModel):
    image_base64: str

class CourseCreate(BaseModel):
    course_name: str
    dni_teacher: str | None = None 
    

class Student(BaseModel):
    dni : str
    email : str
    firstName: str
    lastName : str
    course: str


class TokenVerificationRequest(BaseModel):
    token: str