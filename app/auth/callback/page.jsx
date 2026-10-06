"use client";
import { useEffect, Suspense } from "react";
import { supabase } from "../../lib/supabase-browser";


function CallbackHandler() {
  useEffect(() => {
    // The client exchanges the link's code on load; wait for that result before moving on.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) window.location.replace("/collection");
      else if (event === "INITIAL_SESSION") window.location.replace("/login");
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#E9E3D6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#161210" }}>
      Signing you in…
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}
