from fastapi import HTTPException, APIRouter
from pony.orm import *
from ...src import schemas
from jose import jwt
from ...src.services.user_services import UsersService
from pydantic import BaseModel
from decouple import config

# Auth controller

router = APIRouter()

service = UsersService()


SECRET_KEY = config("SECRET")


class RegisterMessage(BaseModel):
    message: str
    success: bool


@router.post("/register", response_model=RegisterMessage, status_code=201)
def register(user: schemas.UserCreate):
    try:
        user_created = service.create_user(user)
        return {
            "message": "Usuario creado correctamente",
            "success": True,
        }
    except HTTPException as e:
        # Maneja el error y devuelve un mensaje personalizado
        return {
            "message": e.detail,
            "success": False, }
    except Exception as e:
        return {
            "message": "Error inesperado al crear el usuario.",
            "success": False,
        }


@router.post("/login")
def login(request: schemas.LoginRequest):
    username = request.username
    email = request.email
    password = request.password

    if not username and not email:
        raise HTTPException(status_code=400, detail="Campos requeridos")

    user = service.search_user(
        username=username, email=email, password=password)

    token = jwt.encode({"id": str(user.id)}, SECRET_KEY, algorithm="HS256")

    return {
        "message": "Usuario logeado correctamente",
        "success": True,
        "data": {"auth": True, "token": token}
    }
