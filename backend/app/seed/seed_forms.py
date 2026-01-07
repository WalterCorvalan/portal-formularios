from app.database import SessionLocal
from app.models import Sector, Form

db = SessionLocal()

# Traemos sector ventas
ventas = db.query(Sector).filter(Sector.name == "ventas").first()

if not ventas:
    print("❌ Sector ventas no existe")
    exit()

# Crear formularios
form1 = Form(
    name="Formulario Ventas",
    embed_url="https://noteforms.com/forms/ventas-001",
    active=True
)

form2 = Form(
    name="Formulario Reclamos",
    embed_url="https://noteforms.com/forms/reclamos-ventas",
    active=True
)

# Asociarlos al sector
ventas.forms.append(form1)
ventas.forms.append(form2)

db.add_all([form1, form2])
db.commit()
db.close()

print("✅ Formularios creados y asignados a ventas")
