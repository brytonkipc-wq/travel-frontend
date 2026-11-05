import Link from "next/link";
import { notFound } from "next/navigation";

// Allow a blocking route for dynamic backend data fetching in Next.js
export const instant = false;

async function fetchApi(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "https://elsewhere.austratraininginstitute.co.ke";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, { cache: "no-store" });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categoryParam = resolvedParams?.category;

  if (!categoryParam) {
    notFound();
  }

  const decodedCategory = decodeURIComponent(categoryParam).trim();

  let categoryName = decodedCategory;
  let destinations: any[] = [];

  try {
    // 1. Try to fetch the category metadata first if the param is a MongoDB ObjectId
    let categoryData = null;
    if (decodedCategory.length === 24) {
      categoryData = await fetchApi(`/categories/${decodedCategory}`);
    }

    if (categoryData && categoryData.name) {
      categoryName = categoryData.name;
    }

    // 2. Fetch destinations filtered by category using your NestJS endpoint
    const data = await fetchApi(`/destinations?category=${encodeURIComponent(decodedCategory)}`);
    if (Array.isArray(data)) {
      destinations = data;
      if (destinations.length > 0 && typeof destinations[0].category === 'object' && destinations[0].category?.name) {
        categoryName = destinations[0].category.name;
      }
    }
  } catch (err) {
    console.error("Failed to fetch category data from backend:", err);
  }

  const displayTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <>
      <section className="simple-page-header page-wrap">
        <div style={{ marginBottom: "20px" }}>
          <Link href="/destinations" className="under-link">
            ← All Categories
          </Link>
        </div>
        <p className="eyebrow">CATEGORY</p>
        <h1>{displayTitle} <em>Destinations</em></h1>
        <p>Explore curated stays tailored to this travel style.</p>
      </section>

      <section className="page-wrap destinations-grid-section">
        {destinations.length === 0 ? (
          <div style={{ padding: "40px 0", color: "var(--muted)" }}>
            <p>No destinations found in this category yet.</p>
          </div>
        ) : (
          <div className="destination-grid">
            {destinations.map((d: any, i: number) => {
              const slug = d.slug || d.id || d._id;
              return (
                <article className="destination-card" key={d._id || slug}>
                  <Link
                    href={`/destinations/${slug}`}
                    className="destination-image"
                    style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(0,0,0,.48)), url("${d.image}")` }}
                  >
                    <span className="destination-index">0{i + 1}</span>
                    <span className="destination-arrow">↗</span>
                    <div>
                      <small>{d.country}</small>
                      <h2>{d.name}</h2>
                    </div>
                  </Link>
                  <p>{d.description}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}