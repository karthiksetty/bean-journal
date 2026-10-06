import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config";

// Keeps the session in cookies so the server can check it before a page loads.
export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
