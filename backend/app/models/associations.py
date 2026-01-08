from sqlalchemy import Table, Column, ForeignKey
from app.database import Base

sector_forms = Table(
    "sector_forms",
    Base.metadata,
    Column("sector_id", ForeignKey("sectors.id"), primary_key=True),
    Column("form_id", ForeignKey("forms.id"), primary_key=True),
)