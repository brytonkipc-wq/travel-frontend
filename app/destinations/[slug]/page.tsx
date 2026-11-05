
import Link from "next/link";
import { notFound } from "next/navigation";

export const instant = false;

async function fetchDestination(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "https://elsewhere.austratraininginstitute.co.ke";

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/destinations/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch destination: ${response.status}`
    );
  }

  return response.json();
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const destination = await fetchDestination(slug);

  if (!destination) {
    notFound();
  }

  return (
    <>
      <section
        className="journey-detail-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(14,25,22,.62), rgba(14,25,22,.05)), url("${destination.image}")`,
        }}
      >
        <div className="page-wrap detail-hero-content">
          <Link href="/destinations" className="back-link">
            ← All destinations
          </Link>

          <p className="eyebrow light">
            {destination.country}
          </p>

          <h1>{destination.name}</h1>

          <p>{destination.description}</p>

          <Link
            className="button button-light"
            href={`/destinations/${destination.slug}/book`}
          >
            Book this destination <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="page-wrap detail-content section-pad">
        <div className="detail-main">
          <p className="eyebrow">THE EXPERIENCE</p>

          <h2>
            Considered details, <em>tailored for you.</em>
          </h2>

          <p>{destination.description}</p>

          <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>
            What is Included
          </h3>

          <ul
            style={{
              paddingLeft: "20px",
              color: "var(--muted)",
              lineHeight: "2",
            }}
          >
            {(destination.highlights ?? []).map(
              (highlight: string, index: number) => (
                <li key={index}>{highlight}</li>
              )
            )}
          </ul>
        </div>

        <aside className="detail-aside">
          <p className="eyebrow">PRICING & PAYMENTS</p>

          <div>
            <span>RATE</span>
            <strong
              style={{
                fontSize: "1.2rem",
                color: "var(--accent)",
              }}
            >
              {destination.price}
            </strong>
          </div>

          <div>
            <span>PAYMENT TERMS</span>
            <strong>
              {destination.paymentTerms ??
                "30% deposit to secure, balance due 14 days prior"}
            </strong>
          </div>

          <div>
            <span>CANCELLATION</span>
            <strong>
              {destination.cancellationPolicy ??
                "Flexible full refund up to 30 days before travel"}
            </strong>
          </div>

          <Link
            className="button button-dark"
            href={`/destinations/${destination.slug}/book`}
          >
            Book this destination <span>↗</span>
          </Link>
        </aside>
      </section>
    </>
  );
}
