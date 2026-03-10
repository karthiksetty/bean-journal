"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uumvzroswrgqmaeoqajc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXZ6cm9zd3JncW1hZW9xYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODAwMDksImV4cCI6MjA4ODY1NjAwOX0.IPfyrSTzVa8gVjAj1wk8KUwDd19_RzBonXOLXxofw0I"
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ background: "#FEFCF8", border: "1px solid #EDE5D8", borderRadius: "24px", padding: "48px 40px", width: "100%", maxWidth: "420px", boxShadow: "0 8px 40px rgba(44,24,16,0.08)", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#C4A882", borderRadius: "24px 24px 0 0" }} />

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#2C1810", fontFamily: "'Playfair Display', serif", marginBottom: "8px" }}>Bean Journal</h1>
            <p style={{ fontSize: "14px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif" }}>Sign in to manage your collection</p>
          </div>

          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>☕</div>
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#2C1810", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>Check your email</p>
              <p style={{ fontSize: "13px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif", lineHeight: "1.6" }}>
                We sent a magic link to <strong style={{ color: "#2C1810" }}>{email}</strong>. Click it to sign in.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #EDE5D8", borderRadius: "10px", background: "#FAF7F2", fontSize: "14px", color: "#2C1810", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                />
              </div>
              {error && <p style={{ fontSize: "13px", color: "#DC2626", fontFamily: "'DM Sans', sans-serif" }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ padding: "13px", background: "#2C1810", border: "none", borderRadius: "12px", color: "#FAF7F2", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Sending…" : "Send magic link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
