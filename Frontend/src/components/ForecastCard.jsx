export default function ForecastCard({ day }) {

  if (!day) return null

  return (
    <div style={{
      backgroundColor: "#161b22",
      border: "1px solid #30363d",
      borderRadius: "8px",
      padding: "20px 16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      flex: 1
    }}>

      {/* DAY NAME */}
      <p style={{ 
        color: "#8b949e", 
        fontSize: "12px", 
        letterSpacing: "1px",
        textTransform: "uppercase"
      }}>
        {new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
      </p>

      {/* DATE */}
      <p style={{ 
        color: "#8b949e", 
        fontSize: "11px"
      }}>
        {new Date(day.dt * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </p>

      {/* WEATHER ICON */}
      <img
        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
        alt={day.weather[0].description}
        style={{ width: "56px", height: "56px" }}
      />

      {/* CONDITION */}
      <p style={{ 
        fontSize: "12px", 
        textTransform: "capitalize",
        textAlign: "center",
        color: "#e6edf3"
      }}>
        {day.weather[0].description}
      </p>

      {/* HIGH / LOW TEMP */}
      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
        <span style={{ 
          color: "#f0a500", 
          fontWeight: "600",
          fontSize: "15px"
        }}>
          {Math.round(day.main.temp_max)}°
        </span>
        <span style={{ color: "#8b949e", fontSize: "15px" }}>
          {Math.round(day.main.temp_min)}°
        </span>
      </div>

    </div>
  )
}