import useWindowSize from "../hooks/useWindowSize"

export default function WeatherCard({ weather, loading }) {
  const { isMobile } = useWindowSize()
  if (loading) {
    return (
      <div style={{
        margin: isMobile ? "0 16px" : "0 32px",
        backgroundColor: "#161b22",
        border: "1px solid #30363d",
        borderRadius: "8px",
        padding: "32px",
        textAlign: "center",
        color: "#8b949e"
      }}>
        Loading weather data...
      </div>
    )
  }

  if (!weather) {
    return (
      <div style={{
        margin: isMobile ? "0 16px" : "0 32px",
        backgroundColor: "#161b22",
        border: "1px solid #30363d",
        borderRadius: "8px",
        padding: "32px",
        textAlign: "center",
        color: "#8b949e"
      }}>
        Search for a city to see the weather
      </div>
    )
  }

  return (
    <div style={{
      margin: isMobile ? "0 16px" : "0 32px",
      backgroundColor: "#161b22",
      border: "1px solid #30363d",
      borderRadius: "8px",
      padding: "32px"
    }}>

      {/* TOP ROW - city name + date */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        marginBottom: "24px" 
      }}>
        <span style={{ 
          fontSize: "13px", 
          letterSpacing: "1px", 
          color: "#8b949e", 
          textTransform: "uppercase" 
        }}>
          Current Weather
        </span>
        <span style={{ color: "#8b949e", fontSize: "13px" }}>
          {new Date().toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </span>
      </div>

      {/* MAIN ROW - temp + condition + details */}
      <div style={{ 
        display: "flex", 
        alignItems: isMobile ? "flex-start" : "center", 
        gap: "32px",
        flexDirection: isMobile ? "column" : "row"
      }}>

        {/* TEMPERATURE */}
        <div>
          <span style={{ 
            fontSize: "72px", 
            fontWeight: "700", 
            color: "#f0a500", 
            lineHeight: 1 
          }}>
            {Math.round(weather.main.temp)}
          </span>
          <span style={{ 
            fontSize: "32px", 
            color: "#8b949e" 
          }}>°C</span>
          <p style={{ 
            color: "#8b949e", 
            fontSize: "13px", 
            marginTop: "4px" 
          }}>
            {weather.name}, {weather.sys.country}
          </p>
        </div>

        {/* WEATHER ICON + CONDITION */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px", 
          flex: 1 
        }}>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            style={{ width: "80px", height: "80px" }}
          />
          <div>
            <p style={{ 
              fontSize: "20px", 
              fontWeight: "600", 
              textTransform: "capitalize" 
            }}>
              {weather.weather[0].description}
            </p>
            <p style={{ color: "#8b949e", fontSize: "13px" }}>
              Feels like {Math.round(weather.main.feels_like)}°C
            </p>
          </div>
        </div>

        {/* EXTRA DETAILS */}
        <div style={{ 
          display: "flex", 
          gap: isMobile ? "16px" : "32px", 
          marginLeft: isMobile ? "0" : "auto",
          flexWrap: "wrap"
        }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#8b949e", fontSize: "11px", letterSpacing: "1px" }}>HUMIDITY</p>
            <p style={{ fontSize: "20px", fontWeight: "600", marginTop: "4px" }}>
              {weather.main.humidity}%
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#8b949e", fontSize: "11px", letterSpacing: "1px" }}>WIND</p>
            <p style={{ fontSize: "20px", fontWeight: "600", marginTop: "4px" }}>
              {Math.round(weather.wind.speed)} m/s
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#8b949e", fontSize: "11px", letterSpacing: "1px" }}>PRESSURE</p>
            <p style={{ fontSize: "20px", fontWeight: "600", marginTop: "4px" }}>
              {weather.main.pressure} hPa
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}