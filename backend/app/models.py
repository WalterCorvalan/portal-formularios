from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Sector(Base):
    __tablename__ = "sectors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    password_hash = Column(String(255))
    active = Column(Boolean, default=True)

    forms = relationship("SectorForm", back_populates="sector")


class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    embed_url = Column(String(500))
    active = Column(Boolean, default=True)

    sectors = relationship("SectorForm", back_populates="form")


class SectorForm(Base):
    __tablename__ = "sector_forms"

    sector_id = Column(Integer, ForeignKey("sectors.id"), primary_key=True)
    form_id = Column(Integer, ForeignKey("forms.id"), primary_key=True)

    sector = relationship("Sector", back_populates="forms")
    form = relationship("Form", back_populates="sectors")
