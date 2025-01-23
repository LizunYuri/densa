from fastapi import APIRouter,  FastAPI, UploadFile, Form, HTTPException, Depends
from typing import Optional
from app.database import Database
from app.readimage import save_image
import os


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
    

@router.delete("/delete/{table}/{record_id}/")
async def delete_image(table: str, record_id: int, db: Database = Depends(get_database)):
    
    record = await db.get_record_id(table, record_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Record with ID {record_id} not found in table {table}")

    if not isinstance(record, dict):
        raise HTTPException(status_code=500, detail="Unexpected data format: record is not a dictionary")

    
    image_path = record.get("url")
    if not image_path:
        raise HTTPException(status_code=404, detail="Image path not found in record")

    if os.path.exists(image_path):
        try:
            os.remove(image_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to delete image: {str(e)}")

    
    deletion_success = await db.delete_record(table, record_id)
    if not deletion_success:
        raise HTTPException(status_code=500, detail="Failed to delete record from database")

    return {"message": f"Запись удалена!"}


@router.get('/{table}/{record_id}/')
async def get_image(table: str, record_id: int, db: Database = Depends(get_database)):
    
    try:
        record = await db.get_record_id(table, record_id)

        if not record:
            raise HTTPException(status_code=404, detail="No record found")
        return {'record' : record}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.put("/update/{table}/{record_id}/")
async def update_record_data(
                             record_id: str,
                             update_data: dict,
                             new_file: Optional[UploadFile] = None,
                             db : Database = Depends(get_database)
                             ):
    table = 'firstscreen',
    record = await db.get_record_id(table, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    old_file_path = record.get('url')

    if new_file:
        try:
            if old_file_path and os.path.exists(old_file_path):
                os.remove(old_file_path)


            new_file_path = f"images/{new_file.filename}"  
            with open(new_file_path, "wb") as f:
                f.write(await new_file.read())

            update_data["url"] = new_file_path

        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to process the file: {str(e)}"
            )  

    else:
        update_data['url'] = old_file_path 

    success = await db.update_record(table, record_id, update_data)
    if not success:
        raise HTTPException(
            status_code=500, detail="Failed to update the record in the database"
        )
    return {"message": "Record updated successfully"}

        

