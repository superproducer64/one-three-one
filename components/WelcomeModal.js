'use client';

import { useState, useEffect } from 'react';

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('131_onboarding_seen');
    if (!seen) setVisible(true);
  }, []);

  const close = () => {
    localStorage.setItem('131_onboarding_seen', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* Close */}
        <button style={styles.closeBtn} onClick={close} aria-label="Close">✕</button>

        {/* Header */}
        <div style={styles.logo}>1·3·1</div>
        <div style={styles.tagline}>Three models. One output. No overthinking.</div>

        {/* Dots — now 4 */}
        <div style={styles.dotsRow}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{...styles.dot, ...(i === step ? styles.dotActive : {})}} />
          ))}
        </div>

        {/* Step 1 */}
        {step === 0 && (
          <div>
            <div style={styles.headline}>You ask once. Three AIs answer.</div>
            <div style={styles.body}>
              You know how you get better answers when you ask multiple smart people instead of just one?
              <br /><br />
              That&apos;s exactly what this does — one prompt goes out to three of the world&apos;s most powerful models simultaneously. Each thinks differently. Then a fourth pass pulls the best of all three into <span style={styles.emphasis}>one clean result</span>.
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btnPrimary} onClick={() => setStep(1)}>How does it work? →</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div>
            <div style={styles.headline}>Each model has a job.</div>
            <div style={styles.body}>They&apos;re not all doing the same thing — each plays to its strength.</div>
            <div style={styles.modelsRow}>
              {[
                { label: 'Claude', role: 'Depth & nuance', color: '#5599dd', bg: '#0d1a2e', border: '#1a4a7a' },
                { label: 'GPT-4o', role: 'Structure & clarity', color: '#44bb77', bg: '#0d2218', border: '#1a6a3a' },
                { label: 'Gemini', role: 'Breadth & research', color: '#ddaa44', bg: '#2a1a0d', border: '#7a4a1a' },
              ].map(m => (
                <div key={m.label} style={{...styles.chip, background: m.bg, borderColor: m.border}}>
                  <div style={{...styles.chipName, color: m.color}}>{m.label}</div>
                  <div style={{...styles.chipRole, color: m.border}}>{m.role}</div>
                </div>
              ))}
            </div>
            <div style={styles.synthesisRow}>
              <div style={styles.synthesisDot} />
              <div style={styles.synthesisLabel}>
                <span style={styles.emphasis}>Synthesis pass</span> — a final Claude review pulls the gold from all three
              </div>
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(0)}>Back</button>
              <button style={styles.btnPrimary} onClick={() => setStep(2)}>Where do I start? →</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div>
            <div style={styles.headline}>Start with the Resume tab.</div>
            <div style={styles.body}>It&apos;s the fastest way to see the engine in action.</div>
            <div style={styles.tipBox}>
              <div style={styles.tipLabel}>Try this</div>
              <div style={styles.tipText}>
                Paste your resume + a job description. Hit run. Three perspectives synthesized into one sharp, actionable result.
              </div>
            </div>
            <div style={styles.body}>
              The <span style={styles.emphasis}>Run tab</span> handles open-ended prompts on any topic. Projects let you save presets for work you repeat often.
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(1)}>Back</button>
              <button style={styles.btnPrimary} onClick={() => setStep(3)}>One more thing →</button>
            </div>
          </div>
        )}

        {/* Step 4 — API Keys */}
        {step === 3 && (
          <div>
            <div style={styles.headline}>Connect your AI keys.</div>
            <div style={styles.body}>
              1·3·1 runs on your own API keys — stored only on your device, never on our servers. Each provider has a free tier to get started.
            </div>

            {[
              { label: 'Claude', color: '#5599dd', bg: '#0d1a2e', border: '#1a4a7a', url: 'https://console.anthropic.com/settings/keys', linkLabel: 'console.anthropic.com' },
              { label: 'GPT-4o', color: '#44bb77', bg: '#0d2218', border: '#1a6a3a', url: 'https://platform.openai.com/api-keys', linkLabel: 'platform.openai.com' },
              { label: 'Gemini', color: '#ddaa44', bg: '#2a1a0d', border: '#7a4a1a', url: 'https://aistudio.google.com/app/apikey', linkLabel: 'aistudio.google.com' },
            ].map(m => (
              <div key={m.label} style={{...styles.keyRow, background: m.bg, borderColor: m.border}}>
                <div style={{...styles.keyLabel, color: m.color}}>{m.label}</div>
                <a href={m.url} target="_blank" rel="noopener noreferrer" style={styles.keyLink}>
                  Get key → {m.linkLabel} ↗
                </a>
              </div>
            ))}

            <div style={{...styles.body, marginTop: '1rem', marginBottom: '0.5rem'}}>
              Add them in the <span style={styles.emphasis}>Settings tab</span> after you close this. You&apos;re all set.
            </div>

            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(2)}>Back</button>
              <button style={styles.btnPrimary} onClick={close}>Let&apos;s go →</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1.5rem',
  },
  modal: {
    background: '#0a0a0f',
    border: '0.5px solid #2a2a3a',
    borderRadius: '16px',
    padding: '2rem 2rem 1.5rem',
    maxWidth: '440px',
    width: '100%',
    color: '#e8e8f0',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: '1rem', right: '1rem',
    background: 'transparent', border: 'none',
    color: '#3a3a5a', fontSize: '18px', cursor: 'pointer', lineHeight: 1,
  },
  logo: { fontSize: '26px', fontWeight: 500, letterSpacing: '0.08em', color: '#ffffff', marginBottom: '4px' },
  tagline: { fontSize: '12px', color: '#5a5a7a', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.5rem' },
  dotsRow: { display: 'flex', gap: '6px', marginBottom: '1.25rem' },
  dot: { width: '5px', height: '5px', borderRadius: '50%', background: '#2a2a3a' },
  dotActive: { background: '#4455ee' },
  headline: { fontSize: '18px', fontWeight: 500, color: '#ffffff', marginBottom: '0.6rem', lineHeight: 1.3 },
  body: { fontSize: '14px', color: '#8888aa', lineHeight: 1.7, marginBottom: '1.25rem' },
  emphasis: { color: '#c8c8e0', fontWeight: 500 },
  modelsRow: { display: 'flex', gap: '8px', marginBottom: '1rem' },
  chip: { flex: 1, borderRadius: '8px', padding: '10px 8px', textAlign: 'center', border: '0.5px solid' },
  chipName: { fontSize: '12px', fontWeight: 500, letterSpacing: '0.03em', marginBottom: '2px' },
  chipRole: { fontSize: '10px' },
  synthesisRow: { display: 'flex', alignItems: 'center', gap: '8px', background: '#13131f', border: '0.5px solid #2a2a3a', borderRadius: '8px', padding: '10px 12px', marginBottom: '1.25rem' },
  synthesisDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#4466ff', flexShrink: 0 },
  synthesisLabel: { fontSize: '12px', color: '#5a5a8a' },
  tipBox: { background: '#0d1020', border: '0.5px solid #2233aa', borderRadius: '8px', padding: '10px 12px', marginBottom: '1rem' },
  tipLabel: { fontSize: '11px', color: '#3344aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' },
  tipText: { fontSize: '13px', color: '#6677cc', lineHeight: 1.5 },
  keyRow: { borderRadius: '8px', padding: '10px 14px', marginBottom: '8px', border: '0.5px solid' },
  keyLabel: { fontSize: '12px', fontWeight: 600, marginBottom: '4px' },
  keyLink: { fontSize: '12px', color: '#4455ee', textDecoration: 'none' },
  btnRow: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '0.5rem' },
  btnPrimary: { flex: 1, background: '#4455ee', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' },
  btnSecondary: { background: 'transparent', color: '#5a5a7a', border: '0.5px solid #2a2a3a', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', cursor: 'pointer' },
};
