import uuid
from pony.orm import *
from enum import Enum
from .db import db


class Roles(str, Enum):
    ADMIN = "ADMIN"
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"


class User(db.Entity):
    id = PrimaryKey(uuid.UUID, auto=True)
    username = Required(str)
    email = Required(str)
    password = Required(str)
    firstName = Required(str, column="firstName")
    lastName = Required(str, column="lastName")
    role = Required(Roles, default=Roles.STUDENT)
    _table_ = "Users"




