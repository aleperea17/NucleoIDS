from fastapi import HTTPException, APIRouter, Depends
from pony.orm import *
from src import schemas
from src.services.professor_services import ProfessorService
from src.controllers.auth_controller import get_current_user
from pydantic import BaseModel

# Profesor controller

router = APIRouter()

service = ProfessorService()


class RegisterMessage(BaseModel):
    message: str
    success: bool


@router.post("/register", response_model=RegisterMessage, status_code=201)
def register_professor(professor: schemas.ProfessorCreate, current_user=Depends(get_current_user)):
    try:
        professor_created = service.create_teacher(professor)
        return {
            "message": "Profesor creado correctamente",
            "success": True,
        }
    except HTTPException as e:
        return {
            "message": e.detail,
            "success": False,
        }
    except Exception as e:
        return {
            "message": "Error inesperado al crear el profesor.",
            "success": False,
        }

class UpdateMessage(BaseModel):
    message: str
    success: bool

@router.put("/update/{dni}", response_model=UpdateMessage)
def update_professor(dni: str, professor_update: schemas.UserProfessor, current_user=Depends(get_current_user)):
    try:
        update_result = service.update_teacher(dni, professor_update)
        return {"message": update_result["message"], "success": True}
    except HTTPException as e:
        print(f"HTTPException: {e.detail}")
        return {"message": e.detail, "success": False}
    except Exception as e:
        print(f"Error inesperado al actualizar el profesor: {e}")
        return {"message": "Error inesperado al actualizar el profesor.", "success": False}

@router.get("/get/{dni}", response_model=schemas.UserProfessor)
def get_professor(dni: str, current_user=Depends(get_current_user)):
    try:
        professor_data = service.get_teacher(dni)
        return professor_data
    except HTTPException as e:
        print(f"HTTPException: {e.detail}")
        raise e
    except Exception as e:
        print(f"Error inesperado al obtener el profesor: {e}")
        raise HTTPException(
            status_code=500, detail="Error inesperado al obtener el profesor.")

@router.delete("/{dni}", status_code=200)
def delete_professor(dni: str, current_user=Depends(get_current_user)):
    try:
        result = service.delete_teacher(dni)
        return {"message": result["message"], "success": True}
    except HTTPException as e:
        return {"message": e.detail, "success": False}
    except Exception as e:
        return {"message": "Error inesperado al eliminar el profesor.", "success": False}