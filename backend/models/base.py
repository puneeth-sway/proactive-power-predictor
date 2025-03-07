
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

# Global Session variable
Session = None

def init_db(db_path='sqlite:///data.db'):
    """Initialize the database and return the engine"""
    global Session
    engine = create_engine(db_path)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return engine

def get_session(engine):
    """Get a session for the database"""
    session_maker = sessionmaker(bind=engine)
    return session_maker()
