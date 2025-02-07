from fastapi import FastAPI, Request, UploadFile, Depends, HTTPException, Body
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from .database import Database
from app.auth import router as auth_router
from app.routeImage import router as image_router
from app.routeAbouts import router as about_router
from app.routeMaterials import router as materials_router
from app.routeClients import router as clients_router
from app.routeGallery import router as gallery_router
from app.models import CompanyUpdate
from app.auth import get_current_user

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")



templates = Jinja2Templates(directory='templates')


app.mount('/static', StaticFiles(directory='static'), name='static')


db = Database()

async def get_database() -> Database:  # type: ignore

    db = Database()
    await db.connect()
    try:
        yield db
    finally:
        await db.close()


@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.close()

app.include_router(auth_router, prefix="/auth", tags=['Authentification'])
app.include_router(image_router, prefix="/img", tags=['Images'])
app.include_router(about_router, prefix='/about', tags=["Abouts"])
app.include_router(materials_router, prefix='/materials', tags=["Materials"])
app.include_router(clients_router, prefix='/clients', tags=["Clients"])
app.include_router(gallery_router, prefix='/gallery', tags=["Gallery"])


@app.get('/', response_class=HTMLResponse)
def read_root(request: Request):

    return templates.TemplateResponse('index.html', {"request" : request})


@app.get('/api/seo')
async def get_lasted_seo():

    """Получение сео информации для вставки в мета теги на странице"""


    seo_record = await db.get_latest_seo_record()
    if not seo_record:
        return HTTPException(status_code=404, detail='No SEO Record')
    
    return {
        'id' : seo_record[0],
        'title' : seo_record[1],
        'description' : seo_record[2],
        'keywords' : seo_record[3],
        'created_at' : seo_record[4]
        }

@app.get('/api/company')
async def get_company_info():


    company_info = await db.get_lasted_company_record()

    if not company_info:
        return HTTPException(status_code=404, detail="Error receiving company info")
    
    return{
            'id' : company_info[0],
            'name' : company_info[1],
            'phone1' : company_info[2],
            'phone2' : company_info[3],
            'email' : company_info[4],
            'address' : company_info[5],
            'tin' : company_info[6],
            'legal_name' : company_info[7],
            'whatsap' : company_info[9],
            'telegram' : company_info[10],
            'vk' : company_info[11]
        }


@app.put('/api/company/{table}/{id}/')
async def update_company_info(
    table: str,
    id : str,
    update_data: CompanyUpdate,
    current_user: dict = Depends(get_current_user),
    db: Database = Depends(get_database)
    ):
    
    record = await db.get_record_id(table, id)

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    success = await db.update_record(table, id, update_data.dict()) 
    

    if not success:
        raise HTTPException(
            status_code=500, detail="Failed to update the record in the database"
        )
    return {"message": "Record updated successfully"}