from fastapi import APIRouter,  FastAPI, UploadFile, Form, HTTPException, Depends, Body
from typing import Optional
from app.database import Database
from app.readimage import save_materials
from app.auth import get_current_user
import aiosmtplib
from email.message import EmailMessage
from app.config import SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_RECIPIENT, SMTP_USER
import os
import logging





os.makedirs("static/materials", exist_ok=True)

router = APIRouter()




async def send_email(
        recipient: str,
        subject: str,
        body: str):
    

    email = EmailMessage()
    email["From"] = SMTP_USER
    email["To"] = recipient
    email["Subject"] = subject
    email.set_content(body)
    

    try:
        await aiosmtplib.send(
            email,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASSWORD,
            use_tls=False, 
            timeout=30 
            )
        
        print('Письмо успешно отправлено')
    except Exception as e:
        print(f"Ошибка отправки письма: {e}")
        raise HTTPException(status_code=500, detail="Не удалось отправить письмо")



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
        is_ofer: bool = Body(...),  
        db: Database = Depends(get_database)
):
    try:
        # Вставляем данные в базу
        rows_inserted = await db.insert_clients(name, phone, is_ofer)
        print(f"Количество вставленных строк: {rows_inserted}")


        subject = f'Заявка с сайта от {name}'
        recipient = "robot@денса.рф"
        body = f""" 
                Здравствуйте, 
                {name} оставил заявку. 
                номер телефона: {phone}
                Согласие на обработку данных.
                {"Да" if is_ofer else "Нет"}
                """
        await send_email(
            recipient= 'yu.lizun@yandex.ru',
            subject= subject,
            body = body,
            )
        
        logging.basicConfig(level=logging.DEBUG)
        
        return {"message": "Данные клиента добавлены и отправлены на почту"}

    except HTTPException as e:
        print(f"HTTPException: {e.detail}")
        raise e
    except Exception as e:
        print(f"Общая ошибка: {str(e)}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")




@router.get('/clients/')
async def get_clients(
    current_user : dict = Depends(get_current_user),
    db: Database = Depends(get_database)):
    try:
        clients = await db.get_clients_records()
        if  not clients:
            raise HTTPException(status_code=404, detail="No materials found")
        return {"clients" : clients}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))