from fastapi import APIRouter, Query, Depends, HTTPException
from ...src.models import Roles
from ...src.services.user_services import UsersService
from .auth_controller import get_current_user

router = APIRouter()
user_service = UsersService()


@router.get("/")
async def get_users(token:str = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Número de página"),
    count: int = Query(
        10, ge=1, le=100, description="Número de usuarios por página"),
    sort: str | None = Query(
        None, description="Sort by field (e.g., 'username', 'email')"),
    order: str | None = Query(
        "asc", regex="^(asc|desc)$", description="Ordena de forma asc o desc"),
    role: Roles | None = Query(None, description="Filtrar por rol"),):
    list_of_users = user_service.get_users(page, count, sort, order, role)
    try:
        return list_of_users
    except:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
