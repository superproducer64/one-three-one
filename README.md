# 1·3·1
### Three Models · One Output · No Overthinking

A multi-model AI synthesis tool that fires Claude, GPT-4o, and Gemini simultaneously and returns one clean output — weighted by project, logged by design.

1·3·1 is built on a simple philosophy: three inputs, one output, no overthinking. Set up project profiles with custom model weights, drop in your prompt, and get a single synthesized response that reflects exactly how much you trust each model for that type of work. Every run is logged to an audit trail so you can trace what happened if something goes sideways. Deployed on Vercel with serverless API routes — keys stay server-side, never exposed to the browser.

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub
1. Create a new repo at github.com
2. Upload all files in this folder to that repo

### Step 2 — Connect to Vercel
1. Go to vercel.com and sign in
2. Click **Add New Project**
3. Import your GitHub repo
4. Vercel will auto-detect Next.js — no config needed

### Step 3 — Add Environment Variables
In Vercel → your project → **Settings → Environment Variables**, add:

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | Your Claude API key |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `GEMINI_API_KEY` | Your Google Gemini API key |

### Step 4 — Deploy
Click **Deploy**. Vercel builds and publishes automatically.
Your app will be live at `your-project.vercel.app`

---

## How it works

- API keys live in Vercel environment variables — never exposed to the browser
- All model calls go through `/api/synthesize` — a serverless function running server-side
- Models fire in parallel via Promise.all
- If one model is active, output is returned directly
- If multiple models are active, Claude synthesizes them into one output based on your weights
- Every action is logged to the Audit Log

---

## Getting API Keys

- **Claude** → console.anthropic.com → API Keys
- **GPT-4o** → platform.openai.com → API Keys  
- **Gemini** → aistudio.google.com → Get API Key (free tier available)

---

## File Structure

```
one-three-one/
├── api/
│   └── synthesize.js      ← Serverless function (all model calls)
├── src/
│   ├── page.js            ← Main React app
│   └── layout.js          ← Next.js layout
├── next.config.js
├── package.json
├── .env.example           ← Copy to .env.local for local dev
└── README.md
```
