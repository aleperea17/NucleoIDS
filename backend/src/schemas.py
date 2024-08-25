from pydantic import BaseModel

class BaseUser(BaseModel):
    username: str
    email:str 
    firstName : str
    lastName: str

    class Config:
        #antes orm_mode=True
        from_attributes=True

class UserCreate(BaseUser):
    password:str

# Modelo de entrada
class LoginRequest(BaseModel):
    username: str | None= None
    email: str | None = None
    password: str 