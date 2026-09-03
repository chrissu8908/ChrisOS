const MODELS = [
  "qwen/qwen3.6-27b",
  "deepseek-r1-distill-qwen-32b",
];

async function requestGroq(model, { systemPrompt = "", userPrompt = "", maxTokens = 500, jsonMode = false }) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not configured on the server");

  const messages = model.startsWith("deepseek/")
    ? [{ role: "user", content: `${systemPrompt}\n\n${userPrompt}`.trim() }]
    : [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ];

  const body = {
    model,
    messages,
    max_tokens: Math.min(Number(maxTokens) || 500, 2000),
    temperature: model.startsWith("deepseek/") ? 0.6 : 0.2,
  };

  if (jsonMode) body.response_format = { type: "json_object" };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `Groq HTTP ${response.status}`);
  }

  return data?.choices?.[0]?.message?.content || null;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { systemPrompt, userPrompt, maxTokens, task } = req.body || {};
  if (!userPrompt && !systemPrompt) return res.status(400).json({ error: "Missing prompt" });

  const jsonMode = task === "news" || task === "quote" || task === "test";
  const errors = [];

  for (const model of MODELS) {
    try {
      const text = await requestGroq(model, { systemPrompt, userPrompt, maxTokens, jsonMode });
      if (text) return res.status(200).json({ text, model });
    } catch (error) {
      errors.push(`${model}: ${error?.message || "request failed"}`);
    }
  }

  return res.status(502).json({ error: `All Groq models failed: ${errors.join(" | ")}` });
};
