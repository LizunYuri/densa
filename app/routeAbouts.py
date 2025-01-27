from fastapi import APIRouter,  FastAPI, UploadFile, Form, HTTPException, Depends
from typing import Optional
from app.database import Database
from app.readimage import save_image
import os

os.makedirs("static/images", exist_ok=True)

router = APIRouter()

async def get_database() -> Database: # type: ignore

    db = Database()
    await db.connect()
    try:
        yield db
    finally:
        await db.close()


@router.get('/equipment/')
async def get_equipment(db: Database = Depends(get_database)):
    try:
        equipments = await db.get_equipment_records()
        if  not equipments:
            raise HTTPException(status_code=404, detail="No equipments found")
        return {"equipments" : equipments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))