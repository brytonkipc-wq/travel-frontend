
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  name: string;
  email: string;
}

interface Booking {
  _id: string;
  destinationName: string;
  destinationCountry: string;
  travelDate: string;
  status: string;
}

export default function MemberTripsPage() {
  const router = useRouter();

  const [trips, setTrips] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "past"
  >("all");

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        // Retrieve currently logged-in member
        const savedMember = localStorage.getItem("elsewhere_member");

        if (!savedMember) {
          router.replace("/membership");
          return;
        }

        const member: Member = JSON.parse(savedMember);

        if (!member.id) {
          setError("Member information is incomplete. Please register again.");
          setLoading(false);
          return;
        }

        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://elsewhere.austratraininginstitute.co.ke";

        // Retrieve bookings belonging to this member only
        const res = await fetch(
          `${baseUrl}/bookings/user/${encodeURIComponent(member.id)}`
        );

        if (!res.ok) {
          throw new Error("Unable to retrieve your bookings.");
        }

        const data = await res.json();

        setTrips(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Booking retrieval error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while retrieving your trips."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [router]);

  if (loading) {
    return (
      <section className="page-wrap section-pad">
        <p style={{ color: "var(--muted)" }}>
          Retrieving your itinerary records...
        </p>
      </section>
    );
  }

  const now = new Date();

  // Filter bookings
  const filteredTrips = trips.filter((trip) => {
    const travelDate = new Date(trip.travelDate);
    const isPast = travelDate < now;
    const status = (trip.status || "pending").toLowerCase();

    const isConfirmed =
      status === "confirmed" || status === "deposit_paid";

    if (filter === "pending") {
      return status === "pending" || status === "awaiting_payment";
    }

    if (filter === "confirmed") {
      return isConfirmed && !isPast;
    }

    if (filter === "past") {
      return isPast || status === "completed";
    }

    return true;
  });

  return (
    <>
      <section className="simple-page-header page-wrap">
        <p className="eyebrow">MEMBER CIRCLE</p>
        <h1>
          Your <em>Journeys & Stays</em>
        </h1>
        <p>
          Manage your upcoming reservations, view payment details,
          and review past itineraries.
        </p>
      </section>

      <section className="page-wrap section-pad">

        {error && (
          <p style={{ color: "var(--accent)", marginBottom: "20px" }}>
            {error}
          </p>
        )}

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "40px",
            borderBottom: "1px solid var(--line)",
            paddingBottom: "15px",
            flexWrap: "wrap",
          }}
        >
          {(["all", "confirmed", "pending", "past"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: filter === tab ? 700 : 400,
                  color:
                    filter === tab
                      ? "var(--accent)"
                      : "var(--muted)",
                  borderBottom:
                    filter === tab
                      ? "2px solid var(--accent)"
                      : "2px solid transparent",
                  textTransform: "capitalize",
                  fontFamily: "var(--sans)",
                }}
              >
                {tab === "pending" ? "Awaiting Payment" : tab}
              </button>
            )
          )}
        </div>

        {/* Booking List */}
        {filteredTrips.length === 0 ? (
          <div style={{ padding: "40px 0", color: "var(--muted)" }}>
            <p>No reservations found under this category.</p>

            <Link
              href="/destinations"
              className="button button-dark"
              style={{
                marginTop: "20px",
                display: "inline-block",
              }}
            >
              Explore New Destinations <span>↗</span>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {filteredTrips.map((trip) => {
              const bookingId = trip._id;
              const travelDate = new Date(trip.travelDate);
              const isPast = travelDate < now;
              const status = (trip.status || "pending").toLowerCase();

              const isConfirmed =
                status === "confirmed" || status === "deposit_paid";

              return (
                <div
                  key={bookingId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "24px",
                    background: "var(--surface, #f9f9f9)",
                    border: "1px solid var(--line)",
                    flexWrap: "wrap",
                    gap: "15px",
                  }}
                >
                  <div>
                    <span
                      className="eyebrow"
                      style={{ fontSize: "0.75rem" }}
                    >
                      BOOKING REF: #{bookingId.slice(-6).toUpperCase()}
                    </span>

                    <h3 style={{ margin: "6px 0" }}>
                      {trip.destinationName || "Custom Journey"}
                    </h3>

                    <p
                      style={{
                        color: "var(--muted)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {trip.destinationCountry || "Elsewhere Destination"}
                      {" · "}
                      Travel Date:{" "}
                      <strong>{travelDate.toLocaleDateString()}</strong>
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          background: isConfirmed ? "#e6f4ea" : "#fef7e0",
                          color: isConfirmed ? "#137333" : "#b06000",
                        }}
                      >
                        {isPast ? "COMPLETED" : status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <Link
                      className="button button-dark"
                      href={`/bookings/${bookingId}`}
                    >
                      View Summary <span>↗</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
