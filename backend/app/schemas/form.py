from pydantic import BaseModel

class FormOut(BaseModel):
    id: int
    name: str
    embed_url: str
    active: bool

    class Config:
        orm_mode = True
