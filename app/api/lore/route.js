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
  if (process.env.NEXT_PUBLIC_DISABLE_LORE === "true") {
    return Response.json({ lore: "[Lore disabled in dev mode]" });
  }

  const client = new Anthropic();

  try {
    const { card } = await request.json();

    if (!card?.name) {
      return Response.json({ error: "Card data required" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      system: "You are a lore scholar of the Magic: The Gathering multiverse. You only write in-world encyclopedia entries about MTG cards, characters, places, and lore. You do not answer questions unrelated to Magic: The Gathering.",
      messages: [{
        role: "user",
        content: `Write a 2-3 sentence in-world encyclopedia entry for "${card.name}" (${card.type_line}). ${card.oracle_text ? `The card text reads: "${card.oracle_text}".` : ""} ${card.flavor_text ? `Its flavor text: "${card.flavor_text}".` : ""} Write atmospherically as if from an ancient tome — focus on world-building and story, not card mechanics. Under 75 words. Plain prose only, no markdown.`,
      }],
    });

    const raw = message.content.find((b) => b.type === "text")?.text || "The archives are silent on this matter.";
    return Response.json({ lore: stripMarkdown(raw) });
  } catch (error) {
    console.error("Lore API error:", error);
    return Response.json({ error: "Failed to generate lore" }, { status: 500 });
  }
}
