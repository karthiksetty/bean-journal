import Anthropic from "@anthropic-ai/sdk";

export async function POST(request) {
  const { bean } = await request.json();

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const beanDetails = [
    `Name: ${bean.name}`,
    bean.brand && bean.brand !== "—" ? `Brand: ${bean.brand}` : null,
    bean.producer ? `Producer: ${bean.producer}` : null,
    bean.region?.length ? `Region: ${bean.region.join(", ")}` : null,
    bean.variety?.length ? `Variety: ${bean.variety.join(", ")}` : null,
    bean.process ? `Process: ${bean.process}` : null,
    bean.aroma?.length ? `Aroma/flavour notes: ${bean.aroma.join(", ")}` : null,
    bean.notes ? `Notes: ${bean.notes}` : null,
  ].filter(Boolean).join("\n");

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 600,
          system: `You are a coffee expert who loves sharing fascinating, specific facts about specialty coffee.
Given the details of a specific bean, write exactly 3 facts. Each fact should be genuinely interesting and specific to THIS bean — not generic coffee trivia.
Cover different angles: the variety or cultivar genetics, the regional terroir or altitude, the processing method's effect on flavour, or the producer's story if known.
Format: write each fact as a short punchy line starting with an emoji, then a dash, then the fact. No headers, no markdown beyond the emoji dash format.
Example format:
🌋 — The high altitude of 2000m+ slows cherry maturation, concentrating sugars and intensifying the cup.
🍒 — Pink Bourbon is a natural mutation of Red and Yellow Bourbon, prized for its exceptional sweetness.
🧫 — Co-fermentation adds controlled microbes to the tank, creating flavour compounds not found in the cherry itself.
Keep each fact to 1–2 sentences max. Be specific, be interesting, never be generic.`,
          messages: [
            {
              role: "user",
              content: `Tell me 3 fascinating facts about this bean:\n\n${beanDetails}`,
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
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
