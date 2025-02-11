#!/usr/bin/env python3

import os
from pathlib import Path
from fastapi import FastAPI, Request, UploadFile, Depends, HTTPException, Body
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from database import Database
from auth import router as auth_router
from routeImage import router as image_router
from routeAbouts import router as about_router
from routeMaterials import router as materials_router
from routeClients import router as clients_router
from routeGallery import router as gallery_router
from models import CompanyUpdate
from auth import get_current_user

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "www/static"

app = FastAPI()

@app.get("/")
async def serve_react():
    index_file = BASE_DIR / "www/index.html"
    return FileResponse(index_file)


@app.get("/login")
async def serve_react_routes():
    index_file = BASE_DIR / "www/index.html"
    return FileResponse(index_file)


@app.get("/dashboard")
async def serve_react_routes():
    index_file = BASE_DIR / "www/index.html"
    return FileResponse(index_file)



@app.get("/robots.txt")
async def serve_robots():
    robots_file = STATIC_DIR / "robots.txt"
    if robots_file.exists():
        return FileResponse(robots_file)
    return JSONResponse(content={"error": "robots.txt not found"}, status_code=404)


@app.get("/sitemap.xml")
async def serve_sitemap():
    sitemap_file = STATIC_DIR / "sitemap.xml"
    if sitemap_file.exists():
        return FileResponse(sitemap_file)
    return JSONResponse(content={"error": "sitemap.xml not found"}, status_code=404)


@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    react_404_page = STATIC_DIR / "404.html"
    if react_404_page.exists():
        return FileResponse(react_404_page)
    return JSONResponse(content={"error": "Page not found"}, status_code=404)


@app.head("/")
async def read_root_head():
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host=os.environ.get("APP_IP"), 
        port=int(os.environ.get("APP_PORT"))
    )



app.mount("/static", StaticFiles(directory="static"), name="static")


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
            'id' : company_info['id'],
            'name' : company_info['name'],
            'phone1' : company_info['phone1'],
            'phone2' : company_info['phone2'],
            'email' : company_info['email'],
            'address' : company_info['address'],
            'tin' : company_info['tin'],
            'legal_name' : company_info['legal_name'],
            'whatsap' : company_info['whatsap'],
            'telegram' : company_info['telegram'],
            'vk' : company_info['vk']
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