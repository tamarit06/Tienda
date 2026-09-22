from typing import Optional
from sqlmodel import SQLModel


class ProductoCreate(SQLModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    disponible: bool = True


class ProductoUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = None
    disponible: Optional[bool] = None


class ProductoRead(SQLModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    disponible: bool

class LoginRequest(SQLModel):
    username: str
    password: str
    
class Token(SQLModel):
    access_token: str
    token_type: str