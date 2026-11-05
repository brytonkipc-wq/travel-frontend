"use client";

import { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
}

interface Destination {
  id?: string;
  slug: string;
  name: string;
  country: string;
  category: string | Category;
  image: string;
  description: string;
  price: number;
  highlights?: string[];
}

const API_DESTINATIONS = "https://elsewhere.austratraininginstitute.co.ke/destinations";
const API_CATEGORIES = "https://elsewhere.austratraininginstitute.co.ke/categories";

export default function AdminDashboardPage() {
  const [items, setItems] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    country: "",
    category: "",
    image: "",
    description: "",
    price: "",
  });

  // State fields when adding a brand new category inline
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: "",
    image: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [destRes, catRes] = await Promise.all([
        fetch(API_DESTINATIONS),
        fetch(API_CATEGORIES),
      ]);

      if (!destRes.ok || !catRes.ok) throw new Error("Failed to fetch dashboard data");

      const destData = await destRes.json();
      const catData = await catRes.json();

      setItems(destData);
      setCategories(catData);

      if (catData.length > 0 && !form.category) {
        setForm((prev) => ({ ...prev, category: catData[0]._id }));
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      country: "",
      category: categories[0]?._id || "",
      image: "",
      description: "",
      price: "",
    });
    setNewCategoryForm({ name: "", image: "", description: "" });
  };

  const handleEdit = (item: Destination) => {
    const targetId = item.id || item.slug;
    const catId = typeof item.category === "object" && item.category !== null ? item.category._id : item.category;

    setEditingId(targetId || null);
    setForm({
      name: item.name,
      country: item.country,
      category: catId || "",
      image: item.image,
      description: item.description,
      price: item.price.toString(),
    });
    setNewCategoryForm({ name: "", image: "", description: "" });
  };

  const handleDelete = async (id?: string, slug?: string) => {
    const targetId = id || slug;
    if (!targetId) return;

    if (confirm("Are you sure you want to delete this trip?")) {
      try {
        const res = await fetch(`${API_DESTINATIONS}/${targetId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete destination");
        fetchData();
      } catch (err: any) {
        alert(err.message || "Failed to delete item.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalCategoryId = form.category;

    // If user chose to create a new category inline, send POST request to create it first
    if (form.category === "NEW_CATEGORY") {
      if (!newCategoryForm.name.trim() || !newCategoryForm.image.trim() || !newCategoryForm.description.trim()) {
        alert("Please fill out all fields for the new category.");
        return;
      }

      try {
        const catRes = await fetch(API_CATEGORIES, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCategoryForm),
        });

        if (!catRes.ok) {
          const errData = await catRes.json();
          throw new Error(errData.message || "Failed to create category");
        }

        const newCat = await catRes.json();
        finalCategoryId = newCat._id;
      } catch (err: any) {
        alert(err.message || "Error creating new category.");
        return;
      }
    }

    if (!finalCategoryId) {
      alert("Please select or specify a category.");
      return;
    }

    const slug = form.name.toLowerCase().trim().replace(/\s+/g, "-");
    const payload = {
      slug,
      name: form.name,
      country: form.country,
      category: finalCategoryId,
      image: form.image,
      description: form.description,
      price: parseFloat(form.price),
      highlights: ["Curated stay", "Private transfers"],
    };

    try {
      if (editingId) {
        const res = await fetch(`${API_DESTINATIONS}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update destination");
      } else {
        const res = await fetch(API_DESTINATIONS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create destination");
      }

      fetchData();
      resetForm();
    } catch (err: any) {
      alert(err.message || "An error occurred while saving.");
    }
  };

  return (
    <div className="page-wrap section-pad">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ADMINISTRATIVE DASHBOARD</p>
          <h2>
            Manage <em>Destinations & Categories</em>
          </h2>
        </div>
      </div>

      {error && <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>}

      {/* Add / Edit Form */}
      <div
        style={{
          background: "white",
          padding: "30px",
          border: "1px solid var(--line)",
          marginBottom: "50px",
        }}
      >
        <h3>{editingId ? "Edit Trip / Assign Category" : "Add New Trip"}</h3>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Destination / Trip Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{
              padding: "12px",
              border: "1px solid var(--line)",
              fontFamily: "var(--sans)",
            }}
          />

          <input
            type="text"
            placeholder="Country / Region"
            required
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            style={{
              padding: "12px",
              border: "1px solid var(--line)",
              fontFamily: "var(--sans)",
            }}
          />

          {/* Category Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", gridColumn: "1 / -1" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Select Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{
                padding: "12px",
                border: "1px solid var(--line)",
                background: "white",
                fontFamily: "var(--sans)",
              }}
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              <optgroup label="Existing Categories">
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </optgroup>
              <option value="NEW_CATEGORY">+ Add New Category...</option>
            </select>

            {/* Revealed Inline Form for New Category */}
            {form.category === "NEW_CATEGORY" && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "20px",
                  background: "#fafafa",
                  border: "1px dashed var(--line)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <p style={{ fontWeight: "bold", fontSize: "0.9rem", margin: 0 }}>New Category Details</p>
                <input
                  type="text"
                  placeholder="Category Name (e.g. Coastal, Alpine)"
                  value={newCategoryForm.name}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
                  style={{ padding: "12px", border: "1px solid var(--line)", fontFamily: "var(--sans)", background: "white" }}
                />
                <input
                  type="url"
                  placeholder="Category Image URL"
                  value={newCategoryForm.image}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, image: e.target.value })}
                  style={{ padding: "12px", border: "1px solid var(--line)", fontFamily: "var(--sans)", background: "white" }}
                />
                <textarea
                  placeholder="Category Description"
                  rows={2}
                  value={newCategoryForm.description}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
                  style={{ padding: "12px", border: "1px solid var(--line)", fontFamily: "var(--sans)", background: "white" }}
                />
              </div>
            )}
          </div>

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Price (e.g. 1500)"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            style={{
              padding: "12px",
              border: "1px solid var(--line)",
              fontFamily: "var(--sans)",
            }}
          />

          <input
            type="url"
            placeholder="Image URL (e.g. https://example.com/image.jpg)"
            required
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            style={{
              gridColumn: "1 / -1",
              padding: "12px",
              border: "1px solid var(--line)",
              fontFamily: "var(--sans)",
            }}
          />

          <textarea
            placeholder="Trip Description"
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{
              gridColumn: "1 / -1",
              padding: "12px",
              border: "1px solid var(--line)",
              fontFamily: "var(--sans)",
            }}
          />

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: "15px" }}>
            <button
              type="submit"
              className="button button-dark"
              style={{ cursor: "pointer" }}
            >
              {editingId ? "Update Trip & Category" : "Save Trip"} <span>↗</span>
            </button>
            {editingId && (
              <button
                type="button"
                className="button button-light"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Destination List */}
      <h3>All Trips & Assigned Categories ({items.length})</h3>
      {loading ? (
        <p>Loading trips...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {items.map((item) => {
            const categoryLabel =
              typeof item.category === "object" && item.category !== null
                ? item.category.name
                : categories.find((c) => c._id === item.category)?.name || "Unassigned";

            return (
              <div
                key={item.id || item.slug}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px",
                  background: "white",
                  border: "1px solid var(--line)",
                }}
              >
                <div>
                  <strong style={{ fontSize: "1.1rem" }}>{item.name}</strong>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#202a25",
                      color: "white",
                      padding: "4px 10px",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      fontWeight: 700,
                      marginLeft: "15px",
                    }}
                  >
                    CATEGORY: {categoryLabel.toUpperCase()}
                  </span>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "var(--muted)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {item.country} · ${item.price}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEdit(item)}
                    className="button button-light"
                    style={{ minWidth: "auto", padding: "8px 16px", cursor: "pointer" }}
                  >
                    Edit / Change Category
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.slug)}
                    className="button button-dark"
                    style={{ minWidth: "auto", padding: "8px 16px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}