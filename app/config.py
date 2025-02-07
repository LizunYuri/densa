import os
# from decouple import config


# Настройки подключения к MySQL
MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
MYSQL_PORT = os.getenv('MYSQL_PORT', 3306)
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'c101683_xn__80ahd6au_xn__p1ai_densa')
MYSQL_USER = os.getenv('MYSQL_USER', 'c101683_xn__80ahd6au_xn__p1ai')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'HeRtoVavnecan85')


# Настройки подключения к почте

SMTP_HOST = 'mail.netangels.ru'
SMTP_PORT = 587
SMTP_USER = 'robot@xn--80ahd6au.xn--p1ai'
SMTP_PASSWORD = 'bassein193'
SMTP_RECIPIENT = 'bassein193@yandex.ru'