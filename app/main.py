from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from .database import Database

app = FastAPI()

templates = Jinja2Templates(directory='templates')


app.mount('/static', StaticFiles(directory='static'), name='static')


db = Database()


@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.close()



# @app.get("/db")
# async def read_db_data():
#     """Пример асинхронного запроса к базе данных"""
#     result = await db.execute("SELECT NOW();")  # Запрос для проверки
#     return {"message": "Data from MySQL", "result": result}

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
