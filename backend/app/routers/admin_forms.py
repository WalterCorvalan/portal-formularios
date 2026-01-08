from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_admin
from app.models import Form, Sector

router = APIRouter(tags=["admin-forms"])


@router.get("/admin/forms")
def get_all_forms(
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    return db.query(Form).all()


@router.post("/admin/forms")
def create_form(
    data: dict,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    form = Form(
        name=data["name"],
        embed_url=data["embed_url"],
        active=True
    )
    db.add(form)
    db.commit()
    db.refresh(form)
    return form


# 🚀 NUEVO: ASIGNAR FORM A SECTOR
@router.post("/admin/forms/{form_id}/assign/{sector_id}")
def assign_form_to_sector(
    form_id: int,
    sector_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Formulario inexistente")

    sector = db.query(Sector).filter(
        Sector.id == sector_id,
        Sector.active == True
    ).first()

    if not sector:
        raise HTTPException(status_code=404, detail="Sector inexistente")

    if form in sector.forms:
        raise HTTPException(status_code=400, detail="Formulario ya asignado")

    sector.forms.append(form)
    db.commit()

    return {"ok": True}
 