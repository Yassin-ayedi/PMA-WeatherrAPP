import useWindowSize from "../hooks/useWindowSize"
export default function AirQuality({ data }) {
  const { isMobile } = useWindowSize()
  if (!data) return null

  const pollutants = [
    { label: "PM2.5", value: data.pm2_5, unit: "μg/m³", desc: "Fine particles" },
    { label: "PM10", value: data.pm10, unit: "μg/m³", desc: "Coarse particles" },
    { label: "O3", value: data.o3, unit: "μg/m³", desc: "Ozone" },
    { label: "NO2", value: data.no2, unit: "μg/m³", desc: "Nitrogen Dioxide" },
    { label: "CO", value: data.co, unit: "μg/m³", desc: "Carbon Monoxide" },
  ]

  return (
    <div style={{ margin: isMobile ? "24px 16px 0" : "24px 32px 0" }}>
      <p style={{
        color: "#8b949e",
        fontSize: "13px",
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginBottom: "16px"
      }}>
        🌫️ Air Quality
      </p>

      <div style={{
        backgroundColor: "#161b22",
        border: "1px solid #30363d",
        borderRadius: "8px",
        padding: "24px",
        display: "flex",
        gap: "32px",
        alignItems: "center",
        flexWrap: "wrap"
      }}>

        {/* AQI SCORE */}
        <div style={{ textAlign: "center", minWidth: "120px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: data.color + "22",
            border: `3px solid ${data.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 8px"
          }}>
            <span style={{
              fontSize: "28px",
              fontWeight: "700",
              color: data.color
            }}>
              {data.aqi}
            </span>
          </div>
          <p style={{
            color: data.color,
            fontWeight: "600",
            fontSize: "14px"
          }}>
            {data.label}
          </p>
          <p style={{
            color: "#8b949e",
            fontSize: "11px",
            marginTop: "4px"
          }}>
            AQI Index (1-5)
          </p>
        </div>

        {/* DIVIDER */}
        <div style={{
          width: "1px",
          height: "80px",
          backgroundColor: "#30363d"
        }} />

        {/* POLLUTANTS */}
        <div style={{
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
          flex: 1
        }}>
          {pollutants.map((p) => (
            <div key={p.label} style={{ minWidth: "80px" }}>
              <p style={{
                color: "#8b949e",
                fontSize: "11px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "4px"
              }}>
                {p.label}
              </p>
              <p style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#e6edf3"
              }}>
                {p.value}
              </p>
              <p style={{
                fontSize: "10px",
                color: "#8b949e",
                marginTop: "2px"
              }}>
                {p.unit}
              </p>
              <p style={{
                fontSize: "10px",
                color: "#8b949e"
              }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* HEALTH TIP */}
        <div style={{
          backgroundColor: data.color + "11",
          border: `1px solid ${data.color}44`,
          borderRadius: "8px",
          padding: "12px 16px",
          maxWidth: "200px"
        }}>
          <p style={{
            fontSize: "11px",
            color: "#8b949e",
            marginBottom: "4px",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            Health Advice
          </p>
          <p style={{ fontSize: "13px", color: "#e6edf3" }}>
            {data.aqi === 1 && "Air quality is great. Enjoy outdoor activities!"}
            {data.aqi === 2 && "Air quality is acceptable. Sensitive groups should take care."}
            {data.aqi === 3 && "Moderate pollution. Limit prolonged outdoor exertion."}
            {data.aqi === 4 && "Poor air quality. Avoid outdoor activities if possible."}
            {data.aqi === 5 && "Very poor air. Stay indoors and keep windows closed."}
          </p>
        </div>

      </div>
    </div>
  )
}