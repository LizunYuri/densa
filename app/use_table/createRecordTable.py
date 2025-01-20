import aiomysql
from typing import Any, Dict
from app.database import Database

class Database(Database):

    async def insert(self,
                     table : str,
                     data : Dict[str, Any]) -> int:
        """
        Универсальная функция для вставки записи в таблицу.

        :param table: Имя таблицы для вставки.
        :param data: Словарь с данными, где ключи - это имена столбцов,
                     а значения - это данные для вставки.
        :return: id вставленной записи.
        """

        columns = ", ".join(data.keys())
        values = ", ".join(["%s"] * len(data))
        query = f"INSERT INTO {table} ({columns}) VALUES ({values})"

        params = tuple(data.values())

        async with self.pool.acquire() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute(query, params)
                await connection.commit()

                return cursor.lastrowid
            
    async def update(self,
                     table: str,
                     data : Dict[str, Any],
                     condition: str,
                     condition_values: tuple) -> int:
        """
        Универсальная функция для обновления записи в таблице.

        :param table: Имя таблицы для обновления.
        :param data: Словарь с данными для обновления, где ключи - это имена столбцов,
                     а значения - это новые данные.
        :param condition: Условие для обновления (например, "id = %s").
        :param condition_values: Значения для условия.
        :return: Количество обновленных строк.
        """
        set_clause = ", ".join([f"{column} = %s" for column in data])
        query = f"UPDATE {table} SET {set_clause} WHERE {condition}"

        params = tuple(data.values() + condition_values)

        async with self.pool.acquire() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute(query, params)
                await connection.commit()

                return cursor.rowcount
            
    async def delete(self,
                     table: str,
                     condition: str,
                     condition_values: tuple) -> int:
        """
        Универсальная функция для удаления записи из таблицы.

        :param table: Имя таблицы для удаления.
        :param condition: Условие для удаления (например, "id = %s").
        :param condition_values: Значения для условия.
        :return: Количество удаленных строк.
        """
        query = f"DELETE FROM {table} WHERE {condition}"

        params = condition_values

        async with self.pool.acquire() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute(query, params)
                await connection.commit()

                return cursor.rowcount
