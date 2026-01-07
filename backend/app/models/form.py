from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
from .associations import sector_forms

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
