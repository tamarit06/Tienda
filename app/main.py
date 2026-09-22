from typing import List
import os

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app import models, schemas
from app.database import create_db_and_tables, get_session, engine
from app.auth import (
    crear_hash,
    verificar_password,
    crear_token,
    verificar_token
)


load_dotenv()


# ==================== CREAR ADMIN ====================

def crear_admin():
    admin_username = os.getenv("ADMIN_USERNAME")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_username or not admin_password:
        raise RuntimeError(
            "Faltan ADMIN_USERNAME o ADMIN_PASSWORD en el archivo .env"
        )

    with Session(engine) as session:

        admin_existente = session.exec(
            select(models.Admin).where(
                models.Admin.username == admin_username
            )
        ).first()

        if admin_existente:
            return

        admin = models.Admin(
            username=admin_username,
            password_hash=crear_hash(admin_password)
        )

        session.add(admin)
        session.commit()


# ==================== APP ====================

app = FastAPI(title="API Tienda de Combos")


# ==================== CORS ====================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== STARTUP ====================

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    crear_admin()


# ==================== LOGIN ====================

@app.post(
    "/login",
    response_model=schemas.Token
)
def login(
    data: schemas.LoginRequest,
    session: Session = Depends(get_session)
):
    admin = session.exec(
        select(models.Admin).where(
            models.Admin.username == data.username
        )
    ).first()

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Usuario o contraseña incorrectos"
        )

    if not verificar_password(
        data.password,
        admin.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Usuario o contraseña incorrectos"
        )

    token = crear_token(admin.username)

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ==================== AUTENTICACIÓN ====================

def obtener_admin(
    authorization: str | None = Header(default=None),
    session: Session = Depends(get_session)
):
    # 1. Comprobar que llegó el header Authorization

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="No estás autenticado"
        )

    # 2. Comprobar que tiene formato Bearer

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Token inválido"
        )

    # 3. Extraer solamente el JWT

    token = authorization.split(" ", 1)[1]

    # 4. Verificar el JWT

    try:
        username = verificar_token(token)

    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido o expirado"
        )

    # 5. Buscar el administrador en la base de datos

    admin = session.exec(
        select(models.Admin).where(
            models.Admin.username == username
        )
    ).first()

    # 6. Comprobar que el administrador todavía existe

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Administrador no encontrado"
        )

    # 7. Devolver el administrador

    return admin


# ==================== PRODUCTOS ====================


# ---------- CREAR PRODUCTO ----------

@app.post(
    "/productos",
    response_model=schemas.ProductoRead
)
def crear_producto(
    data: schemas.ProductoCreate,
    session: Session = Depends(get_session),
    admin: models.Admin = Depends(obtener_admin)
):
    producto = models.Producto(
        **data.dict()
    )

    session.add(producto)
    session.commit()
    session.refresh(producto)

    return producto


# ---------- LISTAR PRODUCTOS ----------

@app.get(
    "/productos",
    response_model=List[schemas.ProductoRead]
)
def listar_productos(
    session: Session = Depends(get_session)
):
    return session.exec(
        select(models.Producto)
    ).all()


# ---------- OBTENER UN PRODUCTO ----------

@app.get(
    "/productos/{producto_id}",
    response_model=schemas.ProductoRead
)
def obtener_producto(
    producto_id: int,
    session: Session = Depends(get_session)
):
    producto = session.get(
        models.Producto,
        producto_id
    )

    if not producto:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )

    return producto


# ---------- ACTUALIZAR PRODUCTO ----------

@app.put(
    "/productos/{producto_id}",
    response_model=schemas.ProductoRead
)
def actualizar_producto(
    producto_id: int,
    data: schemas.ProductoUpdate,
    session: Session = Depends(get_session),
    admin: models.Admin = Depends(obtener_admin)
):
    producto = session.get(
        models.Producto,
        producto_id
    )

    if not producto:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )

    cambios = data.dict(
        exclude_unset=True
    )

    for campo, valor in cambios.items():
        setattr(producto, campo, valor)

    session.add(producto)
    session.commit()
    session.refresh(producto)

    return producto


# ---------- ELIMINAR PRODUCTO ----------

@app.delete(
    "/productos/{producto_id}"
)
def eliminar_producto(
    producto_id: int,
    session: Session = Depends(get_session),
    admin: models.Admin = Depends(obtener_admin)
):
    producto = session.get(
        models.Producto,
        producto_id
    )

    if not producto:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )

    session.delete(producto)
    session.commit()

    return {
        "ok": True
    }