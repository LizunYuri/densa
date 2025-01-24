import aiomysql
from passlib.context import CryptContext
from typing import Any, Optional
from .config import MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALLOWED_TABLES = {"firstscreen", }

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
            
    async def fetch_all(self, query: str, *params: Any) -> list:
        async with self.pool.acquire() as connection:
            async with connection.cursor(aiomysql.DictCursor) as cursor:
                await cursor.execute(query, params)
                return await cursor.fetchall()

    async def get_latest_seo_record(self):
        query = "SELECT * FROM seo ORDER BY created_at DESC LIMIT 1"
        return await self.fetch_one(query)
    
    async def get_lasted_company_record(self):
        query = "SELECT * FROM company ORDER BY created_at DESC LIMIT 1"
        return await self.fetch_one(query)
        
    async def get_latest_direct_record(self):
        query = "SELECT * FROM meta ORDER BY created_at DESC LIMIT 1"
        return await self.fetch_one(query)

    async def insert_image_first_screen(self,
                                        title: str,
                                        subtitle : str,
                                        content: str,
                                        url: str
                                        ) -> int:
        query = f"INSERT INTO firstscreen (title, subtitle, content, url) VALUES (%s, %s, %s, %s)"

        async with self.pool.acquire() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute(query, (title, subtitle, content, url))
                await connection.commit()
                return cursor.rowcount
            
    async def get_first_screen_images(self) -> list:
        query = "SELECT id, title, subtitle, content, url FROM firstscreen"

        return await self.fetch_all(query)
    
    async def get_record_id(self, table: str, record_id: int) -> Optional[dict]:
        try:
            
            if table not in ALLOWED_TABLES:
                raise ValueError(f"Invalid table name: {table}")

            query = f"SELECT * FROM {table} WHERE id = %s"
            
            async with self.pool.acquire() as conn:
                async with conn.cursor(aiomysql.DictCursor) as cursor:
                    await cursor.execute(query, (record_id,))
                    result = await cursor.fetchone()
            
            return result 
        except Exception as e:
            raise ValueError(f"Database error: {str(e)}")

    async def delete_record(self, table: str, record_id: int) -> bool:
        try:
            if table not in ALLOWED_TABLES:
                raise ValueError(f"Invalid table name: {table}")

            query = f"DELETE FROM {table} WHERE id = %s"
            
            async with self.pool.acquire() as conn:
                async with conn.cursor() as cursor:
                    await cursor.execute(query, (record_id,))
                    result = cursor.rowcount
            
            return result > 0 
        except Exception as e:
            raise ValueError(f"Database error: {str(e)}")

    async def update_record(self,
                            table : str,
                            record_id : int,
                            update_data: dict
                            ) -> bool:
        try:

            if table not in ALLOWED_TABLES:
                raise ValueError(f"Invalid table name: {table}")
        
            set_clause = ', '.join([f"{key} = %s" for key in update_data.keys()])
            query = f"UPDATE {table} SET {set_clause} WHERE id = %s"

            params = tuple(update_data.values()) + (record_id,)

            async with self.pool.acquire() as connection:
                async with connection.cursor() as cursor:
                    await cursor.execute(query, params)
                    result = cursor.rowcount
            
            return result > 0
        except Exception as e:
            raise ValueError(f"Database error: {str(e)}")

    async def close(self):
        self.pool.close()
        await self.pool.wait_closed()
