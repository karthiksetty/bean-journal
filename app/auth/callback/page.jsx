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
    <div style={{ minHeight: "100vh", background: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", color: "#A0896B", fontSize: "14px" }}>
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
