"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";

export default function AdvertisingPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("https://cocomedia.co.ke/wp-json/promos/v1/list")
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error("Failed to load promos:", err));
  }, []);

  return (
    <div>
    <div className="page-wrapper">
      <div className="h-[10vh]">
      <Navbar />
      <main className="ad-content">
      <div className="advertising-page">
      <h1 className="page-title">Advertising Promos</h1>

      {files.map((f, i) => (
  <div key={i} className="promo-card">
    {f.url.endsWith(".mp4") || f.url.endsWith(".webm") || f.url.endsWith(".mov") ? (
      <video src={f.url} controls className="promo-media" />
    ) : (
      <img src={f.url} alt={f.name || `promo-${i}`} className="promo-media" />
    )}
  </div>
))}


    </div>
    <ChatButton/>
    </main>
    </div>
    </div>
    <Footer/>
    </div>
  );
}


// import { useState } from "react";

// export default function AdvertisingTest() {
//   const [files, setFiles] = useState([]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files); // convert FileList → Array
//     setFiles(selectedFiles);
//   };

//   return (
//     <div className="upload-container">
//       <h2>Upload Your Ad / Reel</h2>

//       <input
//         type="file"
//         accept="video/*"
//         multiple
//         onChange={handleFileChange}
//       />

//       <div className="preview-container">
//         {files.length === 0 && <p>No videos selected yet.</p>}
//         {files.map((file, index) => (
//           <div key={index} className="video-preview">
//             <p>{file.name}</p>
//             <video
//               src={URL.createObjectURL(file)}
//               width="320"
//               height="240"
//               controls
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
