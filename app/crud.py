from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .models import SEO, DIRECT

async def get_lasted_seo_record(db: AsyncSession):
    result = await db.execute(select(SEO).order_by(SEO.created_at.desc()).limit(1))

    return result.scalars().first()
