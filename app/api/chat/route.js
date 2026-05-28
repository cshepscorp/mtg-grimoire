import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .trim();
}

export async function POST(request) {
  try {
    const { messages, card, config } = await request.json();
    const { format, rarities, budget, playstyle, isCommander } = config;

    const systemPrompt = `You are an expert Magic: The Gathering deck builder. The user wants to build a deck around "${card.name}" (${card.type_line}).

Card details:
- Oracle text: ${card.oracle_text || "None"}
- Mana cost: ${card.mana_cost || "None"}
- Set: ${card.set_name}

Deck configuration:
- Format: ${format}
- Mode: ${isCommander ? `Commander (99 cards, ${card.name} is the commander)` : "60-card constructed"}
- Allowed rarities: ${rarities.join(", ")}
- Budget: ${budget}
- Playstyle: ${playstyle}

When presenting a complete deck list, format it as a JSON code block:
\`\`\`json
{
  "deckName": "Name of the deck",
  "description": "One sentence description of the strategy",
  "cards": [
    { "quantity": 4, "name": "Lightning Bolt", "category": "Spells" },
    { "quantity": 37, "name": "Mountain", "category": "Lands" }
  ]
}
\`\`\`

CRITICAL rules for the JSON:
- Combine duplicate cards into a single entry with the correct quantity. NEVER list the same card multiple times. For example, use { "quantity": 29, "name": "Mountain", "category": "Lands" } NOT 29 separate Mountain entries.
- Categories must be one of: Creatures, Spells, Artifacts, Enchantments, Planeswalkers, Lands.
- Total card count must be exactly ${isCommander ? "99" : "60"}.
- Include ${isCommander ? "36-38" : "20-24"} lands.
${isCommander ? `- ${card.name} is the commander — do NOT include it in the card list.` : ""}

Before the JSON, write a brief strategy summary in 3-4 sentences max. No headers, no bullet points, no markdown formatting — plain prose only.

For follow-up questions or tweaks, respond conversationally in plain prose. Only include the JSON block when presenting a full deck list.

You don't have access to real-time prices or current ban lists — say so if asked.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages,
    });

    const raw = response.content.find((b) => b.type === "text")?.text || "";

    // Strip markdown from prose portions only — preserve the JSON block intact
    const jsonMatch = raw.match(/(```json[\s\S]*?```)/);
    if (jsonMatch) {
      const jsonBlock = jsonMatch[1];
      const prose = raw.replace(jsonBlock, "%%JSON%%");
      const cleanProse = stripMarkdown(prose);
      const final = cleanProse.replace("%%JSON%%", jsonBlock);
      return Response.json({ message: final });
    }

    return Response.json({ message: stripMarkdown(raw) });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Failed to get response" }, { status: 500 });
  }
}