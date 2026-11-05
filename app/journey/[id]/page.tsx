import Link from "next/link";
import { notFound } from "next/navigation";
import { journeys } from "@/data/travels";

export function generateStaticParams() {
  return journeys.map((journey) => ({ id: journey.id }));
}

export default async function JourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const journey = journeys.find((item) => item.id === id);
  if (!journey) notFound();

  return (
    <>
      <section className="journey-detail-hero" style={{backgroundImage:`linear-gradient(90deg, rgba(14,25,22,.62), rgba(14,25,22,.05)), url("${journey.image}")`}}>
        <div className="page-wrap detail-hero-content"><Link href="/destinations" className="back-link">← All destinations</Link><p className="eyebrow light">{journey.region} · {journey.duration}</p><h1>{journey.title.split(" ").slice(0, -1).join(" ")} <em>{journey.title.split(" ").slice(-1)}</em></h1><p>{journey.summary}</p><Link className="button button-light" href="mailto:journeys@elsewhere.example?subject=Enquire%20about%20a%20journey">Enquire about this journey <span>↗</span></Link></div>
      </section>
      <section className="page-wrap detail-content section-pad">
        <div className="detail-main"><p className="eyebrow">THE FEELING</p><h2>A little further<br /><em>from the everyday.</em></h2><p>{journey.description}</p><p>Every Elsewhere journey is a starting point, not a fixed package. We’ll shape the pace, places to stay and experiences around you.</p></div>
        <aside className="detail-aside"><p className="eyebrow">AT A GLANCE</p><div><span>WHERE</span><strong>{journey.region}</strong></div><div><span>HOW LONG</span><strong>{journey.duration}</strong></div><div><span>TRAVEL STYLE</span><strong>{journey.style}</strong></div><Link className="button button-dark" href="/concierge">Make it yours <span>↗</span></Link></aside>
      </section>
      <section className="detail-cta"><p className="eyebrow light">YOUR STORY STARTS HERE</p><h2>Let’s make it <em>personal.</em></h2><Link className="button button-light" href="/concierge">Plan with a concierge <span>↗</span></Link></section>
    </>
  );
}
