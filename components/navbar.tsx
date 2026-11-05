"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/concierge", label: "Concierge" },
  { href: "/membership", label: "Membership" },
  { href: "/trips", label: "My Trips" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-inner page-wrap">
        <Link className="brand" href="/" aria-label="Elsewhere home">elsewhere<span>®</span><small>TRAVEL, CONSIDERED.</small></Link>
        <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "CLOSE −" : "MENU +"}</button>
        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={pathname === link.href || pathname.startsWith("/journey/") && link.href === "/destinations" ? "nav-link active" : "nav-link"}>{link.label}</Link>)}
          <Link className="nav-cta" href="/concierge" onClick={() => setMenuOpen(false)}>Plan your trip <span>↗</span></Link>
        </nav>
      </div>
    </header>
  );
}
