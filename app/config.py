import os

# Настройки подключения к MySQL
MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
MYSQL_PORT = os.getenv('MYSQL_PORT', 3306)
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'densan')
MYSQL_USER = os.getenv('MYSQL_USER', 'densan_robot')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'm1_lbB')