from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from src.crud import get_users, create_user, search_user
from src.db import db
from pony.orm import *
from src import schemas
from jose import jwt
from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from src.db import db
from src.controllers.auth_controller import router as auth_router
from src.controllers.users_controller import router as users_router

app = FastAPI()

# Mapeando las entidades a tablas (si no existe la tabla, la crea)
db.generate_mapping(create_tables=True)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lista de Rutas

# Auth
app.include_router(auth_router, prefix="/auth", tags=["auth"])

# Usuarios
app.include_router(users_router, prefix="/users", tags=["usuarios"])


