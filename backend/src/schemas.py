from pydantic import BaseModel
from typing import List
from src.models import Roles


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

class Student(BaseModel):
    dni : str
    email : str
    firstName: str
    lastName : str
    encoding: str

class TokenVerificationRequest(BaseModel):
    token: str
