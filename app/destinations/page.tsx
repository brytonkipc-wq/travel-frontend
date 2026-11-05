"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Category {
  _id?: string;
  name: string;
  image: string;
  description: string;
}

interface Destination {
  category: string | { _id?: string; name?: string };
}

interface Journey {
  id: string;
  region: string;
  title: string;
  duration: string;
}

const API_BASE = "https://elsewhere.austratraininginstitute.co.ke";

export default function DestinationsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catRes, destRes] = await Promise.all([
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/destinations`),
        ]);

        if (!catRes.ok || !destRes.ok) {
          throw new Error("Failed to fetch page data from backend");
        }

        const catData = await catRes.json();
        const destData = await destRes.json();

        setCategories(catData);
        setDestinations(destData);

        // Optional mock journeys or fetch if you have an endpoint for journeys
        setJourneys([
          {
            id: "1",
            region: "Patagonia",
            title: "Glaciers & Fjords Expedition",
            duration: "10 Days",
          },
          {
            id: "2",
            region: "Amalfi Coast",
            title: "Mediterranean Coastal Retreat",
            duration: "7 Days",
          },
        ]);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Compute counts per category (supports populated category object or string/ID)
  const categoryCounts = destinations.reduce(
    (acc, d) => {
      let catKey = "";
      if (typeof d.category === "object" && d.category !== null) {
        catKey = d.category.name || d.category._id || "";
      } else if (typeof d.category === "string") {
        catKey = d.category;
      }
      if (!catKey) return acc;

      const key = catKey.toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <>
      <section className="simple-page-header page-wrap">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <p className="eyebrow">A WORLD OF POSSIBILITY</p>
            <h1>
              Find your <em>category.</em>
            </h1>
            <p>
              Select a style of travel to explore curated destinations and
              journeys.
            </p>
          </div>
          <Link
            href="/destinations/category/new"
            className="button button-dark"
            style={{ textDecoration: "none", padding: "12px 24px" }}
          >
            + Add New Category <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="page-wrap destinations-grid-section">
        {loading && <p>Loading categories...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <div className="destination-grid">
            {categories.map((cat, i) => {
              const count = categoryCounts[cat.name.toLowerCase()] || 0;
              // Pass the category _id in the route URL
              const categoryTarget = cat._id || encodeURIComponent(cat.name.toLowerCase());

              return (
                <article className="destination-card" key={cat._id || cat.name}>
                  <Link
                    href={`/destinations/category/${categoryTarget}`}
                    className="destination-image"
                    style={{
                      backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(0,0,0,.48)), url("${cat.image}")`,
                    }}
                  >
                    <span className="destination-index">0{i + 1}</span>
                    <span className="destination-arrow">↗</span>
                    <div>
                      <small>
                        {count} {count === 1 ? "DESTINATION" : "DESTINATIONS"}
                      </small>
                      <h2>{cat.name}</h2>
                    </div>
                  </Link>
                  <p>{cat.description}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="page-wrap section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE INSPIRATION</p>
            <h2>
              Journeys to <em>get you started.</em>
            </h2>
          </div>
        </div>
        <div className="mini-journey-list">
          {journeys.map((j) => (
            <Link key={j.id} href={`/journey/${j.id}`} className="mini-journey">
              <span>{j.region}</span>
              <strong>{j.title}</strong>
              <span>{j.duration} ↗</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}