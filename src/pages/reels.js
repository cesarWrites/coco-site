"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

function UploadButton() {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    await fetch("https://cocomedia.co.ke/wp-json/reels/v1/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    alert("Reel submitted! Pending admin verification.");
  };

  return (
    <label className="upload-btn">
      {loading ? "Uploading..." : "Add New Reel"}
      <input type="file" className="hidden-input" onChange={handleUpload} />
    </label>
  );
}

export default function ReelsPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    fetch("https://cocomedia.co.ke/wp-json/reels/v1/settings")
      .then((res) => res.json())
      .then((data) => setYoutubeUrl(data.youtube_url));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="h-[10vh]">
        <Navbar />
      </div>

      <main className="main-content">
        <div className="header-row">
          <h1 className="page-title">Reels</h1>
          <UploadButton />
        </div>

        {youtubeUrl ? (
          <div className="video-wrapper">
            <iframe
              src={youtubeUrl}
              title="YouTube Livestream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="empty-text">No livestream available.</p>
        )}
      </main>
      <Footer/>
    </div>
  );
}
