from typing import Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, Query, Depends, HTTPException
from pony.orm import db_session, desc, select
from pydantic import BaseModel
from src import models
from src.models import Roles, Student
from src.services.user_services import UsersService
from src.controllers.auth_controller import get_current_user

router = APIRouter()
user_service = UsersService()


@db_session
def get_students(
    page: int = Query(1, ge=1, description="Número de página"),
    count: int = Query(
        10, ge=1, le=100, description="Número de usuarios por página"),
    sort: Optional[str] = Query(
        None, description="Ordenar por campo (e.g., 'username', 'email')"),
    order: Optional[str] = Query(
        "asc", regex="^(asc|desc)$", description="Orden asc o desc"),
    role: Optional[models.Roles] = Query(None, description="Filtrar por rol")
):
    query = select(s for s in models.Student)

    if sort:
        if order == "asc":
            query = query.order_by(lambda s: getattr(s, sort))
        else:
            query = query.order_by(lambda u: desc(getattr(u, sort)))

    students = query.page(page, count)
    total = query.count()

    students_conversion = [
        {key: str(value) if isinstance(value, UUID)
            else value for key, value in student.to_dict().items()}
        for student in students
    ]
    return {
        "page": page,
        "count": len(students_conversion),
        "total": total,
        "users": students_conversion,
    }


@router.get("/")
async def get_users(token: str = Depends(get_current_user),
                    page: int = Query(1, ge=1, description="Número de página"),
                    count: int = Query(
        10, ge=1, le=100, description="Número de usuarios por página"),
    sort: str | None = Query(
        None, description="Sort by field (e.g., 'username', 'email')"),
    order: str | None = Query(
        "asc", regex="^(asc|desc)$", description="Ordena de forma asc o desc"),
    role: Roles | None = Query(None, description="Filtrar por rol"),
):
    try:
        if role == Roles.STUDENT:
            list_of_students = get_students(page, count, sort, role)
            return list_of_students
        else:
            list_of_users = user_service.get_users(
                page, count, sort, order, role)
            print(list_of_users)
            return list_of_users
    except:
        raise HTTPException(
            status_code=401, detail="Token inválido o expirado")


class StudentCreateRequest(BaseModel):
    dni: str
    email: Optional[str] = None
    firstName: str
    lastName: str

# POST endpoint to create a student


@router.post("/student")
@db_session
def create_student(student_request: StudentCreateRequest):
    # Check if student with same dni already exists
    if Student.get(dni=student_request.dni):
        raise HTTPException(
            status_code=400, detail="Student with this DNI already exists")

    # Create and save the new student
    student = Student(
        id=uuid4(),
        dni=student_request.dni,
        email=student_request.email,
        firstName=student_request.firstName,
        lastName=student_request.lastName
    )

    return {
        "id": str(student.id),
        "dni": student.dni,
        "email": student.email,
        "firstName": student.firstName,
        "lastName": student.lastName
    }
