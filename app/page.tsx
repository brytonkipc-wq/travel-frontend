import Link from "next/link";

export const instant = false;

async function fetchBackendData(endpoint: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://elsewhere.austratraininginstitute.co.ke";

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}${endpoint}`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return [];
  }
}

export default async function HomePage() {
  // Fetch live data in parallel from NestJS backend
  const [journeys, destinations] = await Promise.all([
    fetchBackendData("/journeys"),
    fetchBackendData("/destinations"),
  ]);

  const featuredJourneys = (Array.isArray(journeys) ? journeys : []).slice(0, 3);
  const featuredDestinations = (Array.isArray(destinations) ? destinations : []).slice(0, 2);

  return (
    <>
      <section className="hero">
        <div className="hero-image" role="img" aria-label="Sunlit coast and turquoise water" />
        <div className="hero-shade" />
        <div className="hero-content page-wrap">
          <p className="eyebrow light">TRAVEL, REIMAGINED</p>
          <h1>Go where<br /><em>you feel most alive.</em></h1>
          <p className="hero-copy">Meaningful places. Remarkable stays. Journeys that stay with you long after you return.</p>
          <div className="hero-actions">
            <Link className="button button-light" href="/destinations">Explore journeys <span>↗</span></Link>
            <Link className="text-link light-link" href="/concierge">Meet your concierge <span>→</span></Link>
          </div>
        </div>
        <div className="hero-note"><span className="note-dot" /> MADE FOR THE CURIOUS <span>01 / 04</span></div>
      </section>

      <section className="intro-section page-wrap section-pad">
        <div>
          <p className="eyebrow">A DIFFERENT KIND OF TRAVEL</p>
          <h2>Not just somewhere<br />to go. <em>Something to feel.</em></h2>
        </div>
        <div className="intro-copy">
          <p>We believe the best journeys begin with a feeling, not a checklist. Tell us what moves you and we’ll shape a trip around the things you’ll remember.</p>
          <Link className="under-link" href="/concierge">The Elsewhere approach <span>↗</span></Link>
        </div>
      </section>

      <section className="journey-section section-pad">
        <div className="page-wrap">
          <div className="section-heading">
            <div><p className="eyebrow">THE ART OF GETTING AWAY</p><h2>Journeys worth <em>the detour.</em></h2></div>
            <Link className="under-link" href="/destinations">View all journeys <span>↗</span></Link>
          </div>
          <div className="journey-grid">
            {featuredJourneys.length === 0 ? (
              <p style={{ color: "var(--muted)", padding: "20px 0" }}>Loading journeys from backend...</p>
            ) : (
              featuredJourneys.map((journey: any, i: number) => {
                const jId = journey.slug || journey.id || journey._id;
                return (
                  <Link href={`/destinations/${jId}`} className={`journey-card journey-card-${i + 1}`} key={jId}>
                    <div className="journey-photo" style={{ backgroundImage: `url("${journey.image}")` }}>
                      <span className="card-number">0{i + 1}</span><span className="card-arrow">↗</span>
                    </div>
                    <div className="journey-meta"><span>{journey.region || journey.country}</span><span>{journey.duration || "Custom Stays"}</span></div>
                    <h3>{journey.title || journey.name}</h3>
                    <p>{journey.summary || journey.description}</p>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="destination-strip page-wrap section-pad">
        <div className="destination-copy">
          <p className="eyebrow">FIND YOUR ELSEWHERE</p>
          <h2>The world is wide.<br /><em>Start somewhere.</em></h2>
          <p>From slow mornings on the coast to nights beneath an open sky, find the place that feels like your kind of extraordinary.</p>
          <Link className="button button-dark" href="/destinations">Discover destinations <span>↗</span></Link>
        </div>
        <div className="destination-collage">
          {featuredDestinations.map((d: any, i: number) => {
            const dId = d.slug || d.id || d._id;
            return (
              <Link href={`/destinations/${dId}`} key={d._id || d.name} className={`destination-tile tile-${i + 1}`} style={{ backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,.45)), url("${d.image}")` }}>
                <span>{d.name}</span>
                <small>{d.country}</small>
              </Link>
            );
          })}
          <div className="collage-stamp">THE<br />WORLD<br /><em>IS YOURS</em></div>
        </div>
      </section>

      <section className="quote-section">
        <div className="quote-mark">“</div>
        <blockquote>The most beautiful thing about travel is who you become along the way.</blockquote>
        <p>THE ELSEWHERE PHILOSOPHY</p>
      </section>

      <section className="membership-banner page-wrap">
        <div><p className="eyebrow light">A WORLD OF YOUR OWN</p><h2>Some journeys<br /><em>open every door.</em></h2><p>Thoughtful privileges for people who believe the details make the journey.</p></div>
        <Link className="button button-light" href="/membership">Discover membership <span>↗</span></Link>
      </section>
    </>
  );
}