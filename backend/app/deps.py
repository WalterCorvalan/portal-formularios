from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from jose import jwt
from .database import SessionLocal
from .security import SECRET_KEY, ALGORITHM

# 🔐 OAuth
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# 🗄️ DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔐 Admin guard
def require_admin(token: str = Depends(oauth2_scheme)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")

    return payload

def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")

    return payload