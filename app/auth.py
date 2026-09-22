import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import jwt, JWTError
from pwdlib import PasswordHash

load_dotenv()

password_hash = PasswordHash.recommended()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


def crear_hash(password: str) -> str:
    return password_hash.hash(password)


def verificar_password(
    password: str,
    password_hash_guardado: str
) -> bool:
    return password_hash.verify(
        password,
        password_hash_guardado
    )


def crear_token(username: str) -> str:

    if not SECRET_KEY:
        raise RuntimeError(
            "Falta SECRET_KEY en el archivo .env"
        )

    datos = {
        "sub": username,
        "exp": datetime.now(timezone.utc)
        + timedelta(hours=2)
    }

    return jwt.encode(
        datos,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def verificar_token(token: str) -> str:

    if not SECRET_KEY:
        raise RuntimeError(
            "Falta SECRET_KEY en el archivo .env"
        )

    try:
        datos = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = datos.get("sub")

        if not username:
            raise ValueError(
                "Token sin usuario"
            )

        return username

    except (JWTError, ValueError):
        raise ValueError(
            "Token inválido"
        )