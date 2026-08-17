import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Odin Digital Academy | Think. Learn. Remember. Lead.",
  description:
    "Odin Digital Academy is a rigorous digital preparatory academy powered by Norse One, an integrated learning and admissions platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="brand">
              <span className="brand-mark">ODA</span>

              <span className="brand-text">
                <strong>ODIN DIGITAL ACADEMY</strong>
                <small>Think. Learn. Remember. Lead.</small>
              </span>
            </Link>

            <nav className="main-navigation" aria-label="Main navigation">
              <Link href="/academics">Academics</Link>
              <Link href="/admissions">Admissions</Link>
              <Link href="/about">About</Link>
              <Link href="/norse-one">Norse One</Link>
            </nav>

            <Link href="/login" className="header-login">
              Login
            </Link>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <span className="footer-brand">ODIN DIGITAL ACADEMY</span>
              <p>
                A modern preparatory academy focused on knowledge, character,
                technology, leadership, and life-ready learning.
              </p>
            </div>

            <div>
              <h3>Academy</h3>
              <Link href="/about">About</Link>
              <Link href="/academics">Academics</Link>
              <Link href="/admissions">Admissions</Link>
              <Link href="/scholarships">Scholarships</Link>
            </div>

            <div>
              <h3>Norse One</h3>
              <Link href="/norse-one">Platform</Link>
              <Link href="/login">Login</Link>
              <Link href="/norse-one/learning">Learning</Link>
              <Link href="/norse-one/resources">Resources</Link>
            </div>

            <div>
              <h3>Connect</h3>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/accessibility">Accessibility</Link>
            </div>
          </div>

          <div className="container footer-bottom">
            <span>© 2026 Odin Digital Academy • NORSE ONE • Learning & Academy Portal</span>
          </div>
        </footer>
      </body>
    </html>
  );
}