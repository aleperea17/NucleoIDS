<<<<<<< Updated upstream
from fastapi import FastAPI,HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from src.crud import get_users, create_user, search_user
from src.db import db
from pony.orm import *
from src import schemas
from jose import jwt
=======
from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from src.db import db
from src.controllers.auth_controller import router as auth_router
from src.controllers.users_controller import router as users_router
>>>>>>> Stashed changes

app = FastAPI()

# Mapeando las entidades a tablas (si no existe la tabla, la crea)
db.generate_mapping(create_tables=True)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

<<<<<<< Updated upstream
# Clave secreta para JWT
SECRET_KEY = "your-secret-key"  # Cambia esto por una clave secreta segura


=======
>>>>>>> Stashed changes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< Updated upstream
@app.get("/users")
def users():
    try:
        users = get_users()
        return JSONResponse(
            status_code=200,
            content={
                "message": "Usuarios obtenidos con éxito",
                "success": True,
                "data": users
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener usuarios: {str(e)}")

@app.post("/register",response_model=schemas.BaseUser, status_code=201)
def register(user: schemas.UserCreate):
    user_created = create_user(user)
    return user_created


@app.post("/login")
def login(request: schemas.LoginRequest):
    username = request.username
    email = request.email
    password = request.password

    if not username and not email:
        raise HTTPException(status_code=400, detail="Campos requeridos")

    user = search_user(username,email,password)

    token = jwt.encode({"id": str(user.id)}, SECRET_KEY, algorithm="HS256")

    return {
        "message": "Usuario logeado correctamente",
        "success": True,
        "data": {"auth": True, "token": token}
    }
=======
# Lista de Rutas

# Auth
app.include_router(auth_router, prefix="/auth", tags=["auth"])

# Usuarios
app.include_router(users_router, prefix="/users", tags=["usuarios"])


# Clave secreta para JWT
SECRET_KEY = "your-secret-key"  # Cambia esto por una clave secreta segura
>>>>>>> Stashed changes
