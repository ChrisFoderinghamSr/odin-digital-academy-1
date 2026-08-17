"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("We could not sign you in with those credentials.");
      setLoading(false);
      return;
    }

    router.push("/norse-one/dashboard");
  }

  return (
    <main className="login-page">
      <div className="login-panel">
        <div className="login-brand">
          <div className="brand-mark">ODA</div>

          <span>
            ODIN DIGITAL ACADEMY
            <small>NORSE ONE</small>
          </span>
        </div>

        <div className="login-heading">
          <span className="section-label">NORSE ONE</span>

          <h1>Welcome back.</h1>

          <p>Sign in to your Academy workspace.</p>
        </div>

        <form className="academy-form" onSubmit={handleSubmit}>
          <label>
            Email Address

            <input
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="button button-gold"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="login-links">
          <Link href="/login/forgot-password">Forgot Password?</Link>

          <Link href="/admissions/apply">Apply for Admission</Link>
        </div>
      </div>

      <div className="login-art">
        <div className="login-art-circle">
          <span>N</span>
        </div>

        <h2>Norse One</h2>

        <p>One academy. One learning journey.</p>
      </div>
    </main>
  );
}