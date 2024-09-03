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
    lastName = Required(str,column="lastName")
    role = Enum("Roles",["ADMIN", "STUDENT", "TEACHER"])
    _table_ = "Users"


class Student(db.Entity):
    id = PrimaryKey(uuid.UUID, auto=True)
    dni = Required(str)
    username = Required(str)
    email = Required(str)
    password = Required(str)
    firstName = Required(str, column="firstName")
    lastName = Required(str, column="lastName")
    encoding = Required(Json)
    _table_ = "Students"

