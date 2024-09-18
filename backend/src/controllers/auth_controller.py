from fastapi import HTTPException, APIRouter,status
from pony.orm import *
from ...src import schemas
from jose import jwt, JWTError, ExpiredSignatureError
from ...src.services.user_services import UsersService
from pydantic import BaseModel
from decouple import config
from fastapi.security import OAuth2PasswordBearer

# Auth controller

router = APIRouter()

service = UsersService()


SECRET_KEY = config("SECRET")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class RegisterMessage(BaseModel):
    message: str
    success: bool

@router.post("/verify-token")
def verify_token(request: schemas.TokenVerificationRequest):
    try:
        # Decodifica el token
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("id")

        # Aquí puedes buscar el usuario en la base de datos usando el ID decodificado
        user = service.search_user_by_id(user_id)

        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o usuario no encontrado")

        return {
            "message": "Token válido",
            "success": True,
            "data": {"auth": True, "user": user.to_dict()}
        }

    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirado")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

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
