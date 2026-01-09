from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db, require_admin
from app.models import Form, Sector
from app.schemas.form import FormUpdateSchema

router = APIRouter(tags=["admin-forms"])


@router.get("/admin/forms")
def get_all_forms(
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
):
    return db.query(Form).all()


@router.post("/admin/forms")
def create_form(
    data: dict,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
):
    if not data.get("name") or not data.get("embed_url"):
        raise HTTPException(status_code=400, detail="Datos incompletos")

    form = Form(
        name=data["name"],
        embed_url=data["embed_url"],
        active=True
    )
    db.add(form)
    db.commit()
    db.refresh(form)
    return form


@router.put("/admin/forms/{form_id}")
def update_form(
    form_id: int,
    data: FormUpdateSchema,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Formulario inexistente")

    form.name = data.name
    form.embed_url = data.embed_url

    db.commit()
    db.refresh(form)

    return form


@router.post("/admin/forms/{form_id}/assign/{sector_id}")
def assign_form_to_sector(
    form_id: int,
    sector_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin)
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


@router.delete("/admin/forms/{form_id}/assign/{sector_id}")
def unassign_form(
    form_id: int,
    sector_id: int,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    sector = db.query(Sector).filter(Sector.id == sector_id).first()
    form = db.query(Form).filter(Form.id == form_id).first()

    if not sector or not form:
        raise HTTPException(status_code=404, detail="No encontrado")

    if form not in sector.forms:
        raise HTTPException(status_code=400, detail="No está asignado")

    sector.forms.remove(form)
    db.commit()

    return {"ok": True}
