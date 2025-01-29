import os
from fastapi import UploadFile
from uuid import uuid4

def save_image(upload_file: UploadFile, folder: str = 'static/images') -> str:
    
    if not os.path.exists(folder):
        os.makedirs(folder)

    
    extension = upload_file.filename.split(".")[-1]
    unique_name = f"{uuid4().hex}.{extension}"

    
    file_path = os.path.join(folder, unique_name)

    try:
        
        with open(file_path, "wb") as f:
            f.write(upload_file.file.read())
    except Exception as e:
        raise RuntimeError(f"Ошибка при сохранении файла: {e}")

    return file_path

def save_equipment(upload_file: UploadFile, folder: str = 'static/equipment') -> str:
    
    if not os.path.exists(folder):
        os.makedirs(folder)

    
    extension = upload_file.filename.split(".")[-1]
    unique_name = f"{uuid4().hex}.{extension}"

    
    file_path = os.path.join(folder, unique_name)

    try:
        
        with open(file_path, "wb") as f:
            f.write(upload_file.file.read())
    except Exception as e:
        raise RuntimeError(f"Ошибка при сохранении файла: {e}")

    return file_path

def save_materials(upload_file: UploadFile, folder: str = 'static/materials') -> str:
    
    if not os.path.exists(folder):
        os.makedirs(folder)

    
    extension = upload_file.filename.split(".")[-1]
    unique_name = f"{uuid4().hex}.{extension}"

    
    file_path = os.path.join(folder, unique_name)

    try:
        
        with open(file_path, "wb") as f:
            f.write(upload_file.file.read())
    except Exception as e:
        raise RuntimeError(f"Ошибка при сохранении файла: {e}")

    return file_path