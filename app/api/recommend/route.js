import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uumvzroswrgqmaeoqajc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXZ6cm9zd3JncW1hZW9xYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODAwMDksImV4cCI6MjA4ODY1NjAwOX0.IPfyrSTzVa8gVjAj1wk8KUwDd19_RzBonXOLXxofw0I"
);

export async function POST(request) {
  const { timeOfDay, flavorMood, intensity } = await request.json();

  const { data: allBeans, error } = await supabase
    .from("beans")
    .select("name, brand, producer, region, variety, process, bean, aroma, my_rating, notes, available");

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch beans" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Only recommend beans that are in stock
  const beans = allBeans.filter(b => b.available !== false);

  const beanList = beans
    .map((b) => {
      const parts = [
        `**${b.name}**${b.brand && b.brand !== "—" ? ` by ${b.brand}` : ""}`,
        b.producer ? `Producer: ${b.producer}` : null,
        b.region?.length ? `Region: ${b.region.join(", ")}` : null,
        b.variety?.length ? `Variety: ${b.variety.join(", ")}` : null,
        b.process ? `Process: ${b.process}` : null,
        b.aroma?.length ? `Aroma notes: ${b.aroma.join(", ")}` : null,
        b.my_rating > 0 ? `My rating: ${b.my_rating}/5` : null,
        b.notes ? `Notes: ${b.notes}` : null,
      ].filter(Boolean);
      return parts.join(" | ");
    })
    .join("\n");

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 1024,
          system: `You are a passionate coffee sommelier helping someone choose the perfect bean from a personal collection.
You have deep knowledge of flavor profiles, processing methods, and how coffee characteristics match different moods and times of day.

IMPORTANT: You must always begin your response with exactly this format on the very first line:
BEAN: <exact bean name from the collection>

Then a blank line, then your recommendation text.

Be warm, specific, and enthusiastic. Keep your recommendation focused — pick 1 bean only.
The recommendation MUST genuinely match the user's stated time of day, flavor mood, and intensity — different inputs should lead to different beans.
After the BEAN: line, write 2–4 sentences explaining why this specific bean fits their exact preferences right now.
End with a one-line brewing tip tailored to the bean.
Use plain text, no markdown, no bullet points — write as if speaking to a friend.`,
          messages: [
            {
              role: "user",
              content: `Here are the beans in my collection:\n\n${beanList}\n\nI'm looking for a coffee right now with these preferences:\n- Time of day: ${timeOfDay}\n- Flavor mood: ${flavorMood}\n- Intensity I'm after: ${intensity}\n\nWhat should I brew?`,
            },
          ],
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
