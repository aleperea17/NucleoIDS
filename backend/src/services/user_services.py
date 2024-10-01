from pony.orm import db_session, desc, select
from fastapi import HTTPException, Query
from typing import Optional
from uuid import UUID
import bcrypt
from pony.orm.core import TransactionIntegrityError
from src import models, schemas


class UsersService:
    def __init__(self):
        pass

    def create_user(self, user: schemas.UserCreate) -> dict:
        with db_session:
            try:
                usuario = models.User(
                    username=user.username,
                    email=user.email,
                    password=self.hash_password(user.password),
                    firstName=user.firstName,
                    lastName=user.lastName,
                    role=user.role,
                )
                print("Usuario creado correctamente.")
                user_dict = usuario.to_dict(exclude=['id'])
                return user_dict
            except TransactionIntegrityError as e:
                print(f"Error de integridad transaccional: {e}")
                raise HTTPException(
                    status_code=400, detail="Error de integridad al crear el usuario.")
            except Exception as e:
                print(f"Error al crear el usuario: {e}")
                raise HTTPException(
                    status_code=500, detail="Error al crear el usuario.")

    def get_users(self,
                  page: int = Query(1, ge=1, description="Número de página"),
                  count: int = Query(
                      10, ge=1, le=100, description="Número de usuarios por página"),
                  sort: Optional[str] = Query(
                      None, description="Ordenar por campo (e.g., 'username', 'email')"),
                  order: Optional[str] = Query(
                      "asc", regex="^(asc|desc)$", description="Orden asc o desc"),
                  role: Optional[models.Roles] = Query(None, description="Filtrar por rol")):
        with db_session:
            users = select(p for p in models.User)[:]
            query = select(u for u in models.User)

            if role:
                query = query.filter(lambda u: u.role == role)

            if sort:
                if order == "asc":
                    query = query.order_by(lambda u: getattr(u, sort))
                else:
                    query = query.order_by(lambda u: desc(getattr(u, sort)))

            total = query.count()
            users = query.page(page, count)

            users_conversion = [
                {key: str(value) if isinstance(value, UUID)
                 else value for key, value in user.to_dict().items()}
                for user in users
            ]
        return {
            "page": page,
            "count": len(users_conversion),
            "total": total,
            "users": users_conversion,
        }

    def search_user_by_id(self, user_id: str):
        with db_session:
            try:
                user_id = UUID(user_id)  # Convertir el user_id a UUID
                user = select(u for u in models.User if u.id == user_id).first()
                return user if user else None
            except Exception as e:
                return None
    
    def search_user(self, username: Optional[str], email: Optional[str], password: str) -> models.User:
        with db_session:
            user = select(u for u in models.User if (
                u.username == username or u.email == email)).first()

        if not user:
            raise HTTPException(
                status_code=404, detail="Usuario no encontrado")

        password_is_valid = self.check_password(user.password, password)

        if not password_is_valid:
            raise HTTPException(
                status_code=401, detail="Contraseña incorrecta")

        return user

    @staticmethod
    def hash_password(password: str) -> str:
        # Generar una sal (salt)
        salt = bcrypt.gensalt()
        # Encriptar la contraseña con la sal
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def check_password(stored_password: str, provided_password: str) -> bool:
        # Comparar la contraseña proporcionada con la almacenada
        return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password.encode('utf-8'))

# Ejemplo de uso:
# service = UsersService()
# service.create_user(schemas.UserCreate(username="Alejandro", email="alejandro@example.com", password="mypassword", firstName="Alejandro", lastName="Gomez"))
