from fastapi import HTTPException, APIRouter
from pony.orm import *
from src import schemas
from src.services.professor_services import ProfessorService
from pydantic import BaseModel

# Profesor controller

router = APIRouter()

service = ProfessorService()


class RegisterMessage(BaseModel):
    message: str
    success: bool


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










