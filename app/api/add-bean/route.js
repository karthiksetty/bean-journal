import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uumvzroswrgqmaeoqajc.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXZ6cm9zd3JncW1hZW9xYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODAwMDksImV4cCI6MjA4ODY1NjAwOX0.IPfyrSTzVa8gVjAj1wk8KUwDd19_RzBonXOLXxofw0I"
);

export async function POST(request) {
  try {
    const { bean } = await request.json();

    if (!bean?.name?.trim()) {
      return Response.json({ error: "Bean name is required" }, { status: 400 });
    }

    const dbBean = {
      name: bean.name.trim(),
      brand: bean.brand || "",
      producer: bean.producer || "",
      region: Array.isArray(bean.region) ? bean.region : [],
      variety: Array.isArray(bean.variety) ? bean.variety : [],
      process: bean.process || "",
      bean: bean.bean || "Arabica",
      aroma: Array.isArray(bean.aroma) ? bean.aroma : [],
      my_rating: bean.myRating || 0,
      notes: bean.notes || "",
      available: bean.available !== false,
    };

    const { data, error } = await supabase
      .from("beans")
      .insert([dbBean])
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, bean: data });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
