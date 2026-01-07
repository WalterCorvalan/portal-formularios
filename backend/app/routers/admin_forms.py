from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_admin
from app.models import Form
from app.schemas import FormCreateSchema

router = APIRouter(tags=["admin-forms"])

@router.get("/admin/forms")
def get_all_forms(
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    return db.query(Form).all()


@router.post("/admin/forms")
def create_form(
    data: FormCreateSchema,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    form = Form(**data.dict())
    db.add(form)
    db.commit()
    db.refresh(form)
    return form
