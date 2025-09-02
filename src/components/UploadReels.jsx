"use client";
import { useState } from "react";

export default function ReelUploadForm() {
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setStatus("Uploading…");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("https://yourwp.com/wp-json/reels/v1/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("Upload successful! Awaiting review.");
      } else {
        setStatus(data.message || "Upload failed.");
      }
    } catch (err) {
      setStatus("An error occurred.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded bg-blue-600 text-white"
      >
        Upload Reel
      </button>
      <p>{status}</p>
    </form>
  );
}
