"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://elsewhere.austratraininginstitute.co.ke/categories";

export default function NewCategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create category");
      }

      router.push("/destinations");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrap section-pad" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ marginBottom: "30px" }}>
        <Link href="/destinations" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.9rem" }}>
          ← Back to Destinations
        </Link>
        <p className="eyebrow" style={{ marginTop: "15px" }}>ADMINISTRATION</p>
        <h2>Create New <em>Category</em></h2>
      </div>

      {error && (
        <div style={{ padding: "12px", background: "#fee2e2", color: "#b91c1c", marginBottom: "20px", border: "1px solid #fecaca" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "white", padding: "30px", border: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Category Name</label>
          <input
            type="text"
            placeholder="e.g. Coastal, Alpine, Safari"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ padding: "12px", border: "1px solid var(--line)", fontFamily: "var(--sans)" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Image URL</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            required
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            style={{ padding: "12px", border: "1px solid var(--line)", fontFamily: "var(--sans)" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Description</label>
          <textarea
            placeholder="Explore curated journeys and stays..."
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ padding: "12px", border: "1px solid var(--line)", fontFamily: "var(--sans)" }}
          />
        </div>

        <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
          <button type="submit" disabled={submitting} className="button button-dark" style={{ cursor: "pointer" }}>
            {submitting ? "Saving..." : "Save Category"} <span>↗</span>
          </button>
          <Link href="/destinations" className="button button-light" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}