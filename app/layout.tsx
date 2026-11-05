import type { Metadata } from "next";
import { Suspense } from "react";
import "./global.css";
import "./layout.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Elsewhere — Journeys, considered.",
  description: "Thoughtfully designed journeys for curious travellers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main>{children}</main>
        <footer className="site-footer">
          <a className="footer-brand" href="/">elsewhere<span>®</span></a>
          <p>Go a little further.</p>
          <div className="footer-bottom">
            <span>© 2026 Elsewhere Travel Co.</span>
            <span>Made for the curious.</span>
            <a href="/membership">Travel with us ↗</a>
          </div>
        </footer>
      </body>
    </html>
  );
}