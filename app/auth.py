from fastapi import APIRouter, HTTPException, Depends, Response, Request
from jose import JWSError, jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import datetime, timedelta
from app.database import Database


SECRET_KEY = 'ABvpdgpMtOFlRVHkHVZImd9QJ_coS'
ALGORITHM ='HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 120


router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class LoginRequest(BaseModel):
    username: str
    password: str


async def get_database() -> Database: # type: ignore
    db = Database()
    await db.connect()
    try:
        yield db
    finally:
        await db.close()


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expirie = datetime.utcnow() + expires_delta
    else:
        expirie = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp" : expirie})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


@router.post('/login')
async def login(request: LoginRequest, response: Response, db: Database = Depends(get_database)):
    user = await db.get_user_by_username(request.username)
    if not user:
        raise HTTPException(status_code=400, detail='Incorrect username or password')
    if not pwd_context.verify(request.password, user['password']):
        raise HTTPException(status_code=400, detail='Incorrect username or password')
    
    token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={"sub" : user["username"]}, expires_delta=token_expires)

    response.set_cookie(
        key='access_token',
        value=token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES,
        samesite='strict',
        secure=False #изменть для защищенного соединения
        )
    return {'message' : "Login successful"}


async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        return False  # Возвращаем False, если токен отсутствует
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            return False  # Если нет username, токен недействителен
    except JWSError:
        return False  # В случае ошибки при декодировании токена
    return True  # Возвращаем True, если токен действителен

@router.get("/protected")
async def protected_route(is_valid: bool = Depends(get_current_user)):
    return {'isAuth' : is_valid}  


@router.post('/logout')
async def logout(response: Response):
    response.delete_cookie(key='access_token')
    return {'message' : "Logged out successfully"}

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
