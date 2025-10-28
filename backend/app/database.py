from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DATABASE_URL = "sqlite:///./chat.db"
SQLALCHEMY_DATABASE_URL = "postgresql://chatapp_db_4u7d_user:OnOUd3A5HOabUNULe8TgB7fAGJlR7ph3@dpg-d407qm3e5dus7386p6gg-a:5432/chatapp_db_4u7d"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()