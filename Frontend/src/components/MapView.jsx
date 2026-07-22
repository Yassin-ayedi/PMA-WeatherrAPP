import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import useWindowSize from "../hooks/useWindowSize"


// fix leaflet default marker icon bug in React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export default function MapView({ coords, locationName }) {
   const { isMobile } = useWindowSize()
  if (!coords) return null

  return (
    <div style={{ margin: isMobile ? "24px 16px 0" : "24px 32px 0" }}>
      <p style={{
        color: "#8b949e",
        fontSize: "13px",
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginBottom: "16px"
      }}>
        📍 Location Map
      </p>
      <div style={{
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #30363d",
        height: "300px"
      }}>
        <MapContainer
          center={[coords.lat, coords.lon]}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={[coords.lat, coords.lon]}>
            <Popup>{locationName}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}