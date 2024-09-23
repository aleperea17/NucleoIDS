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
    role = Required(str)
    _table_ = "Users"


class Student(db.Entity):
    id = PrimaryKey(uuid.UUID, auto=True)
    dni = Required(str, unique=True)
    email = Optional(str)
    firstName = Required(str, column="firstName")
    lastName = Required(str, column="lastName")
    encoding = Optional("Encoding")
    _table_ = "Students"

class Encoding(db.Entity):
    id = PrimaryKey(uuid.UUID, auto=True)
    data = Required(str)
    student = Optional("Student")
    _table_ = "Encodings"

