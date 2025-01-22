from fastapi import APIRouter, FastAPI, UploadFile, Form, HTTPException, Depends
from app.database import Database
from app.readimage import save_image


router = APIRouter()

async def get_database() -> Database: # type: ignore

    db = Database()
    await db.connect()
    try:
        yield db
    finally:
        await db.close()

@router.post('/upload-image/')
async def upload_image(
        title: str = Form(...),
        subtitle: str = Form(...),
        content: str = Form(...),
        file: UploadFile = Form(...),
        db: Database = Depends(get_database)
):
    try:
        # Проверка, что файл был передан
        if file is None:
            raise HTTPException(status_code=400, detail="Файл не был передан")

        # Проверка типа файла
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Файл должен быть изображением")

        # Сохранение изображения
        saved_path = save_image(file)
        print(f"Файл сохранен по пути: {saved_path}")

        file_url = f"/{saved_path}"
        print(f"URL файла: {file_url}")

        # Сохранение записи в базу данных
        rows_inserted = await db.insert_image_first_screen(title, subtitle, content, file_url)
        print(f"Количество вставленных строк: {rows_inserted}")

        if rows_inserted:
            return {"message": "Изображение и данные сохранены", "url": file_url}
        else:
            raise HTTPException(status_code=500, detail="Ошибка при сохранении данных в базу")
    except HTTPException as e:
        print(f"HTTPException: {e.detail}")
        raise e
    except Exception as e:
        print(f"Общая ошибка: {str(e)}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")


@router.get('/first-images/')
async def get_first_screen_images(db: Database = Depends(get_database)):
    try: 
        images = await db.get_first_screen_images()
        if not images:
            raise HTTPException(status_code=404, detail="No images found")
        return {"images" : images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))