from sqlalchemy import Column, Integer, String, Boolean, Table, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

sector_forms = Table(
    "sector_forms",
    Base.metadata,
    Column("sector_id", ForeignKey("sectors.id"), primary_key=True),
    Column("form_id", ForeignKey("forms.id"), primary_key=True),
)

class Sector(Base):
    __tablename__ = "sectors"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    active = Column(Boolean, default=True)

    forms = relationship(
        "Form",
        secondary=sector_forms,
        back_populates="sectors"
    )

class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    embed_url = Column(String(255), nullable=False)
    active = Column(Boolean, default=True)

    sectors = relationship(
        "Sector",
        secondary=sector_forms,
        back_populates="forms"
    )
