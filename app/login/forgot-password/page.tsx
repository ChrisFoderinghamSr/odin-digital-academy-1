// File introduced 2026-08-17 (fe05ed4).
"use client";
import Link from "next/link";
import { useState } from "react";
import { resetPassword } from "./actions";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  return <main className="login-page"><div className="login-panel">
    <h1>Recover your account</h1>
    <p>Request a private recovery link from your academy account administrator. Open the link, then choose a new password.</p>
    <Link href="/contact">Contact the academy</Link>
    <form className="academy-form" action={async data => {
      const token = window.location.hash.slice(1);
      if (!token) { setMessage("Open the recovery link from your administrator first."); return; }
      try {
        const ok = await resetPassword(token, String(data.get("password")));
        setMessage(ok ? "Password updated. You can sign in now." : "The link or password was invalid. Request a new link if it expired.");
        if (ok) window.history.replaceState(null, "", window.location.pathname);
      } catch { setMessage("Recovery is temporarily unavailable. Please retry."); }
    }}>
      <label>New password (at least 12 characters)<input required type="password" name="password" minLength={12} maxLength={72} autoComplete="new-password"/></label>
      <button className="button button-gold">Set new password</button>
    </form><p role="status">{message}</p><Link href="/login">Sign in</Link>
  </div></main>;
}
