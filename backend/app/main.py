from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt

from .deps import get_db
from .models import Sector
from .security import verify_password, create_access_token, SECRET_KEY, ALGORITHM

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@app.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    sector = db.query(Sector).filter(Sector.name == data["user"]).first()

    if not sector:
        raise HTTPException(status_code=401, detail="Sector inexistente")

    if not verify_password(data["password"], sector.password_hash):
        raise HTTPException(status_code=401, detail="Password incorrecto")

    token = create_access_token({"sector_id": sector.id, "sector": sector.name})
    return {"token": token}


@app.get("/forms")
def get_forms(token: str = Depends(oauth2_scheme)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    sector = payload.get("sector")

    if sector != "ventas":
        raise HTTPException(status_code=403)

    return [
        {
            "id": 1,
            "name": "Formulario Ventas",
            "embed_url": "https://noteforms.com/forms/xxxx"
        }
    ]
