// pages/producer/song.js
import { useRouter } from "next/router";

export default function ProducerSong() {
  const router = useRouter();
  const { file } = router.query;

  if (!file) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Producer Song Download</h2>
      <audio controls src={file}></audio>

      <br /><br />

      <a 
        href={file} 
        download 
        style={{ 
          background: "#007bff", 
          padding: "12px 20px", 
          color: "#fff", 
          borderRadius: "6px",
          textDecoration: "none"
        }}
      >
        Download Audio
      </a>
    </div>
  );
}
