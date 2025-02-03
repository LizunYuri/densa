from fastapi import APIRouter,  FastAPI, UploadFile, Form, HTTPException, Depends, Body
from typing import Optional
from app.database import Database
from app.readimage import save_materials
import os

os.makedirs("static/materials", exist_ok=True)

router = APIRouter()

async def get_database() -> Database: # type: ignore

    db = Database()
    await db.connect()
    try:
        yield db
    finally:
        await db.close()



@router.post('/upload/')
async def upload_client_data(
        name: str = Body(...),
        phone: str = Body(...),
        is_ofer: bool = Body(...),  # Принять как bool
        db: Database = Depends(get_database)
):
    try:
        # Вставляем данные в базу
        rows_inserted = await db.insert_clients(name, phone, is_ofer)
        print(f"Количество вставленных строк: {rows_inserted}")

    except HTTPException as e:
        print(f"HTTPException: {e.detail}")
        raise e
    except Exception as e:
        print(f"Общая ошибка: {str(e)}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")




@router.get('/clients/')
async def get_clients(db: Database = Depends(get_database)):
    try:
        clients = await db.get_clients_records()
        if  not clients:
            raise HTTPException(status_code=404, detail="No materials found")
        return {"clients" : clients}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

   
# @router.delete("/delete/{table}/{record_id}/")
# async def delete_materials(table: str, record_id: int, db: Database = Depends(get_database)):
    
#     record = await db.get_record_id(table, record_id)
#     if not record:
#         raise HTTPException(status_code=404, detail=f"Record with ID {record_id} not found in table {table}")

#     if not isinstance(record, dict):
#         raise HTTPException(status_code=500, detail="Unexpected data format: record is not a dictionary")

    
#     image_path = record.get("url")
#     if not image_path:
#         raise HTTPException(status_code=404, detail="Image path not found in record")

#     if os.path.exists(image_path):
#         try:
#             os.remove(image_path)
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Failed to delete image: {str(e)}")

    
#     deletion_success = await db.delete_record(table, record_id)
#     if not deletion_success:
#         raise HTTPException(status_code=500, detail="Failed to delete record from database")

#     return {"message": f"Запись удалена!"}


# @router.put("/update/{table}/{record_id}/")
# async def update_record_data(
#     table: str,
#     record_id: str,
#     title: str = Form(...),
#     content: str =Form(...),
#     file: UploadFile = None,
#     db: Database = Depends(get_database)
# ):
    
#     record = await db.get_record_id(table, record_id)
#     if not record:
#         raise HTTPException(status_code=404, detail="Record not found")
    
    
#     old_file_path = record.get('url')

#     print(old_file_path)

   
#     update_data = {
#         "title": title,
#         "content" : content,

#     }

#     print(f"Получен запрос на обновление записи {record_id} в таблице {table}")
#     print(f"title: {title}, ")
#     if file:
#         print(f"Файл получен: {file.filename}")
#     else:
#         print("Файл не получен")
    

    
#     if file:
#         try:
            
#             if old_file_path and os.path.exists(old_file_path):
#                 os.remove(old_file_path)

            
#             new_file_path = f"static/materials/{file.filename}"  
#             with open(new_file_path, "wb") as f:
#                 f.write(await file.read())

            
#             update_data["url"] = new_file_path

#         except Exception as e:
#             raise HTTPException(
#                 status_code=500, detail=f"Failed to process the file: {str(e)}"
#             )
#     else:
        
#         update_data["url"] = old_file_path

    
#     success = await db.update_record(table, record_id, update_data)
#     if not success:
#         raise HTTPException(
#             status_code=500, detail="Failed to update the record in the database"
#         )
#     return {"message": "Record updated successfully"}


# @router.get('/{table}/{record_id}/')
# async def get_materials(table: str, record_id: int, db: Database = Depends(get_database)):
    
#     try:
#         record = await db.get_record_id(table, record_id)

#         if not record:
#             raise HTTPException(status_code=404, detail="No record found")
#         return {'record' : record}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
