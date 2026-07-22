import useWindowSize from "../hooks/useWindowSize"

export default function Header() {
  const { isMobile } = useWindowSize()

  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isMobile ? "12px 16px" : "16px 32px",
        borderBottom: "1px solid #30363d"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#f0a500"
          }}></div>
          <span style={{ fontWeight: "600", fontSize: "18px" }}>Skyline</span>
          <span style={{ color: "#8b949e", fontSize: "12px", marginLeft: "8px" }}>
            by Yassin Ayadi
          </span>
        </div>
        {!isMobile && (
          <span style={{ color: "#8b949e", fontSize: "13px" }}>
            Powered by <strong style={{ color: "#f0a500" }}>PM Accelerator</strong>
          </span>
        )}
      </div>

      <div style={{
        backgroundColor: "#161b22",
        borderBottom: "1px solid #30363d",
        padding: isMobile ? "8px 16px" : "10px 32px"
      }}>
        <span style={{ color: "#f0a500", fontSize: "12px", fontWeight: "600" }}>
          About PM Accelerator:{" "}
        </span>
        <span style={{ color: "#8b949e", fontSize: "12px" }}>
          {isMobile
            ? "US-based AI learning hub with mentors from Google, Meta, Apple & Nvidia."
            : "PM Accelerator is a US-based AI learning and development hub featuring award-winning AI products and mentors from Google, Meta, Apple, and Nvidia empowering the next generation of AI professionals through hands-on experience, mentorship, and real-world projects."}
        </span>
      </div>
    </>
  )
}