
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const benefits = [
  ["Considered stays", "Handpicked places with character, comfort and a sense of place."],
  ["Thoughtful extras", "The small touches that turn a good trip into a story worth telling."],
  ["A human in your corner", "A dedicated point of contact to help bring the details together."],
];

interface Member {
  id: string;
  name: string;
  email: string;
}

export default function MembershipPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [memberStatus, setMemberStatus] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://elsewhere.austratraininginstitute.co.ke";

  useEffect(() => {
    const savedMember = localStorage.getItem("elsewhere_member");
    const savedToken = localStorage.getItem("elsewhere_token");

    if (savedMember && savedToken) {
      try {
        setMemberStatus(JSON.parse(savedMember));
      } catch {
        localStorage.removeItem("elsewhere_member");
        localStorage.removeItem("elsewhere_token");
      }
    } else {
      localStorage.removeItem("elsewhere_member");
      localStorage.removeItem("elsewhere_token");
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // STEP 1: Register member
      const registerRes = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(
          registerData.message || "Registration failed."
        );
      }

      // STEP 2: Automatically log in the registered member
      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.access_token) {
        throw new Error(
          loginData.message ||
          "Registration successful, but automatic login failed."
        );
      }

      // STEP 3: Get member information
      const memberId =
        loginData.user?.id ||
        loginData.user?._id ||
        registerData._id ||
        registerData.id;

      if (!memberId) {
        throw new Error("Unable to identify your membership account.");
      }

      const memberObj: Member = {
        id: memberId,
        name:
          loginData.user?.name ||
          registerData.name ||
          name,
        email:
          loginData.user?.email ||
          registerData.email ||
          email,
      };

      // STEP 4: Store member and JWT
      localStorage.setItem(
        "elsewhere_member",
        JSON.stringify(memberObj)
      );

      localStorage.setItem(
        "elsewhere_token",
        loginData.access_token
      );

      setMemberStatus(memberObj);

      setMessage(
        "Welcome to the Elsewhere Circle! You are now eligible to book destinations."
      );

    } catch (err) {
      console.error("Membership registration error:", err);

      setMessage(
        err instanceof Error
          ? err.message
          : "Unable to complete registration. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("elsewhere_member");
    localStorage.removeItem("elsewhere_token");

    setMemberStatus(null);
    setMessage("You have signed out of your membership.");
  };

  return (
    <>
      <section className="page-hero membership-hero">
        <div className="page-wrap page-hero-content">
          <p className="eyebrow light">THE ELSEWHERE CIRCLE</p>
          <h1>
            Closer to the<br />
            <em>good stuff.</em>
          </h1>
          <p>
            A more considered way to see the world, with thoughtful
            privileges and exclusive booking access.
          </p>
        </div>
      </section>

      <section className="page-wrap section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MEMBERSHIP REGISTRATION</p>
            <h2>
              Join the <em>Circle.</em>
            </h2>
          </div>

          <p className="heading-aside">
            Only registered members can reserve Elsewhere journeys.
          </p>
        </div>

        <div
          style={{
            maxWidth: "600px",
            background: "white",
            padding: "40px",
            border: "1px solid var(--line)",
          }}
        >
          {memberStatus ? (
            <div>
              <p className="eyebrow">ACTIVE MEMBER</p>

              <h3>Welcome back, {memberStatus.name}</h3>

              <p
                style={{
                  color: "var(--muted)",
                  marginBottom: "20px",
                }}
              >
                Member Email: {memberStatus.email}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href="/destinations"
                  className="button button-dark"
                >
                  Explore Destinations <span>↗</span>
                </Link>

                <Link
                  href="/member-trips"
                  className="button button-light"
                >
                  My Journeys
                </Link>

                <button
                  onClick={handleLogout}
                  className="button button-light"
                  style={{ cursor: "pointer" }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleRegister}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {message && (
                <p
                  style={{
                    color: "var(--accent)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {message}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--muted)",
                  }}
                >
                  FULL NAME
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    padding: "12px 14px",
                    border: "1px solid var(--line)",
                    fontFamily: "var(--sans)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--muted)",
                  }}
                >
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    padding: "12px 14px",
                    border: "1px solid var(--line)",
                    fontFamily: "var(--sans)",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="button button-dark"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "10px",
                }}
              >
                {loading ? "Registering..." : "Register Membership"}
                <span>↗</span>
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="page-wrap section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MEMBERSHIP, WITH MEANING</p>
            <h2>
              Little things.<br />
              <em>Big difference.</em>
            </h2>
          </div>
        </div>

        <div className="benefits-grid">
          {benefits.map(([title, desc], i) => (
            <article className="benefit-card" key={title}>
              <span>0{i + 1}</span>
              <div className="benefit-icon">
                {["✳", "⌁", "↗"][i]}
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
