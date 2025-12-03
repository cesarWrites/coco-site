import { useState } from "react";

export default function NewClassifiedPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    contact_email: "",
    contact_phone: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    try {
      const res = await fetch(
        "https://backend.cocomedia.co.ke/classifieds_api.php?action=add",
        {
          method: "POST",
          body: formData,
        }
      );
      if (res.ok) {
        alert("Listing submitted successfully!");
        setForm({
          title: "",
          description: "",
          price: "",
          contact_email: "",
          contact_phone: "",
          image: null,
        });
      } else {
        alert("Failed to submit listing.");
      }
    } catch (err) {
      alert("Network error while submitting listing.");
    }
  };

  return (
    <main className="form-container">
      <h1 className="form-title">Post a New Classified</h1>

      <form onSubmit={handleSubmit} className="classified-form">
        <label>Item Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        ></textarea>

        <label>Price (KES)</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <label>Contact Email</label>
        <input
          type="email"
          value={form.contact_email}
          onChange={(e) =>
            setForm({ ...form, contact_email: e.target.value })
          }
          required
        />

        <label>Contact Phone</label>
        <input
          type="tel"
          value={form.contact_phone}
          onChange={(e) =>
            setForm({ ...form, contact_phone: e.target.value })
          }
        />

        <label>Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />

        <button type="submit" className="submit-button">
          Submit Listing
        </button>
      </form>

    
    </main>
  );
}
