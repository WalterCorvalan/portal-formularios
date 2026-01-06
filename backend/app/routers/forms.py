from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt

from app.deps import get_db
from app.models import Sector
from app.deps import oauth2_scheme
from app.security import SECRET_KEY, ALGORITHM


router = APIRouter()

@router.get("/forms")
def get_forms(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    sector_id = payload.get("sector_id")

    sector = db.query(Sector).filter(
        Sector.id == sector_id,
        Sector.active == True
    ).first()

    if not sector:
        raise HTTPException(status_code=403)

    return sector.forms
