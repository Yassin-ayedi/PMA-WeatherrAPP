import requests
from dotenv import load_dotenv
import os

API_KEY = os.getenv("API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
BASE_URL = os.getenv("BASE_URL")
GEO_URL = os.getenv("GEO_URL")


def get_current_weather(location):
    
    # check if coordinates (lat,lon)
    if "," in location:
        parts = location.split(",")
        if len(parts) == 2:
            try:
                lat = float(parts[0].strip())
                lon = float(parts[1].strip())
                url = f"{BASE_URL}/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
                res = requests.get(url)
                res.raise_for_status()
                return res.json(), None
            except ValueError:
                pass

    # city name or zip code
    url = f"{BASE_URL}/weather?q={location}&appid={API_KEY}&units=metric"
    res = requests.get(url)
    
    if res.status_code == 404:
        return None, "Location not found. Try a different city name or zip code."
    if res.status_code == 401:
        return None, "Invalid API key."
    
    res.raise_for_status()
    return res.json(), None


def validate_location(location):
    url = f"{GEO_URL}/direct?q={location}&limit=1&appid={API_KEY}"
    res = requests.get(url)
    data = res.json()
    
    if not data:
        return None, "Location does not exist or could not be found."
    
    return {
        "name": data[0].get("name"),
        "country": data[0].get("country"),
        "lat": data[0].get("lat"),
        "lon": data[0].get("lon")
    }, None


def get_forecast(location):
    url = f"{BASE_URL}/forecast?q={location}&appid={API_KEY}&units=metric"
    res = requests.get(url)
    
    if res.status_code == 404:
        return None, "Location not found."
    
    res.raise_for_status()
    data = res.json()
    
    # filter one reading per day at noon
    daily = [item for item in data["list"] if "12:00:00" in item["dt_txt"]]
    return daily, None

def get_youtube_videos(location):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": f"{location} city travel weather",
        "type": "video",
        "maxResults": 3,
        "key": YOUTUBE_API_KEY
    }
    res = requests.get(url, params=params)
    if res.status_code != 200:
        return [], "Could not fetch YouTube videos"
    
    data = res.json()
    videos = []
    for item in data.get("items", []):
        videos.append({
            "video_id": item["id"]["videoId"],
            "title": item["snippet"]["title"],
            "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
            "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
        })
    return videos, None

def get_coordinates(location):
    geo, error = validate_location(location)
    if error:
        return None, error
    return {"lat": geo["lat"], "lon": geo["lon"]}, None


def get_air_quality(lat, lon):
    url = f"{BASE_URL}/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    res = requests.get(url)
    
    if res.status_code != 200:
        return None, "Could not fetch air quality data"
    
    data = res.json()
    components = data["list"][0]["components"]
    aqi = data["list"][0]["main"]["aqi"]
    
    aqi_labels = {
        1: ("Good", "#00e400"),
        2: ("Fair", "#92d050"),
        3: ("Moderate", "#f0a500"),
        4: ("Poor", "#ff4500"),
        5: ("Very Poor", "#7e0023")
    }
    
    label, color = aqi_labels.get(aqi, ("Unknown", "#8b949e"))
    
    return {
        "aqi": aqi,
        "label": label,
        "color": color,
        "co": round(components.get("co", 0), 2),
        "no2": round(components.get("no2", 0), 2),
        "pm2_5": round(components.get("pm2_5", 0), 2),
        "pm10": round(components.get("pm10", 0), 2),
        "o3": round(components.get("o3", 0), 2),
    }, None