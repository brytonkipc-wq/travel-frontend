import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Allows blocking navigation when reading dynamic route params in cacheComponents mode
export const instant = false;

async function BookingContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let booking = null;
  try {
    const res = await fetch(`https://elsewhere.austratraininginstitute.co.ke/bookings/${id}`, { cache: 'no-store' });
    if (res.ok) {
      booking = await res.json();
    }
  } catch (err) {
    // Connection or fetch failed
  }

  if (!booking) {
    notFound();
  }

  return (
    <div className="detail-aside" style={{ borderTop: "2px solid var(--ink)", padding: "30px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid var(--line)" }}>
        <span>BOOKING ID</span>
        <strong>{booking._id}</strong>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid var(--line)" }}>
        <span>MEMBER NAME</span>
        <strong>{booking.user?.name || "Guest Member"}</strong>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid var(--line)" }}>
        <span>MEMBER EMAIL</span>
        <strong>{booking.user?.email || "N/A"}</strong>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid var(--line)" }}>
        <span>DESTINATION</span>
        <strong>{booking.destinationName} ({booking.destinationCountry})</strong>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid var(--line)" }}>
        <span>TRAVEL DATE</span>
        <strong>{new Date(booking.travelDate).toLocaleDateString()}</strong>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid var(--line)" }}>
        <span>STATUS</span>
        <strong style={{ color: "var(--accent)" }}>{booking.status}</strong>
      </div>
    </div>
  );
}

export default function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <section className="simple-page-header page-wrap">
        <p className="eyebrow">BOOKING SUMMARY</p>
        <h1>Reservation <em>Details</em></h1>
        <p>Review your confirmed journey itinerary and member association details.</p>
      </section>

      <section className="page-wrap section-pad" style={{ maxWidth: "800px" }}>
        <Suspense fallback={<p style={{ color: "var(--muted)", padding: "20px 0" }}>Loading reservation details...</p>}>
          <BookingContent params={params} />
        </Suspense>

        <div style={{ marginTop: "40px" }}>
          <Link className="button button-dark" href="/destinations">
            Explore more journeys <span>↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}