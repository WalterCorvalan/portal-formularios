from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db
from app.models import Admin
from app.security import verify_password, create_access_token

router = APIRouter(prefix="/admin", tags=["admin-auth"])

@router.post("/login")
def admin_login(data: dict, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(
        Admin.username == data["username"],
        Admin.active == True
    ).first()

    if not admin or not verify_password(data["password"], admin.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_access_token({
        "admin_id": admin.id,
        "role": "admin"
    })

    return {"token": token}
