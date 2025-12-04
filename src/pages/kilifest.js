"use client";
import { useState } from "react";
import Image from "next/image";
import beautyBanner from "../assets/kilifest.png"; 

export default function BeautyContestPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idCopy, setIdCopy] = useState(null);
  const [song, setSong] = useState(null);
  const [socials, setSocials] = useState("");
  const [certificate, setCertificate] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idCopy) return alert("Please upload a copy of your ID.");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("socials", socials);
    formData.append("idCopy", idCopy);
    formData.append("certificate", certificate);


    try {
      const res = await fetch("/wp-json/beauty/v1/apply", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Raw server response:", text);
        return alert("Upload failed — server returned invalid JSON.");
      }

      if (res.ok) {
        alert("Application submitted successfully!");
        setName("");
        setEmail("");
        setPhone("");
        setSocials("");
        setIdCopy(null);
      } else {
        alert("Submission failed: " + (data?.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Upload error: " + error.message);
    }
  };

  return (
    <div>
        <a href="/">
       Home
            </a>
    <div className="beauty-page">
      {/* Banner */}
      <div className="banner-wrapper1">
        <Image
          src={beautyBanner}
          alt="Beauty Contest Banner"
          className="banner-img1"
          priority
        />
      </div>

      <h1 className="title">Kilifi Beauty Queens Application</h1>

      <form onSubmit={handleSubmit} className="beauty-form">

        <p className="notice">
          Please fill out the form below to participate in the Kilifi Festival. 
        </p>

        <label>Full Name</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Phone</label>
        <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} />

        <label>Copy of ID (jpg/png/pdf)</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          required
          onChange={(e) => setIdCopy(e.target.files[0])}
        />
        <label>Upload Certificate</label>
      <input
        type="file"
        accept=".pdf,image/png,image/jpeg"
        required
        onChange={(e) => setCertificate(e.target.files[0])}
    />


        <label>Social Media Handles</label>
        <textarea
          required
          placeholder="Facebook: …\nInstagram: …\nTikTok: …\nX (Twitter): …"
          value={socials}
          onChange={(e) => setSocials(e.target.value)}
        ></textarea>

        <button type="submit" className="submit-btn">Submit Application</button>
      </form>
    </div>
    </div>
  );
}
