import useWindowSize from "../hooks/useWindowSize"

export default function SearchBar({ city, setCity, onSearch, onLocationClick, loading }) {
  const { isMobile } = useWindowSize()

  function handleKeyDown(e) {
    if (e.key === "Enter") onSearch()
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      padding: isMobile ? "24px 16px" : "48px 32px 32px"
    }}>
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: "12px",
        width: "100%",
        maxWidth: "700px"
      }}>

        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "8px",
          padding: "0 16px",
          flex: 1
        }}>
          <span style={{ color: "#8b949e", marginRight: "10px" }}>🔍</span>
          <input
            type="text"
            placeholder="Enter city, zip code, coordinates or landmark..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e6edf3",
              fontSize: "15px",
              width: "100%",
              padding: "14px 0"
            }}
          />
        </div>

        <div style={{
          display: "flex",
          gap: "12px"
        }}>
          <button
            onClick={onSearch}
            disabled={loading}
            style={{
              backgroundColor: "#f0a500",
              color: "#0d1117",
              border: "none",
              borderRadius: "8px",
              padding: "0 24px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              flex: isMobile ? 1 : "none",
              height: "48px"
            }}
          >
            {loading ? "..." : "Search"}
          </button>

          <button
            onClick={onLocationClick}
            style={{
              backgroundColor: "#161b22",
              color: "#e6edf3",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "0 20px",
              fontSize: "14px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flex: isMobile ? 1 : "none",
              height: "48px"
            }}
          >
            📍 {isMobile ? "My Location" : "Use my location"}
          </button>
        </div>

      </div>
    </div>
  )
}