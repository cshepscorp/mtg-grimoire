"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import { Suspense } from "react";

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? location.origin}/auth/callback` },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? location.origin}/auth/callback` },
    });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0e0c09",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "Georgia, 'Times New Roman', serif",
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", marginBottom: "3rem", textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.16em", color: "#c9b99a", textTransform: "uppercase" }}>
          Grimoire
        </div>
        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 3 }}>
          Magic: The Gathering
        </div>
      </Link>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 400,
        background: "rgba(255,255,255,0.02)",
        border: "0.5px solid rgba(201,185,154,0.18)",
        borderRadius: 12, padding: "2.5rem 2rem",
      }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#c9b99a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Sign in
        </h1>
        <p style={{ fontSize: 13, color: "rgba(201,185,154,0.45)", marginBottom: "2rem", lineHeight: 1.6 }}>
          New? A magic link doubles as sign-up.
        </p>

        {error && (
          <div style={{ background: "rgba(180,60,60,0.15)", border: "0.5px solid rgba(180,60,60,0.3)", borderRadius: 6, padding: "10px 14px", marginBottom: "1.5rem", fontSize: 13, color: "rgba(255,160,160,0.85)" }}>
            Something went wrong. Please try again.
          </div>
        )}

        {status === "sent" ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: 28, marginBottom: "1rem" }}>✦</div>
            <p style={{ color: "#c9b99a", fontSize: 15, marginBottom: "0.5rem" }}>Check your email</p>
            <p style={{ color: "rgba(201,185,154,0.45)", fontSize: 13, lineHeight: 1.6 }}>
              We sent a sign-in link to <strong style={{ color: "rgba(201,185,154,0.7)" }}>{email}</strong>
            </p>
            <button
              onClick={() => setStatus("idle")}
              style={{ marginTop: "1.5rem", background: "transparent", border: "none", color: "rgba(201,185,154,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em" }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            {/* Magic link form */}
            <form onSubmit={handleMagicLink} style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(201,185,154,0.5)", marginBottom: "0.5rem" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(201,185,154,0.25)",
                  borderRadius: 7, padding: "10px 14px", color: "#e8dcc8", fontSize: 14,
                  fontFamily: "inherit", marginBottom: "0.75rem",
                }}
              />
              {status === "error" && (
                <p style={{ fontSize: 12, color: "rgba(255,160,160,0.8)", marginBottom: "0.75rem" }}>{message}</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  width: "100%", padding: "11px", borderRadius: 7,
                  background: "rgba(201,185,154,0.12)", border: "0.5px solid rgba(201,185,154,0.4)",
                  color: "#c9b99a", fontSize: 13, fontFamily: "inherit", letterSpacing: "0.08em",
                  textTransform: "uppercase", cursor: "pointer",
                  opacity: status === "loading" ? 0.6 : 1,
                }}
              >
                {status === "loading" ? "Sending…" : "Send magic link"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(201,185,154,0.12)" }} />
              <span style={{ fontSize: 11, color: "rgba(201,185,154,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>or</span>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(201,185,154,0.12)" }} />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              style={{
                width: "100%", padding: "11px", borderRadius: 7,
                background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(201,185,154,0.18)",
                color: "rgba(201,185,154,0.75)", fontSize: 13, fontFamily: "inherit", letterSpacing: "0.06em",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </>
        )}
      </div>

      <Link href="/" style={{ marginTop: "2rem", fontSize: 12, color: "rgba(201,185,154,0.25)", textDecoration: "none", letterSpacing: "0.08em" }}>
        ← Back to home
      </Link>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
