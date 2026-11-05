"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingForm({ destination }: { destination: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [travelDate, setTravelDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Retrieve active member from localStorage
    const savedMember = localStorage.getItem("elsewhere_member");
    if (!savedMember) {
      setError("You must be registered as a member in the Elsewhere Circle before booking.");
      setLoading(false);
      return;
    }

    const member = JSON.parse(savedMember);

    // Support MongoDB _id, id, or email fallback
    const userId = member._id || member.id || member.email;
    const destId = destination.slug || destination.id || destination._id;

    if (!userId) {
      setError("Member credentials not found. Please log in again.");
      setLoading(false);
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://elsewhere.austratraininginstitute.co.ke";

    try {
      // Send booking request to NestJS backend
      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          destinationId: destId,
          destinationName: destination.name,
          destinationCountry: destination.country,
          travelDate,
          paymentMethod,
          paymentDetails: paymentMethod === "mpesa" ? { phoneNumber } : { cardNumber },
          status: "deposit_paid",
        }),
      });

      if (!res.ok) throw new Error("Failed to process booking and payment.");

      const booking = await res.json();

      // Redirect to booking summary or member trips
      const bookingId = booking?._id || booking?.id;
      if (bookingId) {
        router.push(`/bookings/${bookingId}`);
      } else {
        router.push("/trips");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong connecting to the backend.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleBookingSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {error && <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)" }}>DESIRED TRAVEL DATE</label>
        <input
          type="date"
          required
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          style={{ padding: "12px 14px", border: "1px solid var(--line)", fontFamily: "var(--sans)" }}
        />
      </div>

      {/* Payment Selection Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "var(--surface, #f9f9f9)", padding: "20px", border: "1px solid var(--line)" }}>
        <p className="eyebrow">SELECT PAYMENT METHOD (30% DEPOSIT)</p>

        <div style={{ display: "flex", gap: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600 }}>
            <input
              type="radio"
              name="paymentMethod"
              value="mpesa"
              checked={paymentMethod === "mpesa"}
              onChange={() => setPaymentMethod("mpesa")}
            />
            M-Pesa Express
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600 }}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            Credit / Debit Card
          </label>
        </div>

        {paymentMethod === "mpesa" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)" }}>M-PESA PHONE NUMBER</label>
            <input
              type="tel"
              placeholder="e.g., 0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required={paymentMethod === "mpesa"}
              style={{ padding: "12px 14px", border: "1px solid var(--line)", fontFamily: "var(--sans)", background: "white" }}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)" }}>CARD NUMBER</label>
            <input
              type="text"
              placeholder="4111 2222 3333 4444"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required={paymentMethod === "card"}
              style={{ padding: "12px 14px", border: "1px solid var(--line)", fontFamily: "var(--sans)", background: "white" }}
            />
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="button button-dark" style={{ cursor: "pointer", padding: "16px" }}>
        {loading ? "Processing Payment & Reservation..." : `Authorize Deposit & Reserve — ${destination.price}`} <span>↗</span>
      </button>
    </form>
  );
}