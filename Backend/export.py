import json
import csv
import io
import xml.etree.ElementTree as ET
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def export_json(data):
    return json.dumps(data, indent=2), "application/json", "weather_data.json"


def export_csv(data):
    if not data:
        return "", "text/csv", "weather_data.csv"
    
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
    return output.getvalue(), "text/csv", "weather_data.csv"


def export_xml(data):
    root = ET.Element("weather_searches")
    
    for item in data:
        search = ET.SubElement(root, "search")
        for key, value in item.items():
            child = ET.SubElement(search, key)
            child.text = str(value) if value is not None else ""
    
    return ET.tostring(root, encoding="unicode"), "application/xml", "weather_data.xml"


def export_markdown(data):
    if not data:
        return "No data found.", "text/markdown", "weather_data.md"
    
    lines = ["# Weather Search History\n"]
    lines.append("| ID | Location | Temp | Description | Date From | Date To | Saved At |")
    lines.append("|---|---|---|---|---|---|---|")
    
    for row in data:
        lines.append(
            f"| {row['id']} | {row['location']}, {row['country']} "
            f"| {row['temperature']}°C | {row['description']} "
            f"| {row['date_from']} | {row['date_to']} | {row['created_at']} |"
        )
    
    return "\n".join(lines), "text/markdown", "weather_data.md"


def export_pdf(data):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "Weather Search History")
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 70, "PM Accelerator - AI Weather App")
    
    y = height - 110
    
    for row in data:
        if y < 100:
            c.showPage()
            y = height - 50
        
        c.setFont("Helvetica-Bold", 11)
        c.drawString(50, y, f"{row['location']}, {row['country']}")
        y -= 16
        
        c.setFont("Helvetica", 10)
        c.drawString(50, y, f"Temperature: {row['temperature']}°C  |  {row['description']}")
        y -= 14
        c.drawString(50, y, f"Humidity: {row['humidity']}%  |  Wind: {row['wind_speed']} m/s")
        y -= 14
        c.drawString(50, y, f"Date Range: {row['date_from']} → {row['date_to']}")
        y -= 14
        c.drawString(50, y, f"Saved at: {row['created_at']}")
        y -= 24
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue(), "application/pdf", "weather_data.pdf"