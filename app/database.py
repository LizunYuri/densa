import aiomysql
from typing import Any
from .config import MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER # type: ignore


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
            host = self.host,
            port = self.port,
            user = self.user,
            password = self.password,
            db = self.db,
            autocommit = True,
            )
        print('database connected')

    async def execute(self, query: str, *params: Any) -> Any:
        async with self.pool.acquire() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute(query, params)
                return await cursor.fetchall()
            

    async def close(self):
        self.pool.close()
        await self.pool.await_closed()
        import aiomysql
from typing import Any
from .config import MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER  # type: ignore

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
    
    
    async def get_latest_direct_record(self):
        query = "SELECT * FROM meta ORDER BY created_at DESC LIMIT 1"
        return await self.fetch_one(query)

    async def close(self):
        self.pool.close()
        await self.pool.await_closed()
