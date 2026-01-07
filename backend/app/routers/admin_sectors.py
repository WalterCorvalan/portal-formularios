from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db, require_admin
from app.models import Sector
from app.security import hash_password

router = APIRouter(
    prefix="/admin/sectors",
    tags=["admin-sectors"]
)

@router.post("")
def create_sector(
    data: dict,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    if db.query(Sector).filter(Sector.name == data["name"]).first():
        raise HTTPException(status_code=400, detail="Sector ya existe")

    sector = Sector(
        name=data["name"],
        password_hash=hash_password(data["password"]),
        active=True
    )

    db.add(sector)
    db.commit()
    db.refresh(sector)

    return sector
