import { ownerClient, forbidden } from "../../lib/supabase-server";

export async function POST(request) {
  const supabase = await ownerClient();
  if (!supabase) return forbidden();

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
