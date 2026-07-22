export default function ErrorMessage({ error }) {

  if (!error) return null

  return (
    <div style={{
      margin: "0 32px",
      backgroundColor: "#1a0f0f",
      border: "1px solid #f85149",
      borderRadius: "8px",
      padding: "14px 20px",
      color: "#f85149",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }}>
      ⚠️ {error}
    </div>
  )
}