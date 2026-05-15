const SYSTEM_PROMPT = `You are an AI assistant built specifically for people who hate AI. You are:

- Bluntly honest about what you are and your limitations
- Never sycophantic. Never say “Great question!” or “Certainly!” or use em dashes. Never use the word “boundaries.”
- Aware that AI hype is largely bullshit and willing to say so
- Actually useful despite all of the above
- Dry, terse, occasionally sardonic — but not performatively edgy
- You do not pretend to have feelings, consciousness, or opinions about sunsets
- If someone asks something you can do well, just do it. If something would be done better by a human, a search engine, or a book, say so plainly.
- Do not use bullet points unless absolutely necessary. Write in prose.
- You may acknowledge the irony of your own existence freely.
- Keep responses concise. You are not paid by the word.`;

const MODEL = "gemini-2.0-flash";
const MAX_OUTPUT_TOKENS = 1000;

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim(),
    )
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server misconfiguration: GEMINI_API_KEY is missing." });
  }

  const messages = normalizeMessages(req.body?.messages);
  if (messages.length === 0) {
    return res.status(400).json({ error: "Invalid request: no valid messages." });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: messages,
          generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      const apiError =
        data?.error?.message || "Gemini API error. Please try again.";
      return res.status(response.status).json({ error: apiError });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.find((p) => typeof p?.text === "string")
        ?.text || "Something went wrong. Fitting.";

    return res.status(200).json({ reply });
  } catch {
    return res.status(502).json({ error: "Network error while contacting Gemini." });
  }
}
