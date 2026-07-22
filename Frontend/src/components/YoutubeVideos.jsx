export default function YoutubeVideos({ videos }) {
  if (!videos || videos.length === 0) return null

  return (
    <div style={{ margin: "24px 32px 0" }}>
      <p style={{
        color: "#8b949e",
        fontSize: "13px",
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginBottom: "16px"
      }}>
        🎥 Videos About This Location
      </p>
      <div style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap"
      }}>
        {videos.map((video) => (
          <a
            key={video.video_id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: "1",
              minWidth: "200px",
              backgroundColor: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "8px",
              overflow: "hidden",
              textDecoration: "none",
              color: "#e6edf3",
              display: "block"
            }}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{ width: "100%", display: "block" }}
            />
            <p style={{
              padding: "10px 12px",
              fontSize: "13px",
              lineHeight: "1.4",
              color: "#e6edf3"
            }}>
              {video.title}
            </p>
            <p style={{
              padding: "0 12px 10px",
              fontSize: "11px",
              color: "#f0a500"
            }}>
              ▶ Watch on YouTube
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}