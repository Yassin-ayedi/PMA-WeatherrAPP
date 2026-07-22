from database import get_connection

def create_search(data):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO weather_searches 
        (location, country, latitude, longitude, date_from, date_to,
         temperature, feels_like, humidity, wind_speed, pressure, description, icon)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("location"),
        data.get("country"),
        data.get("latitude"),
        data.get("longitude"),
        data.get("date_from"),
        data.get("date_to"),
        data.get("temperature"),
        data.get("feels_like"),
        data.get("humidity"),
        data.get("wind_speed"),
        data.get("pressure"),
        data.get("description"),
        data.get("icon")
    ))
    
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def read_all_searches():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM weather_searches ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]



def update_search(search_id, data):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE weather_searches
        SET date_from = ?,
            date_to = ?,
            description = ?
        WHERE id = ?
    """, (
        data.get("date_from"),
        data.get("date_to"),
        data.get("description"),
        search_id
    ))
    
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


def delete_search(search_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM weather_searches WHERE id = ?", (search_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0