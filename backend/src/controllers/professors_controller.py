from fastapi import HTTPException, APIRouter
from pony.orm import *
from src import schemas
from src.schemas import *
from src.services.professor_services import *
from pydantic import BaseModel
from datetime import date

# Profesor controller

router = APIRouter()

service = ProfessorService()


class RegisterMessage(BaseModel):
    message: str
    success: bool

class TeacherResponse(BaseModel):
    dni: str
    firstName: str
    lastName: str
    email: str
    phone: str
    address: str
    hire_date: date




@router.post("/register", response_model=RegisterMessage, status_code=201)
def register_professor(professor: schemas.ProfessorCreate):
    try:
        professor_created = service.create_teacher(professor)
        return {
            "message": "Profesor creado correctamente",
            "success": True,
        }
    except HTTPException as e:
        # Maneja el error y devuelve un mensaje personalizado
        return {
            "message": e.detail,
            "success": False,
        }
    except Exception as e:
        return {
            "message": "Error inesperado al crear el profesor.",
            "success": False,
        }

#AGREGUE

@router.get("/{dni}", response_model=ProfessorResponse)
@router.get("/{dni}", response_model=TeacherResponse)
def get_professor(dni: str):
    try:
        teacher = service.get_teacher(dni)
        return teacher
    except HTTPException as e:
        return {
            "message": e.detail,
            "success": False,
        }
    except Exception as e:
        return {
            "message": "Error inesperado al obtener el profesor.",
            "success": False,
        }

@router.delete("/profesores/{dni}")
async def delete_professor(dni: str):
    try:
        teacher = service.delete_teacher(dni)
        return teacher
    except HTTPException as e:
        raise e













