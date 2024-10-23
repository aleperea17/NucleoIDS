import uuid
from pony.orm import *
from enum import Enum
from datetime import date
from src.db import db

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
    role = Required(str)
    _table_ = "Users"

class Student(db.Entity):
    id = PrimaryKey(uuid.UUID, auto=True)
    dni = Required(str, unique=True)
    email = Optional(str)
    firstName = Required(str, column="firstName")
    lastName = Required(str, column="lastName")
    encoding = Optional("Encoding")
    courses = Set("Course")
    attendance = Set("Attendance")
    _table_ = "Students"

class Encoding(db.Entity):
    id = PrimaryKey(uuid.UUID, auto=True)
    data = Required(str)
    student = Optional("Student")
    _table_ = "Encodings"

class Teacher(db.Entity):
    id = PrimaryKey(uuid.UUID, auto=True)
    dni = Required(str, unique=True)
    firstName = Required(str, column="firstName")  
    lastName = Required(str, column="lastName")    
    email = Required(str, unique=True)             
    phone = Required(str, column="phone")          
    address = Required(str, column="address")      
    hire_date = Required(date, column="hire_date") 
    course = Optional("Course")        
    _table_ = "Professors"

class Course(db.Entity):
    id = PrimaryKey(uuid.UUID, auto=True)
    course_name = Required(str)
    students = Set("Student")
    teacher = Optional(Teacher)
    attendance = Set("Attendance")
    _table_ = "Courses"

class Attendance(db.Entity):
    id = PrimaryKey(uuid.UUID, auto=True)
    date = Required(date, column="date")
    value = Required(bool, column="value")
    student = Required(Student)
    course = Required(Course)
    _table_ = "Attendances"
