import aiomysql
from passlib.context import CryptContext
from typing import Any, Optional
from .config import MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Database:
    def __init__(self,
                 host=MYSQL_HOST,
                 port=MYSQL_PORT,
                 db=MYSQL_DATABASE,
                 user=MYSQL_USER,
                 password=MYSQL_PASSWORD):
        self.host = host
        self.port = port
        self.db = db
        self.user = user
        self.password = password
        self.pool = None

    async def connect(self):
        self.pool = await aiomysql.create_pool(
            host=self.host,
            port=self.port,
            user=self.user,
            password=self.password,
            db=self.db,
            autocommit=True,
        )
        print('Database connected')

    async def create_user(self, 
                          username: str,
                          password: str,
                          email: str,
                          admin: bool = False
                          ):
        hashed_password = pwd_context.hash(password)
        query = 'INSERT INTO users (username, password, email, admin) VALUES (%s, %s, %s, %s)'
        async with self.pool.acquire() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute(query, (username, hashed_password, email, admin,))
            print(f"user '{username}' created successfully. Admin^ {admin}")

    async def get_user_by_username(self, username: str) -> Optional[dict]:
        query = 'SELECT id, username, password FROM users WHERE username = %s'
        async with self.pool.acquire() as connection:
            async with connection.cursor(aiomysql.DictCursor) as cursor:
                await cursor.execute(query, (username,))
                return await cursor.fetchone()

    async def execute(self, query: str, *params: Any) -> Any:
        async with self.pool.acquire() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute(query, params)
                return await cursor.fetchall()

    async def fetch_one(self, query: str, *params: Any) -> Any:
        async with self.pool.acquire() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute(query, params)
                return await cursor.fetchone()

    async def get_latest_seo_record(self):
        query = "SELECT * FROM seo ORDER BY created_at DESC LIMIT 1"
        return await self.fetch_one(query)
    
    async def get_lasted_company_record(self):
        query = "SELECT * FROM company ORDER BY created_at DESC LIMIT 1"
        return await self.fetch_one(query)
        
    async def get_latest_direct_record(self):
        query = "SELECT * FROM meta ORDER BY created_at DESC LIMIT 1"
        return await self.fetch_one(query)

    async def close(self):
        self.pool.close()
        await self.pool.wait_closed()
