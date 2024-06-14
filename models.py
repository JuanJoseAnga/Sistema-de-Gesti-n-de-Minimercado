from sqlalchemy import String, Integer, Column
from database import Base 


class Ingreso(Base):
    __tablename__="registrodeingreso"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(30))
    mail = Column(String(30))
    password = Column(String(30))

