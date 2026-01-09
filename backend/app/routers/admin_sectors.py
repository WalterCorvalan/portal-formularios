from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db, require_admin
from app.models import Sector
from app.security import hash_password

router = APIRouter(
    prefix="/admin/sectors",
    tags=["admin-sectors"]
)

# ✅ LISTAR SECTORES + FORMULARIOS ASIGNADOS
@router.get("")
def get_sectors(
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    sectors = db.query(Sector).all()

    return [
        {
            "id": sector.id,
            "name": sector.name,
            "active": sector.active,
            "forms": [
                {
                    "id": form.id,
                    "name": form.name,
                    "embed_url": form.embed_url,
                    "active": form.active
                }
                for form in sector.forms
            ]
        }
        for sector in sectors
    ]


# ✅ CREAR SECTOR
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

    return {
        "id": sector.id,
        "name": sector.name,
        "active": sector.active
    }

# ❌ ELIMINAR SECTOR
@router.delete("/{sector_id}")
def delete_sector(
    sector_id: int,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    sector = db.query(Sector).filter(Sector.id == sector_id).first()

    if not sector:
        raise HTTPException(status_code=404, detail="Sector no encontrado")


    db.delete(sector)
    db.commit()

    return {"ok": True}


