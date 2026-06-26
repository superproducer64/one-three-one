import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt, systemPrompt, claudeWeight, gptWeight, geminiWeight } = await req.json();

  if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

  const results = { claude: null, gpt: null, gemini: null, errors: [] };
  const calls = [];

  if (claudeWeight > 0) {
    calls.push(
      callClaude(prompt, systemPrompt)
        .then(r => { results.claude = r; })
        .catch(e => { results.errors.push(`Claude: ${e.message}`); })
    );
  }
  if (gptWeight > 0) {
    calls.push(
      callGPT(prompt, systemPrompt)
        .then(r => { results.gpt = r; })
        .catch(e => { results.errors.push(`GPT: ${e.message}`); })
    );
  }
  if (geminiWeight > 0) {
    calls.push(
      callGemini(prompt)
        .then(r => { results.gemini = r; })
        .catch(e => { results.errors.push(`Gemini: ${e.message}`); })
    );
  }

  await Promise.all(calls);

  const total = claudeWeight + gptWeight + geminiWeight;
  const synthParts = [];
  if (results.claude) synthParts.push(`[RESPONSE A — weight ${Math.round(claudeWeight / total * 100)}%]\n${results.claude}`);
  if (results.gpt) synthParts.push(`[RESPONSE B — weight ${Math.round(gptWeight / total * 100)}%]\n${results.gpt}`);
  if (results.gemini) synthParts.push(`[RESPONSE C — weight ${Math.round(geminiWeight / total * 100)}%]\n${results.gemini}`);

  if (!synthParts.length) {
    return NextResponse.json({ error: "All model calls failed", details: results.errors }, { status: 500 });
  }

  // Single model — return directly
  if (synthParts.length === 1) {
    const solo = results.claude || results.gpt || results.gemini;
    return NextResponse.json({ output: solo, modelsUsed: getModelsUsed(results) });
  }

  // Multi-model — synthesize via Claude
  try {
    const synthPrompt = `You are a synthesis engine. Multiple AI models responded to the same prompt. Each response has a weight indicating how much it should influence the final output. Synthesize them into ONE cohesive, polished response that honors those weights. Return only the final synthesized response — no preamble, no labels, no explanation.

ORIGINAL PROMPT: ${prompt}

${synthParts.join("\n\n")}`;

    const finalOutput = await callClaude(synthPrompt, "");
    return NextResponse.json({ output: finalOutput, modelsUsed: getModelsUsed(results) });
  } catch (e) {
    return NextResponse.json({ error: `Synthesis failed: ${e.message}`, details: results.errors }, { status: 500 });
  }
}

function getModelsUsed(results) {
  const used = [];
  if (results.claude) used.push("Claude");
  if (results.gpt) used.push("GPT-4o");
  if (results.gemini) used.push("Gemini");
  return used;
}

async function callClaude(prompt, systemPrompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt || "You are a precise, insightful assistant. Respond directly and concisely.",
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Status ${res.status}`);
  }
  const data = await res.json();
  return data.content[0].text;
}

async function callGPT(prompt, systemPrompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt || "You are a precise, insightful assistant. Respond directly and concisely." },
        { role: "user", content: prompt }
      ]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Status ${res.status}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Status ${res.status}`);
  }
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}
