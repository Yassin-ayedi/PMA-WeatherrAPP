from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
from database import init_db
from models import create_search, read_all_searches, update_search, delete_search
from weather_service import get_current_weather, validate_location, get_forecast, get_youtube_videos, get_coordinates
from export import export_json, export_csv, export_xml, export_markdown, export_pdf
from weather_service import get_current_weather, validate_location, get_forecast, get_youtube_videos, get_coordinates, get_air_quality

app = Flask(__name__)
CORS(app)  # allows React frontend to talk to this backend

# initialize database on startup
init_db()

# ─── WEATHER ROUTES ────────────────────────────────────────────

@app.route("/api/weather", methods=["GET"])
def get_weather():
    location = request.args.get("location")
    if not location:
        return jsonify({"error": "Location is required"}), 400
    
    data, error = get_current_weather(location)
    if error:
        return jsonify({"error": error}), 404
    
    return jsonify(data)


@app.route("/api/forecast", methods=["GET"])
def get_forecast_route():
    location = request.args.get("location")
    if not location:
        return jsonify({"error": "Location is required"}), 400
    
    data, error = get_forecast(location)
    if error:
        return jsonify({"error": error}), 404
    
    return jsonify(data)


# ─── CRUD ROUTES ───────────────────────────────────────────────

@app.route("/api/searches", methods=["POST"])
def create():
    body = request.get_json()
    location = body.get("location")
    date_from = body.get("date_from")
    date_to = body.get("date_to")

    if not location:
        return jsonify({"error": "Location is required"}), 400
    if not date_from or not date_to:
        return jsonify({"error": "Date range is required"}), 400
    if date_from > date_to:
        return jsonify({"error": "date_from must be before date_to"}), 400

    # validate location exists
    geo, error = validate_location(location)
    if error:
        return jsonify({"error": error}), 404

    # fetch weather
    weather, err = get_current_weather(location)
    if err:
        return jsonify({"error": err}), 404

    record = {
        "location": geo["name"],
        "country": geo["country"],
        "latitude": geo["lat"],
        "longitude": geo["lon"],
        "date_from": date_from,
        "date_to": date_to,
        "temperature": weather["main"]["temp"],
        "feels_like": weather["main"]["feels_like"],
        "humidity": weather["main"]["humidity"],
        "wind_speed": weather["wind"]["speed"],
        "pressure": weather["main"]["pressure"],
        "description": weather["weather"][0]["description"],
        "icon": weather["weather"][0]["icon"]
    }

    new_id = create_search(record)
    return jsonify({"message": "Search saved", "id": new_id}), 201


@app.route("/api/searches", methods=["GET"])
def read_all():
    searches = read_all_searches()
    return jsonify(searches)





@app.route("/api/searches/<int:search_id>", methods=["PUT"])
def update(search_id):
    body = request.get_json()
    date_from = body.get("date_from")
    date_to = body.get("date_to")

    if date_from and date_to and date_from > date_to:
        return jsonify({"error": "date_from must be before date_to"}), 400

    success = update_search(search_id, body)
    if not success:
        return jsonify({"error": "Record not found"}), 404
    return jsonify({"message": "Record updated"})


@app.route("/api/searches/<int:search_id>", methods=["DELETE"])
def delete(search_id):
    success = delete_search(search_id)
    if not success:
        return jsonify({"error": "Record not found"}), 404
    return jsonify({"message": "Record deleted"})


# ─── EXPORT ROUTES ─────────────────────────────────────────────

@app.route("/api/export/<format>", methods=["GET"])
def export(format):
    data = read_all_searches()
    
    if format == "json":
        content, mimetype, filename = export_json(data)
        return send_file(
            io.BytesIO(content.encode()),
            mimetype=mimetype,
            download_name=filename,
            as_attachment=True
        )
    elif format == "csv":
        content, mimetype, filename = export_csv(data)
        return send_file(
            io.BytesIO(content.encode()),
            mimetype=mimetype,
            download_name=filename,
            as_attachment=True
        )
    elif format == "xml":
        content, mimetype, filename = export_xml(data)
        return send_file(
            io.BytesIO(content.encode()),
            mimetype=mimetype,
            download_name=filename,
            as_attachment=True
        )
    elif format == "markdown":
        content, mimetype, filename = export_markdown(data)
        return send_file(
            io.BytesIO(content.encode()),
            mimetype=mimetype,
            download_name=filename,
            as_attachment=True
        )
    elif format == "pdf":
        content, mimetype, filename = export_pdf(data)
        return send_file(
            io.BytesIO(content),
            mimetype=mimetype,
            download_name=filename,
            as_attachment=True
        )
    else:
        return jsonify({"error": "Invalid format. Use json, csv, xml, markdown or pdf"}), 400
    
    
@app.route("/api/coordinates", methods=["GET"])
def coordinates():
    location = request.args.get("location")
    if not location:
        return jsonify({"error": "Location is required"}), 400
    
    coords, error = get_coordinates(location)
    if error:
        return jsonify({"error": error}), 404
    
    return jsonify(coords)    

@app.route("/api/youtube", methods=["GET"])
def youtube():
    location = request.args.get("location")
    if not location:
        return jsonify({"error": "Location is required"}), 400
    
    videos, error = get_youtube_videos(location)
    if error:
        return jsonify({"error": error}), 500
    
    return jsonify(videos)


@app.route("/api/airquality", methods=["GET"])
def air_quality():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    
    if not lat or not lon:
        return jsonify({"error": "lat and lon are required"}), 400
    
    data, error = get_air_quality(float(lat), float(lon))
    if error:
        return jsonify({"error": error}), 500
    
    return jsonify(data)

# ─── RUN ───────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True, port=5000)