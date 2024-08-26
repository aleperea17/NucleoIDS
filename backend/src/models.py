import uuid
from pony.orm import *
from enum import Enum
from .db import db

<<<<<<< Updated upstream
=======

class Roles(str, Enum):
    ADMIN = "ADMIN"
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"


>>>>>>> Stashed changes
class User(db.Entity):
    id = PrimaryKey(uuid.UUID, auto=True)
    username = Required(str)
    email = Required(str)
    password = Required(str)
    firstName = Required(str, column="firstName")
<<<<<<< Updated upstream
    lastName = Required(str,column="lastName")
    role = Enum("Roles",["ADMIN", "STUDENT", "TEACHER"])
    _table_ = "Users"

=======
    lastName = Required(str, column="lastName")
    role = Required(Roles, default=Roles.STUDENT)
    _table_ = "Users"
>>>>>>> Stashed changes
