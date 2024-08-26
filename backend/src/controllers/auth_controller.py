from fastapi import HTTPException, APIRouter
from pony.orm import *
from src import schemas
from jose import jwt

from src.services.user_services import UsersService

# Auth controller

router = APIRouter()

service = UsersService()


SECRET_KEY = "your-secret-key"


@router.post("/register", response_model=schemas.BaseUser, status_code=201)
def register(user: schemas.UserCreate):
    user_created = service.create_user(user)
    return user_created


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
