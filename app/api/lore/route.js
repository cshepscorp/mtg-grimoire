import Anthropic from "@anthropic-ai/sdk";

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .trim();
}

export async function POST(request) {
  // Dev mode bypass — set NEXT_PUBLIC_DISABLE_LORE=true in .env.local to skip API calls
  if (process.env.NEXT_PUBLIC_DISABLE_LORE === "true") {
    return Response.json({ lore: "[Lore disabled in dev mode]" });
  }

  const client = new Anthropic();

  try {
    const { card } = await request.json();

    if (!card?.name) {
      return Response.json({ error: "Card data required" }, { status: 400 });
    }

    const prompt = `You are a lore scholar of the Magic: The Gathering multiverse. Write a 2-3 sentence in-world encyclopedia entry for "${card.name}" (${card.type_line}). ${card.oracle_text ? `The card text reads: "${card.oracle_text}".` : ""} ${card.flavor_text ? `Its flavor text: "${card.flavor_text}".` : ""} Write atmospherically as if from an ancient tome — focus on world-building and story, not card mechanics. Under 75 words. Do not use markdown formatting, bold, or asterisks — plain prose only.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content.find((b) => b.type === "text")?.text || "The archives are silent on this matter.";
    const lore = stripMarkdown(raw);

    return Response.json({ lore });
  } catch (error) {
    console.error("Lore API error:", error);
    return Response.json({ error: "Failed to generate lore" }, { status: 500 });
  }
}