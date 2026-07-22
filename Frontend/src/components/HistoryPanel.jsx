import { useState } from "react"
import axios from "axios"

export default function HistoryPanel({ searches, onRefresh }) {
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  async function handleDelete(id) {
    if (!window.confirm("Delete this record?")) return
    await axios.delete(`http://localhost:5000/api/searches/${id}`)
    onRefresh()
  }

  function handleEditStart(search) {
    setEditingId(search.id)
    setEditData({
      date_from: search.date_from,
      date_to: search.date_to,
      description: search.description
    })
  }

  async function handleEditSave(id) {
    await axios.put(`http://localhost:5000/api/searches/${id}`, editData)
    setEditingId(null)
    onRefresh()
  }

  async function handleExport(format) {
    window.open(`http://localhost:5000/api/export/${format}`, "_blank")
  }

  if (searches.length === 0) {
    return (
      <div style={{ margin: "24px 32px 0" }}>
        <p style={{
          color: "#8b949e",
          fontSize: "13px",
          letterSpacing: "1px",
          textTransform: "uppercase",
          marginBottom: "16px"
        }}>
           Search History
        </p>
        <div style={{
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "8px",
          padding: "32px",
          textAlign: "center",
          color: "#8b949e"
        }}>
          No searches saved yet. Search for a city to get started.
        </div>
      </div>
    )
  }

  return (
    <div style={{ margin: "24px 32px 0" }}>

      {/* HEADER + EXPORT BUTTONS */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <p style={{
          color: "#8b949e",
          fontSize: "13px",
          letterSpacing: "1px",
          textTransform: "uppercase"
        }}>
           Search History ({searches.length} records)
        </p>

        {/* EXPORT BUTTONS */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["json", "csv", "xml", "markdown", "pdf"].map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              style={{
                backgroundColor: "#161b22",
                color: "#f0a500",
                border: "1px solid #f0a500",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                cursor: "pointer",
                textTransform: "uppercase",
                fontWeight: "600"
              }}
            >
              ↓ {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
        <div style={{
        backgroundColor: "#161b22",
        border: "1px solid #30363d",
        borderRadius: "8px",
        overflowX: "auto"
        }}>
        <table style={{
            width: "100%",
            minWidth: "800px",
            borderCollapse: "collapse",
            fontSize: "13px"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#0d1117" }}>
              {["ID", "Location", "Temp", "Description", "Date From", "Date To", "Saved At", "Actions"].map(h => (
                <th key={h} style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  color: "#8b949e",
                  fontWeight: "600",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #30363d"
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {searches.map((s, index) => (
              <tr key={s.id} style={{
                borderBottom: "1px solid #30363d",
                backgroundColor: index % 2 === 0 ? "#161b22" : "#0d1117"
              }}>
                <td style={{ padding: "12px 16px", color: "#8b949e" }}>{s.id}</td>
                <td style={{ padding: "12px 16px" }}>
                  {s.location}, {s.country}
                </td>
                <td style={{ padding: "12px 16px", color: "#f0a500", fontWeight: "600" }}>
                  {Math.round(s.temperature)}°C
                </td>

                {/* DESCRIPTION — editable */}
                <td style={{ padding: "12px 16px" }}>
                  {editingId === s.id ? (
                    <input
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      style={{
                        backgroundColor: "#0d1117",
                        border: "1px solid #f0a500",
                        borderRadius: "4px",
                        color: "#e6edf3",
                        padding: "4px 8px",
                        fontSize: "12px",
                        width: "120px"
                      }}
                    />
                  ) : (
                    <span style={{ textTransform: "capitalize" }}>{s.description}</span>
                  )}
                </td>

                {/* DATE FROM — editable */}
                <td style={{ padding: "12px 16px" }}>
                  {editingId === s.id ? (
                    <input
                      type="date"
                      value={editData.date_from}
                      onChange={(e) => setEditData({ ...editData, date_from: e.target.value })}
                      style={{
                        backgroundColor: "#0d1117",
                        border: "1px solid #f0a500",
                        borderRadius: "4px",
                        color: "#e6edf3",
                        padding: "4px 8px",
                        fontSize: "12px"
                      }}
                    />
                  ) : (
                    s.date_from
                  )}
                </td>

                {/* DATE TO — editable */}
                <td style={{ padding: "12px 16px" }}>
                  {editingId === s.id ? (
                    <input
                      type="date"
                      value={editData.date_to}
                      onChange={(e) => setEditData({ ...editData, date_to: e.target.value })}
                      style={{
                        backgroundColor: "#0d1117",
                        border: "1px solid #f0a500",
                        borderRadius: "4px",
                        color: "#e6edf3",
                        padding: "4px 8px",
                        fontSize: "12px"
                      }}
                    />
                  ) : (
                    s.date_to
                  )}
                </td>

                <td style={{ padding: "12px 16px", color: "#8b949e", fontSize: "12px" }}>
                  {new Date(s.created_at).toLocaleDateString()}
                </td>

                {/* ACTION BUTTONS */}
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {editingId === s.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(s.id)}
                          style={{
                            backgroundColor: "#238636",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            backgroundColor: "#161b22",
                            color: "#8b949e",
                            border: "1px solid #30363d",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(s)}
                          style={{
                            backgroundColor: "#161b22",
                            color: "#f0a500",
                            border: "1px solid #f0a500",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          style={{
                            backgroundColor: "#161b22",
                            color: "#f85149",
                            border: "1px solid #f85149",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}