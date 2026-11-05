import Link from "next/link";

export default function ConciergePage() {
  return (
    <>
      <section className="page-hero concierge-hero">
        <div className="page-wrap page-hero-content"><p className="eyebrow light">YOUR JOURNEY, YOUR WAY</p><h1>Consider it<br /><em>taken care of.</em></h1><p>One conversation. A world of possibilities. Your personal travel concierge turns the “one day” trip into the one you’re taking next.</p><Link className="button button-light" href="mailto:journeys@elsewhere.example?subject=Plan%20my%20journey">Start a conversation <span>↗</span></Link></div>
      </section>
      <section className="page-wrap section-pad">
        <div className="section-heading"><div><p className="eyebrow">HOW IT WORKS</p><h2>Made around <em>you.</em></h2></div><p className="heading-aside">No templates. No endless tabs. Just considered travel, shaped around what matters to you.</p></div>
        <div className="steps-grid">
          {[["01","Tell us what moves you","A place you can’t stop thinking about, a milestone to celebrate, or simply the need to get away."],["02","We make it personal","We bring together thoughtful stays, local experiences and the little details that make it yours."],["03","All that’s left is go","Your plans, beautifully organised. We’re here before you leave and while you’re out in the world."]].map(([n,t,d])=><article className="step-card" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}
        </div>
      </section>
      <section className="concierge-note"><div className="page-wrap concierge-note-inner"><p className="eyebrow">A GOOD PLACE TO BEGIN</p><h2>Where have you<br /><em>been dreaming of?</em></h2><p>Share a few details. We’ll take it from there.</p><Link className="button button-dark" href="mailto:journeys@elsewhere.example?subject=My%20travel%20brief">Tell us your idea <span>↗</span></Link></div></section>
    </>
  );
}
