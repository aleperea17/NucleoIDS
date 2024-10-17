from fastapi import HTTPException, APIRouter, status, Depends
from pony.orm import *
from src import schemas
from jose import jwt, JWTError, ExpiredSignatureError
from src.services.user_services import UsersService
from pydantic import BaseModel
from decouple import config
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta

# Auth controller

router = APIRouter()

service = UsersService()

SECRET_KEY = config("SECRET")
ACCESS_TOKEN_DURATION = 5
REFRESH_TOKEN_DURATION = 60
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


class RegisterMessage(BaseModel):
    message: str
    success: bool


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        user = service.search_user_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=401, detail="Usuario no encontrado")
        return user
    except JWTError:
        raise HTTPException(
            status_code=401, detail="Token inválido o expirado")


@router.post("/verify-token")
async def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        user = service.search_user_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=401, detail="Usuario no encontrado")
        print(user)
        return {
            "message": "Token válido",
            "user": {
                "username": user.username,
                "email": user.email
            }
        }
    except JWTError:
        raise HTTPException(
            status_code=401, detail="Token inválido o expirado")

@router.post("/refresh-token")
async def refresh_token(refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")

        # Verifica si el usuario aún existe y es válido
        user = service.search_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        # Crea un nuevo token de acceso
        new_access_token = jwt.encode(
            {"id": str(user.id), "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_DURATION)},
            key=SECRET_KEY,
            algorithm="HS256"
        )

        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Refresh token inválido o expirado")

@router.post("/register", response_model=RegisterMessage, status_code=201)
async def register(user: schemas.UserCreate):
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
            "success": False,
        }
    except Exception as e:
        return {
            "message": "Error inesperado al crear el usuario.",
            "success": False,
        }


@router.post("/login")
async def login(request: schemas.LoginRequest = Depends()):
    username = request.username
    email = request.email
    password = request.password

    if not username and not email:
        raise HTTPException(status_code=400, detail="Campos requeridos")

    user = service.search_user(
        username=username, email=email, password=password)

    access_token = {"id": str(user.id), "exp": datetime.utcnow(
    ) + timedelta(minutes=ACCESS_TOKEN_DURATION)}

    refresh_token = {
            "id": str(user.id),
            "exp": datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_DURATION)
        }

    return {
        "message": "Usuario logeado correctamente",
        "success": True,
        "access_token": jwt.encode(access_token, key=SECRET_KEY, algorithm="HS256"),
        "refresh_token": jwt.encode(refresh_token, key=SECRET_KEY, algorithm="HS256"),
        "token_type": "bearer"
    }
