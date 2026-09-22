from sqlmodel import SQLModel, create_engine, Session

# La base de datos se guarda como un archivo local: tienda.db
DATABASE_URL = "sqlite:///./tienda.db"

# check_same_thread=False es necesario porque FastAPI puede usar varios threads
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


def create_db_and_tables():
    """Crea las tablas en el archivo tienda.db si no existen."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependencia de FastAPI: entrega una sesión de base de datos por request."""
    with Session(engine) as session:
        yield session
