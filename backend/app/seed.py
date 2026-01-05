from .database import SessionLocal
from .models import Sector
from .security import hash_password


db = SessionLocal()

sector = Sector(
    name="ventas",
    password_hash=hash_password("123")
)

db.add(sector)
db.commit()
db.close()

print("Sector ventas creado")
