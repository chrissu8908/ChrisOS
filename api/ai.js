// ─── MODEL FALLBACK LIST ───────────────────────────────────────────────────────
// Groq uses its own model slugs — NOT OpenRouter-style "provider/model" paths.
// Order matters: first model is tried first, rest are fallbacks if rate-limited.
// Check current slugs at console.groq.com/docs/models
const MODELS = [
  "openai/gpt-oss-120b",   // primary — largest, best at structured JSON output
  "qwen/qwen3.6-27b",      // fallback #1 — if gpt-oss hits rate limits
  "groq/compound",         // fallback #2 — Groq's own routing model
];

// How long to wait for a single model before giving up and trying the next one
const MODEL_TIMEOUT_MS = 8000;

async function requestGroq(model, { systemPrompt = "", userPrompt = "", maxTokens = 500, jsonMode = false }) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not configured on the server");

  // When jsonMode is on, Groq REQUIRES the word "JSON" in the system message.
  // We append a compact instruction rather than replacing the system prompt.
  const finalSystem = jsonMode && !systemPrompt.toLowerCase().includes("json")
    ? `${systemPrompt}\n\nYou must respond with a single valid JSON object. No markdown, no prose, no code fences.`
    : systemPrompt;

  const messages = [
    { role: "system", content: finalSystem },
    { role: "user", content: userPrompt },
  ];

  const body = {
    model,
    messages,
    max_tokens: Math.min(Number(maxTokens) || 500, 2000),
    temperature: 0.2,
  };

  // response_format forces Groq to validate the output is valid JSON before returning.
  // Without this, the model can produce prose that starts with { and still fail.
  if (jsonMode) body.response_format = { type: "json_object" };

  // Per-model timeout — if one model hangs, fall through to the next
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error?.message || `Groq HTTP ${response.status}`);
    }

    return data?.choices?.[0]?.message?.content || null;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = async function handler(req, res) {
  // 1. Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 2. Handle CORS preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 3. Reject non-POST requests with 405
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { systemPrompt, userPrompt, maxTokens, task } = req.body || {};
  if (!userPrompt && !systemPrompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

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