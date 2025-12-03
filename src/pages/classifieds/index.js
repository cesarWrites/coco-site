import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClassifiedsPage() {
  const [classifieds, setClassifieds] = useState([]);

  useEffect(() => {
    fetch("https://backend.example.com/classifieds_api.php?action=list")
      .then((res) => res.json())
      .then(setClassifieds)
      .catch(console.error);
  }, []);

  return (
    <div>
    <div className="page-wrapper">
    <Navbar />
    <main className="classifieds-container">
      <h1 className="classifieds-title">Classifieds</h1>

      <div className="classifieds-grid">
        {classifieds.length > 0 ? (
          classifieds.map((item) => (
            <div className="classified-card" key={item.id}>
              <img
                src={item.image_url}
                alt={item.title}
                className="classified-image"
              />
              <h2 className="classified-name">{item.title}</h2>
              <p className="classified-description">{item.description}</p>
              <p className="classified-price">${item.price}</p>
              <button
                className="contact-button"
                onClick={() =>
                  alert(
                    `Contact Seller:\nEmail: ${item.contact_email}\nPhone: ${item.contact_phone}`
                  )
                }
              >
                View Contact
              </button>
            </div>
          ))
        ) : (
          <p className="no-items">No classifieds available yet.</p>
        )}
      </div>

      <div className="add-new-link">
        <Link href="/classifieds/new">Post a new listing →</Link>
      </div>
    </main>
    <Footer/>
    </div>
    </div>
  );
}
