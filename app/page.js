"use client";
import { useState, useEffect } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; color: #e2e2e8; font-family: 'Space Grotesk', sans-serif; min-height: 100vh; }
  .app { max-width: 900px; margin: 0 auto; padding: 32px 20px 80px; }
  .header { text-align: center; margin-bottom: 48px; }
  .logo { font-family: 'JetBrains Mono', monospace; font-size: 52px; font-weight: 500; letter-spacing: -2px; color: #fff; line-height: 1; }
  .logo span { color: #3b82f6; }
  .tagline { font-size: 13px; color: #555568; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px; font-family: 'JetBrains Mono', monospace; }
  .tabs { display: flex; gap: 2px; background: #13131a; border-radius: 10px; padding: 4px; margin-bottom: 32px; border: 1px solid #1e1e2e; }
  .tab { flex: 1; padding: 10px; background: transparent; border: none; color: #555568; font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; border-radius: 7px; transition: all 0.15s; }
  .tab:hover { color: #9090a8; }
  .tab.active { background: #1e1e2e; color: #e2e2e8; }
  .card { background: #13131a; border: 1px solid #1e1e2e; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
  .card-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #3b82f6; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; }
  label { display: block; font-size: 13px; color: #9090a8; margin-bottom: 6px; font-weight: 500; }
  input[type="text"], textarea, select { width: 100%; background: #0a0a0f; border: 1px solid #1e1e2e; border-radius: 8px; color: #e2e2e8; font-family: 'Space Grotesk', sans-serif; font-size: 14px; padding: 10px 14px; outline: none; transition: border-color 0.15s; }
  input[type="text"]:focus, textarea:focus { border-color: #3b82f6; }
  textarea { resize: vertical; min-height: 100px; }
  .form-row { margin-bottom: 16px; }
  .models-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 8px; }
  .model-block { background: #0a0a0f; border: 1px solid #1e1e2e; border-radius: 10px; padding: 16px; }
  .model-name { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #9090a8; margin-bottom: 8px; }
  .model-weight { font-size: 28px; font-weight: 600; color: #fff; line-height: 1; margin-bottom: 8px; }
  .model-weight span { font-size: 16px; color: #555568; }
  input[type="range"] { width: 100%; accent-color: #3b82f6; cursor: pointer; }
  .weight-total { font-family: 'JetBrains Mono', monospace; font-size: 12px; text-align: right; margin-top: 8px; }
  .weight-total.ok { color: #22c55e; }
  .weight-total.off { color: #f59e0b; }
  .btn { padding: 11px 22px; border-radius: 8px; font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
  .btn-primary { background: #3b82f6; color: #fff; }
  .btn-primary:hover { background: #2563eb; }
  .btn-primary:disabled { background: #1e3a5f; color: #555568; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: #9090a8; border: 1px solid #1e1e2e; }
  .btn-ghost:hover { border-color: #3b82f6; color: #e2e2e8; }
  .btn-danger { background: transparent; color: #ef4444; border: 1px solid #1e1e2e; }
  .btn-danger:hover { border-color: #ef4444; }
  .btn-row { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
  .project-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: #0a0a0f; border: 1px solid #1e1e2e; border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: border-color 0.15s; }
  .project-item:hover { border-color: #3b82f6; }
  .project-item.selected { border-color: #3b82f6; background: #0d1829; }
  .project-title { font-weight: 600; font-size: 15px; }
  .project-meta { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #555568; margin-top: 3px; }
  .project-actions { display: flex; gap: 8px; }
  .output-box { background: #0a0a0f; border: 1px solid #f59e0b44; border-radius: 10px; padding: 20px; font-size: 15px; line-height: 1.7; color: #f0e6c8; white-space: pre-wrap; min-height: 120px; }
  .output-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #f59e0b; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
  .models-used { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #555568; margin-bottom: 12px; }
  .loader { display: flex; align-items: center; gap: 10px; color: #555568; font-family: 'JetBrains Mono', monospace; font-size: 13px; padding: 20px 0; }
  .dot-pulse { display: flex; gap: 5px; }
  .dot-pulse span { width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; animation: pulse 1.2s ease-in-out infinite; }
  .dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
  .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulse { 0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }
  .audit-entry { border-left: 2px solid #1e1e2e; padding: 10px 16px; margin-bottom: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
  .audit-time { color: #3b82f6; margin-bottom: 3px; }
  .audit-action { color: #9090a8; margin-bottom: 2px; }
  .audit-detail { color: #555568; font-size: 11px; }
  .audit-type-synthesis { border-color: #f59e0b; }
  .audit-type-project { border-color: #22c55e; }
  .audit-type-error { border-color: #ef4444; }
  .philosophy { background: linear-gradient(135deg, #0d1829 0%, #13131a 100%); border: 1px solid #1e3a5f; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; display: flex; align-items: flex-start; gap: 16px; }
  .philosophy-mark { font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 700; color: #3b82f6; line-height: 1; flex-shrink: 0; }
  .philosophy-text { font-size: 13px; color: #9090a8; line-height: 1.6; }
  .philosophy-text strong { color: #e2e2e8; }
  .empty { text-align: center; padding: 48px 24px; color: #555568; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
  .section-title { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #e2e2e8; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; }
  .badge-blue { background: #1e3a5f; color: #3b82f6; }
  .error-box { background: #1a0a0a; border: 1px solid #ef444444; border-radius: 10px; padding: 16px; color: #ef4444; font-family: 'JetBrains Mono', monospace; font-size: 13px; margin-top: 12px; }
`;

const ts = () => new Date().toLocaleTimeString("en-US", { hour12: false });
const tsISO = () => new Date().toISOString();
function addAudit(log, type, action, detail = "") {
  return [{ id: Date.now(), time: ts(), isoTime: tsISO(), type, action, detail }, ...log].slice(0, 200);
}

export default function OneThreeOne() {
  const [tab, setTab] = useState("run");
  const [projects, setProjects] = useState(() => { try { return JSON.parse(localStorage.getItem("o31_projects") || "[]"); } catch { return []; } });
  const [auditLog, setAuditLog] = useState(() => { try { return JSON.parse(localStorage.getItem("o31_audit") || "[]"); } catch { return []; } });
  const [selectedProject, setSelectedProject] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [modelsUsed, setModelsUsed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => { localStorage.setItem("o31_projects", JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem("o31_audit", JSON.stringify(auditLog)); }, [auditLog]);

  async function runSynthesis() {
    if (!selectedProject || !prompt.trim()) return;
    setLoading(true);
    setOutput("");
    setError("");
    setModelsUsed([]);

    const log1 = addAudit(auditLog, "synthesis", "Synthesis started", `Project: ${selectedProject.name} | Prompt: ${prompt.slice(0, 80)}...`);
    setAuditLog(log1);

    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemPrompt: selectedProject.systemPrompt || "",
          claudeWeight: selectedProject.claudeWeight,
          gptWeight: selectedProject.gptWeight,
          geminiWeight: selectedProject.geminiWeight
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }

      setOutput(data.output);
      setModelsUsed(data.modelsUsed || []);
      setAuditLog(addAudit(log1, "synthesis", "Synthesis complete", `Models: ${(data.modelsUsed || []).join(", ")} | Output: ${data.output.slice(0, 80)}...`));
    } catch (err) {
      setError(err.message);
      setAuditLog(addAudit(log1, "error", "Synthesis failed", err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="header">
          <div className="logo">1<span>3</span>1</div>
          <div className="tagline">Three Models · One Output · No Overthinking</div>
        </div>

        <div className="tabs">
          {[["run","Run"], ["projects","Projects"], ["audit","Audit Log"]].map(([id, label]) => (
            <button key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {tab === "run" && (
          <div>
            <div className="philosophy">
              <div className="philosophy-mark">80</div>
              <div className="philosophy-text">
                <strong>Eighty percent is a win.</strong> You will never make everyone happy — including yourself. Pick your output, move forward. Analysis paralysis is the enemy of done.
              </div>
            </div>

            <div className="card">
              <div className="card-label">Select Project</div>
              {projects.length === 0 ? (
                <div className="empty">No projects yet. Create one in the Projects tab.</div>
              ) : projects.map(p => (
                <div key={p.id} className={`project-item ${selectedProject?.id === p.id ? "selected" : ""}`}
                  onClick={() => { setSelectedProject(p); setAuditLog(a => addAudit(a, "project", "Project selected", p.name)); }}>
                  <div>
                    <div className="project-title">{p.name}</div>
                    <div className="project-meta">Claude {p.claudeWeight}% · GPT {p.gptWeight}% · Gemini {p.geminiWeight}%</div>
                  </div>
                  {selectedProject?.id === p.id && <span className="badge badge-blue">ACTIVE</span>}
                </div>
              ))}
            </div>

            {selectedProject && (
              <div className="card">
                <div className="card-label">Your Prompt</div>
                <div className="form-row">
                  <textarea placeholder="Enter your prompt here..." value={prompt} onChange={e => setPrompt(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={runSynthesis} disabled={loading || !prompt.trim()}>
                  {loading ? "Synthesizing..." : "Run 1·3·1"}
                </button>
              </div>
            )}

            {loading && (
              <div className="loader">
                <div className="dot-pulse"><span/><span/><span/></div>
                Firing models simultaneously...
              </div>
            )}

            {error && <div className="error-box">Error: {error}</div>}

            {output && !loading && (
              <div className="card">
                <div className="output-label">Synthesized Output</div>
                {modelsUsed.length > 0 && <div className="models-used">via {modelsUsed.join(" · ")}</div>}
                <div className="output-box">{output}</div>
                <div className="btn-row">
                  <button className="btn btn-ghost" onClick={() => navigator.clipboard.writeText(output)}>Copy Output</button>
                  <button className="btn btn-ghost" onClick={() => { setOutput(""); setPrompt(""); setError(""); }}>Clear</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "projects" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div className="section-title">Projects</div>
              <button className="btn btn-primary" onClick={() => { setShowNewProject(true); setEditingProject(null); }}>+ New Project</button>
            </div>

            {(showNewProject || editingProject) && (
              <ProjectForm
                initial={editingProject}
                onSave={(p) => {
                  if (editingProject) {
                    setProjects(ps => ps.map(x => x.id === p.id ? p : x));
                    setAuditLog(a => addAudit(a, "project", "Project updated", p.name));
                  } else {
                    setProjects(ps => [...ps, p]);
                    setAuditLog(a => addAudit(a, "project", "Project created", p.name));
                  }
                  setShowNewProject(false);
                  setEditingProject(null);
                }}
                onCancel={() => { setShowNewProject(false); setEditingProject(null); }}
              />
            )}

            {projects.length === 0 && !showNewProject ? (
              <div className="empty">No projects yet. Create your first one above.</div>
            ) : projects.map(p => (
              <div key={p.id} className="project-item" style={{ cursor: "default" }}>
                <div>
                  <div className="project-title">{p.name}</div>
                  <div className="project-meta">Claude {p.claudeWeight}% · GPT {p.gptWeight}% · Gemini {p.geminiWeight}%</div>
                  {p.description && <div className="project-meta" style={{ marginTop: 4, color: "#9090a8" }}>{p.description}</div>}
                </div>
                <div className="project-actions">
                  <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: 13 }}
                    onClick={() => { setEditingProject(p); setShowNewProject(false); }}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: "6px 14px", fontSize: 13 }}
                    onClick={() => { if (confirm(`Delete "${p.name}"?`)) { setProjects(ps => ps.filter(x => x.id !== p.id)); if (selectedProject?.id === p.id) setSelectedProject(null); setAuditLog(a => addAudit(a, "project", "Project deleted", p.name)); } }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "audit" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div className="section-title">Audit Log</div>
              <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => { if (confirm("Clear audit log?")) setAuditLog([]); }}>Clear Log</button>
            </div>
            <div className="philosophy" style={{ marginBottom: 24 }}>
              <div className="philosophy-mark" style={{ fontSize: 20 }}>↩</div>
              <div className="philosophy-text">
                <strong>Every action is recorded.</strong> If something didn't turn out right, trace it back here. Understand what you did, adjust, and move forward.
              </div>
            </div>
            {auditLog.length === 0 ? (
              <div className="empty">No activity yet. Run a synthesis to start the log.</div>
            ) : auditLog.map(entry => (
              <div key={entry.id} className={`audit-entry audit-type-${entry.type}`}>
                <div className="audit-time">{entry.time}</div>
                <div className="audit-action">{entry.action}</div>
                {entry.detail && <div className="audit-detail">{entry.detail}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ProjectForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [systemPrompt, setSystemPrompt] = useState(initial?.systemPrompt || "");
  const [claudeWeight, setClaudeWeight] = useState(initial?.claudeWeight ?? 40);
  const [gptWeight, setGptWeight] = useState(initial?.gptWeight ?? 35);
  const [geminiWeight, setGeminiWeight] = useState(initial?.geminiWeight ?? 25);
  const total = claudeWeight + gptWeight + geminiWeight;

  function save() {
    if (!name.trim()) { alert("Project needs a name."); return; }
    onSave({ id: initial?.id || Date.now(), name: name.trim(), description: description.trim(), systemPrompt: systemPrompt.trim(), claudeWeight, gptWeight, geminiWeight, createdAt: initial?.createdAt || new Date().toISOString() });
  }

  return (
    <div className="card" style={{ border: "1px solid #3b82f6" }}>
      <div className="card-label">{initial ? "Edit Project" : "New Project"}</div>
      <div className="form-row">
        <label>Project Name</label>
        <input type="text" placeholder="e.g. Screenwriting, Marketing Copy..." value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Description (optional)</label>
        <input type="text" placeholder="What are you using this for?" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="form-row">
        <label>System Prompt (optional)</label>
        <textarea placeholder="e.g. You are helping a film producer develop ideas. Be concise, creative, and grounded." value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} style={{ minHeight: 70 }} />
      </div>
      <div className="card-label" style={{ marginTop: 8 }}>Model Weights</div>
      <div className="models-grid">
        {[
          { label: "Claude", val: claudeWeight, set: setClaudeWeight, color: "#f59e0b" },
          { label: "GPT-4o", val: gptWeight, set: setGptWeight, color: "#22c55e" },
          { label: "Gemini", val: geminiWeight, set: setGeminiWeight, color: "#a78bfa" }
        ].map(({ label, val, set, color }) => (
          <div className="model-block" key={label}>
            <div className="model-name">{label}</div>
            <div className="model-weight" style={{ color }}>{val}<span>%</span></div>
            <input type="range" min={0} max={100} step={5} value={val} onChange={e => set(Number(e.target.value))} />
          </div>
        ))}
      </div>
      <div className={`weight-total ${total === 100 ? "ok" : "off"}`}>
        Total: {total}% {total !== 100 ? `(${total > 100 ? "reduce" : "increase"} by ${Math.abs(100 - total)}%)` : "✓ Good to go"}
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" onClick={save} disabled={total === 0}>Save Project</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
