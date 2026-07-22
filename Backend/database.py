import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "weather.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # returns rows as dicts instead of tuples
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS weather_searches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location TEXT NOT NULL,
            country TEXT,
            latitude REAL,
            longitude REAL,
            date_from TEXT,
            date_to TEXT,
            temperature REAL,
            feels_like REAL,
            humidity INTEGER,
            wind_speed REAL,
            pressure INTEGER,
            description TEXT,
            icon TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)
    
    conn.commit()
    conn.close()