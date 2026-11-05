import logging
import os
from contextlib import closing
from pathlib import Path

import mysql.connector
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv(Path(__file__).with_name('.env'))
app = FastAPI(title='Fixly POC API')
logger = logging.getLogger('uvicorn.error')
app.add_middleware(
    CORSMiddleware,
    allow_origins=[v.strip() for v in os.getenv(
        'CORS_ORIGINS', 'http://localhost:8081'
    ).split(',') if v.strip()],
    allow_methods=['GET'],
    allow_headers=['*'],
)


class MessageResponse(BaseModel):
    id: int
    message: str


@app.get('/health')
def health():
    # API liveness only; /api/message checks the database path.
    return {'status': 'ok'}


@app.get('/api/message', response_model=MessageResponse)
def get_message():
    required = ('DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD')
    if any(not os.getenv(key) for key in required):
        raise HTTPException(503, 'Database configuration incomplete')
    try:
        with closing(mysql.connector.connect(
            host=os.environ['DB_HOST'],
            port=int(os.getenv('DB_PORT', '3306')),
            database=os.environ['DB_NAME'],
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASSWORD'],
            connection_timeout=5,
        )) as connection:
            with closing(connection.cursor(dictionary=True)) as cursor:
                cursor.execute(
                    'SELECT id, message FROM poc_messages WHERE id = %s',
                    (1,),
                )
                row = cursor.fetchone()
    except (mysql.connector.Error, ValueError):
        logger.exception('POC database query failed')
        raise HTTPException(503, 'Database unavailable')
    if row is None:
        raise HTTPException(404, 'POC message not found')
    return row
