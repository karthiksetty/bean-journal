"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uumvzroswrgqmaeoqajc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXZ6cm9zd3JncW1hZW9xYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODAwMDksImV4cCI6MjA4ODY1NjAwOX0.IPfyrSTzVa8gVjAj1wk8KUwDd19_RzBonXOLXxofw0I"
);

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => router.replace("/"));
    } else {
      router.replace("/");
    }
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
