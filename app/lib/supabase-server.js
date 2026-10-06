import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config";

export async function createSessionClient() {
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: list => list.forEach(({ name, value, options }) => store.set(name, value, options)),
    },
  });
}

// Returns a client acting as the signed-in owner, or null for anyone else.
export async function ownerClient() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.rpc("is_owner");
  return !error && data === true ? supabase : null;
}

export const forbidden = () => Response.json({ error: "Sign in required" }, { status: 401 });
