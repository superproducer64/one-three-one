import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    prompt,
    systemPrompt,
    claudeWeight,
    gptWeight,
    geminiWeight,
    claudeKey,
    gptKey,
    geminiKey,
  } = await req.json();

  if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

  // Use user-supplied keys if provided, fall back to server env vars
  const resolvedKeys = {
    claude: claudeKey || process.env.ANTHROPIC_API_KEY,
    gpt: gptKey || process.env.OPENAI_API_KEY,
    gemini: geminiKey || process.env.GEMINI_API_KEY,
  };

  const results = { claude: null, gpt: null, gemini: null, errors: [] };
  const calls = [];

  if (claudeWeight > 0 && resolvedKeys.claude) {
    calls.push(
      callClaude(prompt, systemPrompt, resolvedKeys.claude)
        .then(r => { results.claude = r; })
        .catch(e => { results.errors.push(`Claude: ${e.message}`); })
    );
  }
  if (gptWeight > 0 && resolvedKeys.gpt) {
    calls.push(
      callGPT(prompt, systemPrompt, resolvedKeys.gpt)
        .then(r => { results.gpt = r; })
        .catch(e => { results.errors.push(`GPT: ${e.message}`); })
    );
  }
  if (geminiWeight > 0 && resolvedKeys.gemini) {
    calls.push(
      callGemini(prompt, resolvedKeys.gemini)
        .then(r => { results.gemini = r; })
        .catch(e => { results.errors.push(`Gemini: ${e.message}`); })
    );
  }

  if (!calls.length) {
    return NextResponse.json({
      error: "No API keys available. Add your keys in Settings to get started.",
    }, { status: 400 });
  }

  await Promise.all(calls);

  const total = claudeWeight + gptWeight + geminiWeight;
  const synthParts = [];
  const usedLabels = [];
  if (results.claude) usedLabels.push("CLAUDE");
  if (results.gpt) usedLabels.push("GPT-4o");
  if (results.gemini) usedLabels.push("GEMINI");
  if (results.claude) synthParts.push(`[CLAUDE — weight ${Math.round(claudeWeight / total * 100)}%]\n${results.claude}`);
  if (results.gpt) synthParts.push(`[GPT-4o — weight ${Math.round(gptWeight / total * 100)}%]\n${results.gpt}`);
  if (results.gemini) synthParts.push(`[GEMINI — weight ${Math.round(geminiWeight / total * 100)}%]\n${results.gemini}`);

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
    const synthPrompt = `You are a synthesis engine. Multiple AI models responded to the same prompt. Each response is labeled with the model that produced it and a weight indicating how much it should influence the final output. Synthesize them into ONE cohesive, polished response that honors those weights.

DEFAULT BEHAVIOR: Return only the final synthesized response — no preamble, no labels, no explanation, and no commentary about the models themselves. Do not recommend a model or approach unless the rule below applies.

MODEL COMPARISON RULE: Only if the ORIGINAL PROMPT explicitly asks which model/response is best, asks you to compare or evaluate the models' outputs, or asks for a model recommendation, append a section titled "Model Comparison" after the synthesized response. In it:
1. Score each response that appears below (refer to them only by their labels: ${usedLabels.join(", ")} — never "Response A/B/C", and never mention any model or tool that is not listed) from 1-5 on each criterion:
   - Structural/mechanical accuracy
   - Depth of content-specific analysis
   - Actionability of suggestions
   - Clarity for the target audience
2. For each criterion, name which model scored best and give a one-line, specific reason tied to what that response actually said or did.
3. Do not give a vague overall endorsement (e.g. "X is best for this"). Only name winners per criterion, and only among the models listed below.
If the ORIGINAL PROMPT does not ask for this, omit the "Model Comparison" section entirely.

ORIGINAL PROMPT: ${prompt}

${synthParts.join("\n\n")}`;

    const finalOutput = await callClaude(synthPrompt, "", resolvedKeys.claude);
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

async function callClaude(prompt, systemPrompt, apiKey) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
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

async function callGPT(prompt, systemPrompt, apiKey) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
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

async function callGemini(prompt, apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
