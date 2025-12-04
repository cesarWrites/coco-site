"use client";
import { useState } from "react";
import Image from "next/image";
import demo1 from "../assets/kilifi_stars.jpeg"

export default function ArtistUploadPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idCopy, setIdCopy] = useState(null);
  const [demoTrack, setDemoTrack] = useState(null);
  const [socials, setSocials] = useState("");
  const [loading, setLoading] = useState(false); // NEW

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double-click
    if (!demoTrack) return alert("Please upload your demo track.");
    if (!idCopy) return alert("Please upload a copy of your ID.");

    const formData = new FormData();
    formData.append("artistName", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("socials", socials);
    formData.append("idCopy", idCopy);
    formData.append("demoTrack", demoTrack);

    setLoading(true); // START LOADING

    try {
      const res = await fetch("https://backend.cocomedia.co.ke/wp-json/music/v1/upload", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server text response:", text);
        setLoading(false);
        return alert("Upload failed — server returned invalid response.");
      }

      if (res.ok) {
        alert("Upload successful!");
        setName("");
        setEmail("");
        setPhone("");
        setSocials("");
        setIdCopy(null);
        setDemoTrack(null);
      } else {
        alert("Upload failed: " + (data?.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    }

    setLoading(false); // STOP LOADING
  };

  return (
    <div>
      <a href="/">Home</a>
      <div className="upload-page">
        {/* Banner */}
        <div className="banner-wrapper1">
          <Image 
            src={demo1}
            alt="Kilifi Festival Talent Banner"
            className="banner-img1"
            priority
          />
        </div>

        <h1 className="title">Kilifi All Stars 2025 Application</h1>

        <form className="artist-form" onSubmit={handleSubmit}>
          <p className="notice">
            Submit your demo track to be considered for Kilifi All Stars Contest.
          </p>

          <label>Name</label>
          <input type="text" required value={name}  onChange={(e) => setName(e.target.value)} />

          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Phone</label>
          <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} />

          <label>Copy of ID (jpg/png/pdf)</label>
          <input
            type="file"
            required
            onChange={(e) => setIdCopy(e.target.files[0])}
            accept=".jpg,.jpeg,.png,.pdf"
          />

          <label>Upload Demo Track (.mp3)</label>
          <input
            type="file"
            required
            onChange={(e) => setDemoTrack(e.target.files[0])}
            accept="audio/*"
          />

          <label>Social Media handles</label>
          <textarea
            required
            placeholder="Facebook: …\nInstagram: …\nTikTok: …\nX (Twitter): …"
            value={socials}
            onChange={(e) => setSocials(e.target.value)}
          />

          {/* BUTTON WITH LOADING STATE */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Submitting…" : "Submit Demo"}
          </button>
        </form>
      </div>
    </div>
  );
}
