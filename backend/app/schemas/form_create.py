from pydantic import BaseModel

class FormCreateSchema(BaseModel):
    name: str
    embed_url: str
    active: bool = True
