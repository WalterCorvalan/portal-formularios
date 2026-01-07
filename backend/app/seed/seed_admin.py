from app.database import SessionLocal
from app.models import Admin
from app.security import hash_password

db = SessionLocal()

admin = Admin(
    username="admin",
    password_hash=hash_password("admin123")
)

db.add(admin)
db.commit()
db.close()

print("✅ Admin creado")
