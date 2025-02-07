from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel


Base = declarative_base()


class SEO(Base):
    __tablename__="seo"

    id = Column(Integer,
                 primary_key=True,
                 index=True)
    title = Column(String,
                   nullable=False)
    description = Column(String,
                   nullable=False)
    keywords = Column(String,
                   nullable=False)
    created_at = Column(DateTime,
                        nullable=False)




class CompanyUpdate(BaseModel):
    name: str
    phone1: str
    phone2: str
    email: str
    address: str
    tin: str
    legal_name: str
    whatsap: str
    telegram: str
    vk: str
