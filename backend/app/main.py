from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.deps import get_db
from app.models import Sector
from app.security import verify_password, create_access_token
from app.routers import forms, admin_auth, admin_sectors, admin_forms

app = FastAPI()

# 🔥 CORS BIEN CONFIGURADO
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],   # 👈 incluye OPTIONS
    allow_headers=["*"],   # 👈 incluye Authorization
)

@app.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    sector = db.query(Sector).filter(
        Sector.name == data["user"],
        Sector.active == True
    ).first()

    if not sector:
        raise HTTPException(status_code=401, detail="Sector inexistente")

    if not verify_password(data["password"], sector.password_hash):
        raise HTTPException(status_code=401, detail="Password incorrecto")

    token = create_access_token({
        "sector_id": sector.id,
        "sector": sector.name,
        "role": "sector"
    })

    return {"token": token}

# 📦 Routers
app.include_router(forms.router)
app.include_router(admin_auth.router)
app.include_router(admin_sectors.router)
app.include_router(admin_forms.router)
