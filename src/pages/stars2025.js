import { useState, useEffect } from "react";
import Image from "next/image";
import demo1 from "../assets/kilifest.png"


export default function UploadDemo() {
  const [activeTab, setActiveTab] = useState("artist");
  const [artistName, setArtistName] = useState("");
  const [contact, setContact] = useState("");
  const [file, setFile] = useState(null);
  const [songs, setSongs] = useState([]);

  // Producer login state
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Fetch songs when Producer tab is active
  useEffect(() => {
    if (activeTab === "producer" && loggedIn) {
      fetch("https://backend.cocomedia.co.ke/wp-json/music/v1/list")
        .then((res) => res.json())
        .then((data) => {
          setSongs(Array.isArray(data.songs) ? data.songs : []);
        })
        .catch((err) => {
          console.error(err);
          setSongs([]);
        });
    }
  }, [activeTab, loggedIn]);

  // Artist upload handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a song file.");

    const formData = new FormData();
    formData.append("artistName", artistName);
    formData.append("contact", contact);
    formData.append("file", file);

    try {
      const res = await fetch("/wp-json/music/v1/upload", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Raw server response:", text);
        alert("Upload failed. Check console for details.");
        return;
      }

      if (res.ok) {
        alert("Upload successful!");
        setArtistName("");
        setContact("");
        setFile(null);
      } else {
        alert("Upload failed: " + (data?.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    }
  };

  // Producer login handler
  const handleLogin = (e) => {
    e.preventDefault();
    const validUsername = "admin"
    const validPassword = "secret123"

    console.log("user", process.env.PRODUCER_USERNAME)

    if (username === validUsername && password === validPassword) {
      setLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="upload-container">
       <a href="/">
       Home
            </a>
      <h1 className="title">Kilifi Festival</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "artist" ? "tab active" : "tab"}
          onClick={() => setActiveTab("artist")}
        >
          Artist Song Upload
        </button>
        <button
          className={activeTab === "producer" ? "tab active" : "tab"}
          onClick={() => setActiveTab("producer")}
        >
          Kilifi Talent 
        </button>
      </div>

      {/* Artist Tab */}
      {activeTab === "artist" && (
        <form className="form" onSubmit={handleSubmit}>
            <div className="inst-hint">
            <p>1. Only Upload a .mp3 file</p>
            <p>2. Use your name as the file name</p>
            </div>
          <label>Artist Name</label>
          <input
            type="text"
            required
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />

          <label>Contact</label>
          <input
            type="text"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <label>Upload Song</label>
          <input
            type="file"
            accept="audio/*"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit" className="submit-btn">
            Upload Song
          </button>
        </form>
      )}

      {/* Producer Tab */}
      {/* {activeTab === "producer" && (
        <div className="producer-login-wrapper">
          {!loggedIn ? (
            <form onSubmit={handleLogin} className="producer-login-form">
              <h3>Producer Login</h3>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
          ) : (
            <div className="list-container">
              {songs.length === 0 ? (
                <p>No songs uploaded yet.</p>
              ) : (
                songs.map((song, i) => (
                  <div key={i} className="song-card">
                    <div>
                      <strong>{song.artistName}</strong>
                      <br />
                      <small>{song.contact}</small>
                    </div>

                    <audio controls src={song.fileUrl}></audio>

                    <a className="download-btn" href={song.fileUrl} download>
                      Download
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )} */}
      {activeTab === "producer" && (
        <div className="talent-sect">
            <h2>Be part of the Kilifi Festival experience</h2>
            <Image 
            src={demo1}
            alt="Talent fest"
            width={600}
            height={400}
            />
            </div>
)}

    </div>
  );
}
