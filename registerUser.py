import asyncio
from app.database import Database

async def register_user():
    db = Database()
    await db.connect()

    try:
        username = input('Enter username: ')
        password = input("Enter password: ")
        email = input("Enter email: ")
        admin_input = input("Is this user an admin& (yes/no): ").strip().lower()
        admin = admin_input == 'yes'
        await db.create_user(username, password, email, admin)
    finally:
        await db.close()


if __name__ == '__main__':

    asyncio.run(register_user())
