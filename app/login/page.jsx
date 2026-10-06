"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase-browser";


function friendlyError(message) {
  if (/rate limit/i.test(message)) return "Too many links requested. Wait up to an hour, then try once more.";
  if (/signups? not allowed/i.test(message)) return "This journal is private. Only its owner can sign in.";
  return message;
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Space+Grotesk:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .pl { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; padding: 20px; color: #161210; font-family: 'Space Grotesk', sans-serif; --tf: 'Righteous'; background: #E9E3D6 url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22180%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3CfeColorMatrix values=%220 0 0 0 0.1 0 0 0 0 0.07 0 0 0 0 0.05 0 0 0 0.22 0%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E'); }
  .pl-card { width: 100%; max-width: 440px; background: #F3ECDD; border: 12px solid #161210; box-shadow: 0 24px 50px rgba(22,18,16,.22); }
  .pl-art { position: relative; height: 150px; overflow: hidden; background: #D2483A; }
  .pl-art-shadow { position: absolute; left: 50%; top: calc(50% - 48px); width: 110%; height: 96px; background: rgba(40,12,8,.24); transform-origin: 0 50%; transform: rotate(45deg); }
  .pl-cup { position: absolute; left: 50%; top: 50%; width: 96px; height: 96px; transform: translate(-50%, -50%); }
  .pl-cup-handle { position: absolute; right: -18%; top: 42%; width: 24%; height: 16%; border-radius: 6px; background: #F6F1E6; }
  .pl-cup-body { position: absolute; inset: 0; border-radius: 50%; background: #F6F1E6; }
  .pl-cup-body div { position: absolute; inset: 11%; border-radius: 50%; background: radial-gradient(circle at 42% 38%, #C27A3E 0 22%, #6B2C1F 74%); }
  .pl-body { padding: 24px 24px 26px; }
  .pl-body h1 { font: 400 clamp(34px, 9vw, 44px)/0.9 var(--tf); letter-spacing: .04em; text-transform: uppercase; }
  .pl-sub { margin-top: 10px; font: 500 11px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .pl-form { display: grid; gap: 14px; margin-top: 22px; padding-top: 18px; border-top: 2px solid #161210; }
  .pl-label { display: inline-block; margin-bottom: 6px; padding: 1px 5px; background: #161210; color: #F3ECDD; font: 500 9.5px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .pl-input { width: 100%; height: 50px; padding: 0 12px; border: 2px solid #161210; background: #FBF7EE; color: #161210; font: 500 16px 'Space Grotesk', sans-serif; outline: none; }
  .pl-input:focus { box-shadow: 4px 4px 0 #D9A441; }
  .pl-input::placeholder { color: #161210; opacity: .4; }
  .pl-btn { height: 52px; border: none; background: #161210; color: #F3ECDD; font: 700 16px 'Space Grotesk', sans-serif; cursor: pointer; }
  .pl-btn:hover { background: #D2483A; }
  .pl-btn:disabled { background: #161210; opacity: .5; cursor: not-allowed; }
  .pl-error { padding: 10px 12px; border: 2px solid #D2483A; color: #B23A2E; font: 500 14px/1.4 'Space Grotesk', sans-serif; }
  .pl-sent { margin-top: 22px; padding: 16px; border: 2.5px dashed #161210; font: 400 15px/1.5 'Space Grotesk', sans-serif; }
  .pl-sent b { display: block; margin-bottom: 6px; font: 400 22px/1 var(--tf); letter-spacing: .04em; text-transform: uppercase; }
  .pl-sent strong { overflow-wrap: anywhere; }
  .pl-back { color: #161210; font: 700 14px 'Space Grotesk', sans-serif; text-decoration-thickness: 2px; text-underline-offset: 5px; }
  .pl-back:hover { color: #D2483A; }
`;

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
    if (error) setError(friendlyError(error.message));
    else setSent(true);
  };

  return (
    <>
      <style>{css}</style>
      <div className="pl">
        <div className="pl-card">
          <div className="pl-art">
            <div className="pl-art-shadow" />
            <div className="pl-cup"><div className="pl-cup-handle" /><div className="pl-cup-body"><div /></div></div>
          </div>
          <div className="pl-body">
            <h1>Bean Journal</h1>
            <p className="pl-sub">Sign in to your collection</p>

            {sent ? (
              <div className="pl-sent">
                <b>Check your email</b>
                A sign-in link is on its way to <strong>{email}</strong>. Open it in this same browser.
              </div>
            ) : (
              <form className="pl-form" onSubmit={handleSend}>
                <div>
                  <label className="pl-label" htmlFor="email">Email</label>
                  <input id="email" className="pl-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
                </div>
                {error && <p className="pl-error">{error}</p>}
                <button type="submit" className="pl-btn" disabled={loading}>{loading ? "Sending…" : "Send sign-in link"}</button>
              </form>
            )}
          </div>
        </div>
        <a className="pl-back" href="/">← Back to Bean Journal</a>
      </div>
    </>
  );
}
