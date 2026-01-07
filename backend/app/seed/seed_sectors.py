from app.database import SessionLocal
from app.models import Sector
from app.security import hash_password

db = SessionLocal()

sectors = [
    ("ventas", "123"),
    ("deposito", "123"),
    ("admin", "admin123")
]

for name, password in sectors:
    exists = db.query(Sector).filter(Sector.name == name).first()
    if not exists:
        db.add(Sector(
            name=name,
            password_hash=hash_password(password),
            active=True
        ))

db.commit()
print("✅ Sectores creados")
