import Link from "next/link";
import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";

// Allows blocking navigation for dynamic slug resolution
export const instant = false;

async function fetchDestination(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://elsewhere.austratraininginstitute.co.ke";

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
    throw new Error(`Failed to fetch destination: ${response.status}`);
  }

  return response.json();
}

export default async function BookDestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await fetchDestination(slug);

  if (!destination) {
    notFound();
  }

  // Handle compatibility for backend ID fields (_id vs id vs slug)
  const destId = destination.slug || destination.id || destination._id;

  return (
    <>
      <section className="simple-page-header page-wrap">
        <div style={{ marginBottom: "20px" }}>
          <Link href={`/destinations/${destId}`} className="under-link">
            ← Back to Destination Details
          </Link>
        </div>
        <p className="eyebrow">RESERVE YOUR JOURNEY & PAYMENT</p>
        <h1>Book <em>{destination.name}</em></h1>
        <p>{destination.country} · {destination.price} (30% Deposit required to secure booking)</p>
      </section>

      <section className="page-wrap section-pad" style={{ maxWidth: "700px" }}>
        <div style={{ background: "var(--surface, #f9f9f9)", padding: "24px", border: "1px solid var(--line)", marginBottom: "30px" }}>
          <p className="eyebrow" style={{ marginBottom: "8px" }}>PAYMENT & SECURE CHECKOUT</p>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            To confirm your reservation for <strong>{destination.name}</strong>, a 30% deposit payment is required today. Our concierge team will process your payment securely upon submission.
          </p>
        </div>

        <BookingForm destination={{ ...destination, id: destId }} />
      </section>
    </>
  );
}