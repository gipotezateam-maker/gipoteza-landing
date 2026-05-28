import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes popIn { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
@keyframes slideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

.ll { font-family:'Inter','Segoe UI',system-ui,sans-serif; background:#0a0a0a; color:#f0ede8; min-height:100vh; }

/* NAV */
.ll-nav { display:flex; align-items:center; justify-content:space-between; padding:16px 32px; border-bottom:1px solid rgba(255,255,255,0.06); position:sticky; top:0; z-index:100; background:rgba(10,10,10,0.95); backdrop-filter:blur(12px); }
.ll-back { background:none; border:none; color:rgba(240,237,232,0.5); cursor:pointer; font-size:14px; font-family:inherit; display:flex; align-items:center; gap:6px; transition:color 0.2s; padding:0; }
.ll-back:hover { color:#f0ede8; }
.ll-nav-right { display:flex; align-items:center; gap:12px; }
.ll-num-badge { background:rgba(255,61,46,0.12); color:#ff3d2e; font-size:11px; font-weight:700; padding:5px 12px; border-radius:100px; letter-spacing:0.5px; }
.ll-xp-badge { background:rgba(255,255,255,0.05); color:rgba(240,237,232,0.6); font-size:11px; font-weight:700; padding:5px 12px; border-radius:100px; }

/* BODY */
.ll-body { max-width:740px; margin:0 auto; padding:48px 32px 100px; animation:fadeUp 0.5s ease; }
@media(max-width:600px) { .ll-body { padding:32px 20px 80px; } }

/* HEADER */
.ll-lesson-label { font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#ff3d2e; margin-bottom:16px; }
.ll-h1 { font-size:clamp(28px,5.5vw,48px); font-weight:900; line-height:1.1; letter-spacing:-0.03em; margin-bottom:20px; }
.ll-h1 em { font-style:normal; color:#ff3d2e; }
.ll-meta { display:flex; align-items:center; gap:16px; margin-bottom:32px; }
.ll-meta-item { font-size:12px; color:rgba(240,237,232,0.4); display:flex; align-items:center; gap:5px; }

/* INTRO */
.ll-intro { font-size:clamp(16px,2.2vw,19px); color:rgba(240,237,232,0.75); line-height:1.75; margin-bottom:48px; padding-bottom:48px; border-bottom:1px solid rgba(255,255,255,0.06); }

/* CONTENT */
.ll-section { margin-bottom:40px; }
.ll-section h2 { font-size:clamp(20px,3vw,26px); font-weight:900; letter-spacing:-0.02em; margin-bottom:16px; line-height:1.2; }
.ll-section h2 em { font-style:normal; color:#ff3d2e; }
.ll-section h3 { font-size:18px; font-weight:800; margin-bottom:12px; color:rgba(240,237,232,0.9); }
.ll-section p { font-size:16px; line-height:1.8; color:rgba(240,237,232,0.75); margin-bottom:16px; }
.ll-section p strong { color:#f0ede8; font-weight:700; }
.ll-section ul { padding-left:0; margin-bottom:16px; list-style:none; }
.ll-section li { font-size:16px; line-height:1.75; color:rgba(240,237,232,0.75); margin-bottom:10px; padding-left:20px; position:relative; }
.ll-section li::before { content:"—"; position:absolute; left:0; color:#ff3d2e; font-weight:700; }

/* QUOTE */
.ll-quote { background:rgba(255,61,46,0.06); border-left:3px solid #ff3d2e; padding:20px 24px; border-radius:0 12px 12px 0; margin:32px 0; }
.ll-quote p { font-size:17px; line-height:1.7; color:rgba(240,237,232,0.85); margin:0; font-style:italic; }
.ll-quote cite { display:block; font-size:13px; color:rgba(240,237,232,0.4); margin-top:10px; font-style:normal; }

/* EXAMPLE CARD */
.ll-example { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:24px; margin:28px 0; }
.ll-example-tag { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#ff3d2e; margin-bottom:12px; }
.ll-example p { font-size:15px; line-height:1.75; color:rgba(240,237,232,0.8); margin-bottom:12px; }
.ll-example p:last-child { margin-bottom:0; }
.ll-example strong { color:#f0ede8; }
.ll-example pre { font-family:inherit; white-space:pre-wrap; font-size:15px; line-height:1.75; color:rgba(240,237,232,0.8); }

/* FUNFACT */
.ll-funfact { background:linear-gradient(135deg,rgba(255,200,0,0.07),rgba(255,150,0,0.03)); border:1px solid rgba(255,200,0,0.15); border-radius:16px; padding:20px 24px; margin:28px 0; }
.ll-funfact p { font-size:15px; line-height:1.7; color:rgba(240,237,232,0.8); margin:0; }

/* SVG ILLUSTRATION */
.ll-svg-wrap { margin:36px 0; text-align:center; }
.ll-svg-caption { font-size:12px; color:rgba(240,237,232,0.35); margin-top:12px; text-align:center; font-style:italic; }

/* DIVIDER */
.ll-divider { height:1px; background:rgba(255,255,255,0.06); margin:48px 0; }

/* TASK BLOCK */
.ll-task { background:rgba(255,255,255,0.02); border:1.5px solid rgba(255,61,46,0.2); border-radius:20px; padding:32px; margin-top:48px; }
.ll-task-header { display:flex; align-items:flex-start; gap:16px; margin-bottom:24px; }
.ll-task-icon { width:44px; height:44px; background:rgba(255,61,46,0.12); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
.ll-task-title { font-size:18px; font-weight:900; margin-bottom:4px; }
.ll-task-sub { font-size:13px; color:rgba(240,237,232,0.45); }
.ll-task-q { font-size:16px; font-weight:600; margin-bottom:20px; line-height:1.55; color:#f0ede8; }

/* OPTIONS */
.ll-options { display:grid; gap:10px; }
.ll-option { background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.1); border-radius:14px; padding:14px 18px; cursor:pointer; transition:all 0.2s; font-size:15px; font-family:inherit; color:#f0ede8; text-align:left; line-height:1.45; }
.ll-option:hover:not(:disabled) { border-color:rgba(255,61,46,0.4); background:rgba(255,61,46,0.06); }
.ll-option.sel { border-color:rgba(255,61,46,0.5); background:rgba(255,61,46,0.08); }
.ll-option.correct { border-color:#22c55e; background:rgba(34,197,94,0.1); color:#86efac; animation:popIn 0.4s ease; }
.ll-option.wrong { border-color:#ef4444; background:rgba(239,68,68,0.1); color:#fca5a5; animation:shake 0.4s ease; }
.ll-option.dimmed { opacity:0.35; }
.ll-option:disabled { cursor:default; }

/* CHECKBOX */
.ll-checks { display:grid; gap:10px; }
.ll-check { display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.1); border-radius:14px; padding:14px 18px; cursor:pointer; transition:all 0.2s; }
.ll-check:hover:not(.ll-check-disabled) { border-color:rgba(255,61,46,0.3); }
.ll-check.ll-check-sel { border-color:rgba(255,61,46,0.5); background:rgba(255,61,46,0.08); }
.ll-check.ll-check-disabled { cursor:default; }
.ll-check.ll-check-correct { border-color:#22c55e; background:rgba(34,197,94,0.08); }
.ll-check.ll-check-wrong { border-color:#ef4444; background:rgba(239,68,68,0.08); }
.ll-checkbox { width:20px; height:20px; border-radius:6px; border:2px solid rgba(255,255,255,0.2); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
.ll-check.ll-check-sel .ll-checkbox { background:#ff3d2e; border-color:#ff3d2e; }
.ll-check-label { font-size:15px; line-height:1.45; }

/* DRAG SORT */
.ll-drag-items { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px; }
.ll-drag-item { background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.12); border-radius:10px; padding:10px 16px; cursor:grab; font-size:14px; font-weight:600; transition:all 0.2s; user-select:none; }
.ll-drag-item:hover { border-color:rgba(255,61,46,0.4); background:rgba(255,61,46,0.08); }
.ll-drag-item.ll-placed { opacity:0.35; cursor:default; }
.ll-drag-item.ll-dragging { border-color:#ff3d2e; background:rgba(255,61,46,0.12); }
.ll-drop-zones { display:grid; gap:10px; }
.ll-drop-zone { background:rgba(255,255,255,0.02); border:1.5px dashed rgba(255,255,255,0.15); border-radius:12px; padding:14px 18px; min-height:52px; display:flex; align-items:center; gap:10px; transition:all 0.2s; }
.ll-drop-zone.ll-zone-filled { border-style:solid; border-color:rgba(255,61,46,0.3); background:rgba(255,61,46,0.05); }
.ll-drop-zone.ll-zone-correct { border-color:#22c55e; background:rgba(34,197,94,0.08); }
.ll-drop-zone.ll-zone-wrong { border-color:#ef4444; background:rgba(239,68,68,0.08); }
.ll-zone-label { font-size:12px; font-weight:700; color:rgba(240,237,232,0.4); letter-spacing:0.5px; white-space:nowrap; }
.ll-zone-value { font-size:14px; font-weight:600; color:#f0ede8; }

/* CALCULATOR TASK */
.ll-calc { display:grid; gap:16px; }
.ll-calc-row { display:flex; flex-direction:column; gap:6px; }
.ll-calc-label { font-size:13px; font-weight:600; color:rgba(240,237,232,0.6); }
.ll-calc-input { background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.1); border-radius:10px; color:#f0ede8; font-family:inherit; font-size:16px; font-weight:700; padding:12px 16px; outline:none; transition:border-color 0.2s; width:100%; }
.ll-calc-input:focus { border-color:#ff3d2e; }
.ll-calc-result { background:rgba(255,61,46,0.08); border:1px solid rgba(255,61,46,0.2); border-radius:12px; padding:16px 20px; margin-top:8px; animation:slideIn 0.3s ease; }
.ll-calc-result-label { font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#ff3d2e; margin-bottom:8px; }
.ll-calc-result-value { font-size:28px; font-weight:900; color:#f0ede8; letter-spacing:-0.02em; }
.ll-calc-result-desc { font-size:13px; color:rgba(240,237,232,0.5); margin-top:4px; }

/* BUILDER TASK */
.ll-builder { display:grid; gap:12px; }
.ll-builder-slot { background:rgba(255,255,255,0.02); border:1.5px dashed rgba(255,255,255,0.12); border-radius:12px; padding:14px 18px; min-height:52px; display:flex; align-items:center; gap:10px; }
.ll-builder-slot.ll-slot-filled { border-style:solid; border-color:rgba(255,61,46,0.25); background:rgba(255,61,46,0.04); }
.ll-builder-slot-label { font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:rgba(240,237,232,0.3); white-space:nowrap; }
.ll-builder-choices { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
.ll-builder-chip { background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.1); border-radius:8px; padding:8px 14px; cursor:pointer; font-size:13px; font-weight:600; transition:all 0.2s; }
.ll-builder-chip:hover { border-color:rgba(255,61,46,0.4); background:rgba(255,61,46,0.08); }
.ll-builder-chip.ll-chip-used { opacity:0.3; cursor:default; }

/* TASK RESULT */
.ll-result { margin-top:20px; padding:18px 22px; border-radius:14px; font-size:15px; line-height:1.65; animation:slideIn 0.3s ease; }
.ll-result.ll-ok { background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2); color:#86efac; }
.ll-result.ll-fail { background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.18); color:#fca5a5; }

/* BUTTONS */
.ll-btn { background:#ff3d2e; color:#fff; border:none; border-radius:12px; font-family:inherit; font-weight:700; font-size:15px; padding:14px 28px; cursor:pointer; transition:all 0.2s; margin-top:16px; }
.ll-btn:hover:not(:disabled) { background:#e8261a; transform:translateY(-1px); }
.ll-btn:disabled { opacity:0.45; cursor:not-allowed; }
.ll-btn-ghost { background:transparent; color:rgba(240,237,232,0.5); border:1.5px solid rgba(255,255,255,0.1); border-radius:12px; font-family:inherit; font-weight:600; font-size:14px; padding:12px 24px; cursor:pointer; transition:all 0.2s; margin-top:12px; margin-left:12px; }
.ll-btn-ghost:hover { border-color:rgba(255,255,255,0.25); color:#f0ede8; }

/* NEXT BUTTON */
.ll-next { display:block; width:100%; background:#ff3d2e; color:#fff; border:none; border-radius:16px; font-family:inherit; font-weight:800; font-size:17px; padding:20px; cursor:pointer; transition:all 0.2s; margin-top:32px; text-align:center; }
.ll-next:hover { background:#e8261a; transform:translateY(-2px); box-shadow:0 12px 36px rgba(255,61,46,0.4); }

/* COMPLETION */
.ll-done { text-align:center; padding:36px; background:rgba(34,197,94,0.07); border:1px solid rgba(34,197,94,0.18); border-radius:20px; margin-top:32px; animation:popIn 0.5s ease; }
.ll-done-emoji { font-size:52px; display:block; margin-bottom:14px; }
.ll-done h3 { font-size:22px; font-weight:900; color:#22c55e; margin-bottom:8px; }
.ll-done p { color:rgba(240,237,232,0.55); font-size:15px; }
.ll-done-xp { display:inline-flex; align-items:center; gap:6px; background:rgba(255,61,46,0.1); border:1px solid rgba(255,61,46,0.2); border-radius:100px; padding:6px 14px; margin-top:12px; font-size:14px; font-weight:700; color:#ff3d2e; }

/* LOCKED */
.ll-locked { text-align:center; padding:80px 24px; }
.ll-locked-icon { font-size:56px; margin-bottom:20px; }
.ll-locked h2 { font-size:26px; font-weight:900; margin-bottom:12px; }
.ll-locked p { color:rgba(240,237,232,0.5); margin-bottom:32px; font-size:16px; }
.ll-locked-btn { display:inline-block; background:#ff3d2e; color:#fff; padding:16px 36px; border-radius:14px; text-decoration:none; font-weight:800; font-size:16px; transition:all 0.2s; }
.ll-locked-btn:hover { background:#e8261a; transform:translateY(-2px); }
`;

// ─── SVG Illustrations ────────────────────────────────────────────────────────

const SVG_MARKETING_FUNNEL = `<svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:400px;width:100%">
  <rect width="400" height="220" rx="12" fill="rgba(255,255,255,0.02)"/>
  <!-- Funnel shape -->
  <polygon points="40,30 360,30 280,90 120,90" fill="rgba(255,61,46,0.15)" stroke="rgba(255,61,46,0.4)" stroke-width="1.5"/>
  <polygon points="120,90 280,90 240,150 160,150" fill="rgba(255,61,46,0.1)" stroke="rgba(255,61,46,0.3)" stroke-width="1.5"/>
  <polygon points="160,150 240,150 220,190 180,190" fill="rgba(255,61,46,0.08)" stroke="rgba(255,61,46,0.25)" stroke-width="1.5"/>
  <!-- Labels -->
  <text x="200" y="65" text-anchor="middle" fill="rgba(240,237,232,0.8)" font-size="13" font-weight="700" font-family="Inter,sans-serif">ТРАФИК</text>
  <text x="200" y="125" text-anchor="middle" fill="rgba(240,237,232,0.7)" font-size="12" font-family="Inter,sans-serif">ЛИДЫ</text>
  <text x="200" y="175" text-anchor="middle" fill="rgba(240,237,232,0.6)" font-size="11" font-family="Inter,sans-serif">КЛИЕНТЫ</text>
  <!-- Numbers -->
  <text x="380" y="65" text-anchor="end" fill="rgba(255,61,46,0.8)" font-size="12" font-family="Inter,sans-serif">1000</text>
  <text x="380" y="125" text-anchor="end" fill="rgba(255,61,46,0.7)" font-size="12" font-family="Inter,sans-serif">300</text>
  <text x="380" y="175" text-anchor="end" fill="rgba(255,61,46,0.6)" font-size="12" font-family="Inter,sans-serif">15</text>
</svg>`;

const SVG_UNIT_ECONOMICS = `<svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:400px;width:100%">
  <rect width="400" height="200" rx="12" fill="rgba(255,255,255,0.02)"/>
  <!-- CAC box -->
  <rect x="20" y="40" width="100" height="60" rx="8" fill="rgba(255,61,46,0.1)" stroke="rgba(255,61,46,0.3)" stroke-width="1.5"/>
  <text x="70" y="68" text-anchor="middle" fill="#ff3d2e" font-size="14" font-weight="900" font-family="Inter,sans-serif">CAC</text>
  <text x="70" y="86" text-anchor="middle" fill="rgba(240,237,232,0.6)" font-size="11" font-family="Inter,sans-serif">2 000 ₽</text>
  <!-- Arrow -->
  <line x1="130" y1="70" x2="165" y2="70" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="148" y="65" text-anchor="middle" fill="rgba(240,237,232,0.3)" font-size="10" font-family="Inter,sans-serif">&lt;</text>
  <!-- LTV box -->
  <rect x="170" y="40" width="100" height="60" rx="8" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.3)" stroke-width="1.5"/>
  <text x="220" y="68" text-anchor="middle" fill="#22c55e" font-size="14" font-weight="900" font-family="Inter,sans-serif">LTV</text>
  <text x="220" y="86" text-anchor="middle" fill="rgba(240,237,232,0.6)" font-size="11" font-family="Inter,sans-serif">24 000 ₽</text>
  <!-- = ROMI -->
  <text x="295" y="75" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="18" font-family="Inter,sans-serif">=</text>
  <!-- ROMI box -->
  <rect x="310" y="40" width="70" height="60" rx="8" fill="rgba(255,200,0,0.1)" stroke="rgba(255,200,0,0.3)" stroke-width="1.5"/>
  <text x="345" y="68" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="900" font-family="Inter,sans-serif">LTV/CAC</text>
  <text x="345" y="86" text-anchor="middle" fill="rgba(240,237,232,0.6)" font-size="11" font-family="Inter,sans-serif">= 12 ✓</text>
  <!-- Bottom label -->
  <text x="200" y="140" text-anchor="middle" fill="rgba(240,237,232,0.4)" font-size="12" font-family="Inter,sans-serif">Норма: LTV/CAC ≥ 3. Отлично: ≥ 10</text>
  <text x="200" y="160" text-anchor="middle" fill="rgba(240,237,232,0.25)" font-size="11" font-family="Inter,sans-serif">Если CAC &gt; LTV — бизнес умирает, просто ещё не знает об этом</text>
</svg>`;

const SVG_CONTENT_PYRAMID = `<svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:400px;width:100%">
  <rect width="400" height="220" rx="12" fill="rgba(255,255,255,0.02)"/>
  <!-- Pyramid layers -->
  <polygon points="200,20 340,170 60,170" fill="rgba(255,61,46,0.08)" stroke="rgba(255,61,46,0.2)" stroke-width="1.5"/>
  <line x1="120" y1="103" x2="280" y2="103" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <line x1="90" y1="136" x2="310" y2="136" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <!-- Labels -->
  <text x="200" y="72" text-anchor="middle" fill="rgba(240,237,232,0.9)" font-size="12" font-weight="700" font-family="Inter,sans-serif">ПРОДАЮЩИЙ</text>
  <text x="200" y="86" text-anchor="middle" fill="rgba(240,237,232,0.5)" font-size="10" font-family="Inter,sans-serif">(только после доверия)</text>
  <text x="200" y="122" text-anchor="middle" fill="rgba(240,237,232,0.9)" font-size="12" font-weight="700" font-family="Inter,sans-serif">ВДОХНОВЛЯЮЩИЙ</text>
  <text x="200" y="155" text-anchor="middle" fill="rgba(240,237,232,0.9)" font-size="12" font-weight="700" font-family="Inter,sans-serif">ОБРАЗОВАТЕЛЬНЫЙ</text>
  <!-- Right labels -->
  <text x="355" y="75" fill="rgba(255,61,46,0.7)" font-size="11" font-family="Inter,sans-serif">10%</text>
  <text x="355" y="122" fill="rgba(255,200,0,0.7)" font-size="11" font-family="Inter,sans-serif">30%</text>
  <text x="355" y="155" fill="rgba(34,197,94,0.7)" font-size="11" font-family="Inter,sans-serif">60%</text>
  <text x="200" y="195" text-anchor="middle" fill="rgba(240,237,232,0.3)" font-size="11" font-family="Inter,sans-serif">Контент-пирамида: сначала ценность, потом продажа</text>
</svg>`;

const SVG_WEBINAR_FUNNEL = `<svg viewBox="0 0 460 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;width:100%">
  <rect width="460" height="200" rx="12" fill="rgba(255,255,255,0.02)"/>
  <rect x="10" y="40" width="60" height="100" rx="6" fill="rgba(255,61,46,0.15)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="40" y="85" text-anchor="middle" fill="rgba(240,237,232,0.8)" font-size="11" font-weight="700" font-family="Inter,sans-serif">Трафик</text>
  <text x="40" y="105" text-anchor="middle" fill="rgba(255,61,46,0.9)" font-size="14" font-weight="900" font-family="Inter,sans-serif">1000</text>
  <text x="75" y="95" fill="rgba(255,255,255,0.2)" font-size="16" font-family="Inter,sans-serif">→</text>
  <rect x="80" y="40" width="60" height="100" rx="6" fill="rgba(255,61,46,0.12)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="110" y="85" text-anchor="middle" fill="rgba(240,237,232,0.8)" font-size="11" font-weight="700" font-family="Inter,sans-serif">Регистр.</text>
  <text x="110" y="105" text-anchor="middle" fill="rgba(255,61,46,0.9)" font-size="14" font-weight="900" font-family="Inter,sans-serif">300</text>
  <text x="145" y="95" fill="rgba(255,255,255,0.2)" font-size="16" font-family="Inter,sans-serif">→</text>
  <rect x="150" y="40" width="60" height="100" rx="6" fill="rgba(255,61,46,0.1)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="180" y="85" text-anchor="middle" fill="rgba(240,237,232,0.8)" font-size="11" font-weight="700" font-family="Inter,sans-serif">Прогрев</text>
  <text x="180" y="105" text-anchor="middle" fill="rgba(255,61,46,0.9)" font-size="14" font-weight="900" font-family="Inter,sans-serif">200</text>
  <text x="215" y="95" fill="rgba(255,255,255,0.2)" font-size="16" font-family="Inter,sans-serif">→</text>
  <rect x="220" y="40" width="60" height="100" rx="6" fill="rgba(255,61,46,0.08)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="250" y="85" text-anchor="middle" fill="rgba(240,237,232,0.8)" font-size="11" font-weight="700" font-family="Inter,sans-serif">Вебинар</text>
  <text x="250" y="105" text-anchor="middle" fill="rgba(255,61,46,0.9)" font-size="14" font-weight="900" font-family="Inter,sans-serif">90</text>
  <text x="285" y="95" fill="rgba(255,255,255,0.2)" font-size="16" font-family="Inter,sans-serif">→</text>
  <rect x="290" y="40" width="60" height="100" rx="6" fill="rgba(255,61,46,0.07)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="320" y="85" text-anchor="middle" fill="rgba(240,237,232,0.8)" font-size="11" font-weight="700" font-family="Inter,sans-serif">Оффер</text>
  <text x="320" y="105" text-anchor="middle" fill="rgba(255,61,46,0.9)" font-size="14" font-weight="900" font-family="Inter,sans-serif">90</text>
  <text x="355" y="95" fill="rgba(255,255,255,0.2)" font-size="16" font-family="Inter,sans-serif">→</text>
  <rect x="360" y="40" width="60" height="100" rx="6" fill="rgba(34,197,94,0.12)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="390" y="85" text-anchor="middle" fill="rgba(240,237,232,0.8)" font-size="11" font-weight="700" font-family="Inter,sans-serif">Продажа</text>
  <text x="390" y="105" text-anchor="middle" fill="#22c55e" font-size="14" font-weight="900" font-family="Inter,sans-serif">8</text>
  <text x="230" y="170" text-anchor="middle" fill="rgba(240,237,232,0.3)" font-size="11" font-family="Inter,sans-serif">Из 1000 кликов — 8 продаж. Каждый этап — точка роста.</text>
</svg>`;

const SVG_LANDING_STRUCTURE = `<svg viewBox="0 0 300 380" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:300px;width:100%">
  <rect width="300" height="380" rx="12" fill="rgba(255,255,255,0.02)"/>
  <rect x="20" y="20" width="260" height="55" rx="8" fill="rgba(255,61,46,0.2)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <text x="36" y="42" fill="#ff3d2e" font-size="11" font-weight="700" font-family="Inter,sans-serif">1. ПЕРВЫЙ ЭКРАН</text>
  <text x="36" y="58" fill="rgba(240,237,232,0.5)" font-size="12" font-family="Inter,sans-serif">Заголовок + CTA</text>
  <rect x="20" y="85" width="260" height="45" rx="8" fill="rgba(255,200,0,0.1)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <text x="36" y="107" fill="#fbbf24" font-size="11" font-weight="700" font-family="Inter,sans-serif">2. БОЛЬ / ПРОБЛЕМА</text>
  <text x="36" y="123" fill="rgba(240,237,232,0.5)" font-size="12" font-family="Inter,sans-serif">Это про тебя?</text>
  <rect x="20" y="140" width="260" height="45" rx="8" fill="rgba(34,197,94,0.1)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <text x="36" y="162" fill="#22c55e" font-size="11" font-weight="700" font-family="Inter,sans-serif">3. РЕШЕНИЕ</text>
  <text x="36" y="178" fill="rgba(240,237,232,0.5)" font-size="12" font-family="Inter,sans-serif">Вот как мы это решаем</text>
  <rect x="20" y="195" width="260" height="55" rx="8" fill="rgba(96,165,250,0.1)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <text x="36" y="217" fill="#60a5fa" font-size="11" font-weight="700" font-family="Inter,sans-serif">4. ДОКАЗАТЕЛЬСТВА</text>
  <text x="36" y="233" fill="rgba(240,237,232,0.5)" font-size="12" font-family="Inter,sans-serif">Кейсы, цифры, отзывы</text>
  <rect x="20" y="260" width="260" height="45" rx="8" fill="rgba(167,139,250,0.1)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <text x="36" y="282" fill="#a78bfa" font-size="11" font-weight="700" font-family="Inter,sans-serif">5. ОФФЕР</text>
  <text x="36" y="298" fill="rgba(240,237,232,0.5)" font-size="12" font-family="Inter,sans-serif">Что конкретно получите</text>
  <rect x="20" y="315" width="260" height="45" rx="8" fill="rgba(255,61,46,0.15)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <text x="36" y="337" fill="#ff3d2e" font-size="11" font-weight="700" font-family="Inter,sans-serif">6. CTA</text>
  <text x="36" y="353" fill="rgba(240,237,232,0.5)" font-size="12" font-family="Inter,sans-serif">Одно действие</text>
</svg>`;

// ─── Lesson content ────────────────────────────────────────────────────────────

interface LessonData {
  id: number;
  title: string;
  titleEm?: string;
  time: string;
  xp: number;
  intro: string;
  sections: Array<{
    type: "h2" | "p" | "quote" | "example" | "funfact" | "svg" | "list";
    content?: string;
    label?: string;
    cite?: string;
    svg?: string;
    caption?: string;
    items?: string[];
  }>;
  task: {
    type: "single" | "multi" | "sort" | "calc" | "builder";
    question: string;
    options?: Array<{ id: string; text: string; correct?: boolean }>;
    zones?: string[];
    explanation: string;
    // calc fields
    calcFields?: Array<{ id: string; label: string; placeholder: string; unit?: string }>;
    calcFormula?: (vals: Record<string, number>) => { label: string; value: string; desc: string }[];
    // builder fields
    builderSlots?: Array<{ id: string; label: string; correctId: string }>;
    builderChips?: Array<{ id: string; text: string }>;
  };
}

const LESSONS_DATA: Record<number, LessonData> = {
  1: {
    id: 1,
    title: "Что такое маркетинг и почему все",
    titleEm: "делают это неправильно",
    time: "15 мин",
    xp: 100,
    intro: "Маркетинг — это не «красивые картинки в Instagram» и не «таргет с бюджетом 10 тысяч». Это система управления вниманием людей. Те, кто понял это первыми, изменили мир. Те, кто не понял — продолжают удивляться, почему реклама не работает.",
    sections: [
      { type: "h2", content: "Три человека, которые придумали маркетинг" },
      { type: "p", content: "**Филип Котлер** — профессор, написавший 60 книг. Его определение: «Маркетинг — это искусство и наука выбора целевых рынков и удержания клиентов через создание, поставку и продвижение превосходной ценности». Звучит как учебник? Потому что это и есть учебник. Но смысл золотой: маркетинг начинается с понимания, **кому** и **зачем** нужен ваш продукт. Не с рекламного кабинета." },
      { type: "p", content: "**Дэвид Огилви** — рекламщик, которого называют «отцом рекламы». Написал объявления для Rolls-Royce, Dove, Hathaway. Его принцип: потребитель не идиот. Он ваша жена. Уважайте его интеллект. Огилви изучал людей, а не придумывал слоганы. Он проводил месяцы, разговаривая с домохозяйками, прежде чем написать рекламу мыла." },
      { type: "p", content: "**Билл Бернбах** из DDB придумал «Думай иначе» задолго до Apple. Его принцип: реклама должна удивлять. Если вы говорите то же самое что все — вас не слышат. Volkswagen Beetle в 1960-х продавали как «маленькую некрасивую машину» — и это сработало, потому что все продавали «большие красивые»." },
      { type: "quote", content: "«Хороший маркетинг делает продажи ненужными»", cite: "— Питер Друкер" },
      { type: "h2", content: "Что маркетинг — это не" },
      { type: "list", items: [
        "Не количество подписчиков в Instagram",
        "Не красивый логотип и фирменный стиль",
        "Не «побольше контента»",
        "Не скидки и акции",
        "Не таргет с бюджетом 5000₽",
      ]},
      { type: "p", content: "Всё это — инструменты. Маркетинг — это стратегия. Инструменты без стратегии — деньги на ветер. Именно поэтому большинство компаний тратят на маркетинг и не понимают, почему не работает." },
      { type: "example", label: "Кейс: Apple 1984", content: "Один ролик на Суперкубке. 60 секунд. Никакого продукта в кадре. Только метафора — «Мы против IBM». Режиссёр Ридли Скотт. Бюджет $900 000. Показали один раз.\n\nРезультат: очередь на Macintosh на следующий день. Продажи превысили план в 4 раза.\n\nЭто маркетинг. Не «запустить рекламу» — а создать историю, которую люди хотят рассказывать друг другу." },
      { type: "funfact", content: "🤯 Dollar Shave Club потратил $4 500 на видео «Our Blades Are F***ing Great». Видео набрало 12 млн просмотров за 48 часов. Через 5 лет Unilever купил компанию за $1 000 000 000. Один хороший маркетинговый ход может стоить больше, чем годы «правильной» рекламы." },
      { type: "svg", svg: SVG_MARKETING_FUNNEL, caption: "Воронка маркетинга: из 1000 человек до клиента доходят единицы. Задача — улучшить каждый этап." },
      { type: "h2", content: "Итог: три вопроса, с которых начинается маркетинг" },
      { type: "list", items: [
        "Кто мой клиент? (не «все», а конкретный человек с конкретной болью)",
        "Что он хочет на самом деле? (не что говорит, а что чувствует)",
        "Почему должен выбрать именно меня? (не «мы лучшие», а конкретное отличие)",
      ]},
      { type: "p", content: "Котлер, Огилви, Бернбах — все трое начинали именно с этих вопросов. И только потом думали о каналах, бюджетах и форматах." },
    ],
    task: {
      type: "single",
      question: "Компания продаёт онлайн-курсы по программированию. Какой подход — настоящий маркетинг?",
      options: [
        { id: "a", text: "Запустить рекламу «Лучшие курсы по Python! Скидка 50%!»", correct: false },
        { id: "b", text: "Выяснить, что аудитория — люди 25–35 лет, хотящие сменить профессию, и показать им истории успеха таких же людей", correct: true },
        { id: "c", text: "Сделать красивый сайт с анимациями и нанять SMM-щика", correct: false },
        { id: "d", text: "Снизить цену до минимума и обогнать конкурентов", correct: false },
      ],
      explanation: "Правильный ответ — Б. Настоящий маркетинг начинается с понимания аудитории: кто эти люди, чего они хотят, чего боятся. Только потом — сообщение и канал. Котлер называл это «ориентацией на потребителя». Скидки и красивый сайт — это тактика без стратегии.",
    },
  },

  2: {
    id: 2,
    title: "Контент-маркетинг: смыслы, копирайтинг",
    titleEm: "и почему «продающий текст» — оксюморон",
    time: "18 мин",
    xp: 120,
    intro: "Каждый день люди видят от 6 000 до 10 000 рекламных сообщений. Ваш текст — один из них. Большинство из этих текстов люди не читают — они их сканируют и закрывают. Разбираемся, как писать так, чтобы читали до конца.",
    sections: [
      { type: "h2", content: "Главный принцип: пиши как говоришь" },
      { type: "p", content: "Возьмите любой корпоративный текст и прочитайте вслух. Если вам неловко — текст плохой. «Осуществляем комплексный подход к реализации маркетинговых коммуникаций» — попробуйте сказать это живому человеку. Он уйдёт." },
      { type: "p", content: "Формула: **пиши как говоришь, сокращай вдвое**. Звучит просто. Работает магически. Большинство людей пишут длинно, потому что боятся показаться недостаточно умными. Парадокс: чем проще текст — тем умнее выглядит автор." },
      { type: "quote", content: "«Если бы у меня было больше времени, я написал бы более короткое письмо»", cite: "— Блез Паскаль, 1657 год. Актуально до сих пор." },
      { type: "h2", content: "Три вопроса перед любым текстом" },
      { type: "list", items: [
        "Кто читает? (конкретный человек, не «целевая аудитория»)",
        "Что они хотят получить? (информацию, решение, эмоцию?)",
        "Почему должны верить именно вам? (доказательство, а не заявление)",
      ]},
      { type: "p", content: "Без ответов на эти вопросы любой текст — это просто слова. Красивые, возможно. Но не работающие." },
      { type: "example", label: "До / После", content: "ДО: «Наша компания предоставляет высококачественные услуги в сфере digital-маркетинга с использованием передовых технологий и индивидуального подхода к каждому клиенту»\n\nПОСЛЕ: «Мы запускаем рекламу, которая окупается. Средний ROMI наших клиентов — 340%»\n\nЧувствуете разницу? Первый вариант говорит о себе. Второй — о результате для клиента. Люди покупают результаты, а не процессы." },
      { type: "funfact", content: "📊 Исследование Nielsen: люди читают в интернете F-образно. Первые строки — полностью. Потом — только начала абзацев. Потом — ничего. Вывод: самое важное — в первых двух предложениях. Всё остальное — для тех, кто уже заинтересован." },
      { type: "svg", svg: SVG_CONTENT_PYRAMID, caption: "Контент-пирамида: 60% — образовательный контент, 30% — вдохновляющий, только 10% — продающий. Именно в таком соотношении строится доверие." },
      { type: "h2", content: "Формула ПИШИ-СОКРАЩАЙ" },
      { type: "p", content: "Шаг 1: Напишите всё что хотите сказать — без ограничений. Шаг 2: Уберите половину. Шаг 3: Уберите ещё треть. Шаг 4: Оставьте только то, без чего смысл теряется." },
      { type: "p", content: "Это больно. Особенно когда вы потратили час на абзац, который потом удаляете. Но это работает. Хемингуэй называл это «убить своих любимцев»." },
      { type: "h2", content: "Три типа контента, которые работают" },
      { type: "list", items: [
        "Образовательный — учит чему-то полезному (как этот курс). Строит экспертность.",
        "Развлекательный — вызывает эмоцию. Строит симпатию.",
        "Вдохновляющий — показывает что возможно. Строит желание.",
      ]},
      { type: "p", content: "Продающий контент работает только когда вы уже завоевали доверие первыми тремя. Компании которые начинают с продающего — получают баннерную слепоту и игнор." },
    ],
    task: {
      type: "multi",
      question: "Выберите ВСЕ признаки хорошего маркетингового текста:",
      options: [
        { id: "a", text: "Написан простым языком, без канцелярита", correct: true },
        { id: "b", text: "Содержит много профессиональных терминов — это показывает экспертность", correct: false },
        { id: "c", text: "Говорит о выгодах для читателя, а не о характеристиках продукта", correct: true },
        { id: "d", text: "Начинается с самого важного", correct: true },
        { id: "e", text: "Максимально длинный — чем больше информации, тем лучше", correct: false },
      ],
      explanation: "Хороший текст: простой язык (А), фокус на выгодах (В), важное — в начале (Г). Термины без объяснений отталкивают читателя. Длина ради длины убивает конверсию — Nielsen доказал, что люди читают F-образно.",
    },
  },

  3: {
    id: 3,
    title: "Юнит-экономика:",
    titleEm: "считаем деньги любого проекта",
    time: "20 мин",
    xp: 150,
    intro: "Маркетинг без цифр — это искусство. Маркетинг с цифрами — это бизнес. Разбираемся с тремя метриками, которые должен знать каждый маркетолог наизусть. Без них вы не можете обосновать бюджет, доказать эффективность или принять решение о масштабировании.",
    sections: [
      { type: "h2", content: "CAC — сколько стоит один клиент" },
      { type: "p", content: "**CAC (Customer Acquisition Cost)** — стоимость привлечения одного клиента. Формула простая: всё что потратили на маркетинг ÷ количество новых клиентов." },
      { type: "p", content: "Важно: в CAC входит **всё** — рекламный бюджет, зарплата маркетолога, стоимость инструментов, агентские комиссии. Многие считают только рекламный бюджет и удивляются, почему цифры не сходятся с реальностью." },
      { type: "example", label: "Пример расчёта CAC", content: "Рекламный бюджет: 80 000 ₽\nЗарплата маркетолога (доля): 20 000 ₽\nИнструменты и сервисы: 5 000 ₽\nИтого затрат: 105 000 ₽\n\nНовых клиентов за месяц: 35\n\nCAC = 105 000 / 35 = 3 000 ₽" },
      { type: "h2", content: "LTV — сколько клиент принесёт за всё время" },
      { type: "p", content: "**LTV (Lifetime Value)** — сколько денег клиент принесёт за всё время работы с вами. Формула: средний чек × частота покупок × срок жизни клиента." },
      { type: "p", content: "LTV — это самая недооценённая метрика. Большинство компаний смотрят только на первую продажу. Но настоящие деньги — в повторных покупках. Amazon зарабатывает на Prime-подписчиках в 4 раза больше, чем на разовых покупателях." },
      { type: "quote", content: "«Если LTV > CAC — бизнес работает. Если CAC > LTV — бизнес умирает, просто ещё не знает об этом»" },
      { type: "h2", content: "ROMI — возврат на маркетинговые инвестиции" },
      { type: "p", content: "**ROMI (Return on Marketing Investment)** — возврат на маркетинговые инвестиции. Формула: (Прибыль от маркетинга − Затраты на маркетинг) / Затраты × 100%." },
      { type: "p", content: "ROMI 0% — вы в ноль. ROMI 100% — вы удвоили вложения. ROMI 300% — вы получили 4 рубля на каждый вложенный рубль. Норма для хорошей воронки — 200–400%." },
      { type: "svg", svg: SVG_UNIT_ECONOMICS, caption: "Соотношение CAC и LTV — главный индикатор здоровья бизнеса. LTV/CAC ≥ 3 — норма. ≥ 10 — отлично." },
      { type: "funfact", content: "💡 По данным HubSpot, компании которые считают ROI маркетинга, в 1.6 раза чаще получают бюджет на следующий год. Цифры — это не скучно. Это власть. Маркетолог который умеет считать — стоит в 2–3 раза дороже того, кто только «делает контент»." },
      { type: "h2", content: "Почему это важно именно маркетологу" },
      { type: "list", items: [
        "Без CAC вы не знаете, какой канал окупается, а какой сжигает деньги",
        "Без LTV вы не можете обосновать увеличение рекламного бюджета",
        "Без ROMI вы не можете доказать ценность своей работы CEO",
        "С этими тремя цифрами вы говорите на языке бизнеса, а не маркетинга",
      ]},
    ],
    task: {
      type: "calc",
      question: "Посчитайте юнит-экономику: введите данные и узнайте, работает ли бизнес",
      calcFields: [
        { id: "budget", label: "Бюджет на маркетинг (₽/мес)", placeholder: "100000", unit: "₽" },
        { id: "clients", label: "Новых клиентов в месяц", placeholder: "50", unit: "чел" },
        { id: "avgCheck", label: "Средний чек (₽)", placeholder: "5000", unit: "₽" },
        { id: "frequency", label: "Покупок в год на клиента", placeholder: "3", unit: "раз" },
        { id: "lifespan", label: "Лет остаётся клиентом", placeholder: "2", unit: "лет" },
      ],
      calcFormula: (v) => {
        const cac = v.clients > 0 ? Math.round(v.budget / v.clients) : 0;
        const ltv = Math.round(v.avgCheck * v.frequency * v.lifespan);
        const ratio = cac > 0 ? (ltv / cac).toFixed(1) : "∞";
        const romi = v.budget > 0 ? Math.round(((v.clients * v.avgCheck - v.budget) / v.budget) * 100) : 0;
        const status = parseFloat(ratio as string) >= 3 ? "✅ Бизнес работает" : parseFloat(ratio as string) >= 1 ? "⚠️ На грани окупаемости" : "❌ Бизнес теряет деньги";
        return [
          { label: "CAC", value: `${cac.toLocaleString()} ₽`, desc: "Стоимость привлечения клиента" },
          { label: "LTV", value: `${ltv.toLocaleString()} ₽`, desc: "Ценность клиента за всё время" },
          { label: "LTV/CAC", value: String(ratio), desc: `Норма ≥ 3. ${status}` },
          { label: "ROMI (мес 1)", value: `${romi}%`, desc: "Возврат на маркетинг в первый месяц" },
        ];
      },
      explanation: "CAC = Бюджет ÷ Клиенты. LTV = Чек × Частота × Срок. ROMI = (Прибыль − Затраты) / Затраты × 100%. Если LTV/CAC ≥ 3 — бизнес здоровый. Ниже 1 — каждый новый клиент приносит убыток.",
      zones: [],
    },
  },

  4: {
    id: 4,
    title: "Что хочет заказчик и",
    titleEm: "как стоить дорого",
    time: "20 мин",
    xp: 150,
    intro: "Почему одни маркетологи получают 50 000₽, а другие — 250 000₽ за одну и ту же работу? Дело не в навыках. Дело в понимании того, что на самом деле покупает заказчик.",
    sections: [
      { type: "h2", content: "Заказчик покупает не маркетинг" },
      { type: "p", content: "Когда CEO нанимает маркетолога, он думает: «Этот человек решит мою проблему и я не буду об этом думать». Он покупает **спокойствие**. Ваша задача — продавать именно это ощущение, а не часы работы или количество постов." },
      { type: "quote", content: "«Люди не покупают дрели. Они покупают дырки в стенах»", cite: "— Теодор Левитт, Гарвардская школа бизнеса" },
      { type: "h2", content: "Три типа заказчиков" },
      { type: "list", items: [
        "Хочет результат — говорите только цифрами: конверсия, CAC, ROMI. Покажите кейс с цифрами.",
        "Хочет процесс — показывайте как работаете: отчёты, встречи, прозрачность. Он хочет контроль.",
        "Хочет статус — покажите портфолио крутых клиентов, упоминания в СМИ. Он хочет ассоциацию.",
      ]},
      { type: "p", content: "Определите тип — и говорите на его языке. Рассказывать про ROMI заказчику-«статус» — провал. Показывать логотипы клиентов заказчику-«результат» — тоже провал." },
      { type: "example", label: "Как поднять чек в 3 раза", content: "Дешёвый вариант:\n«Я веду Instagram за 30 000₽ в месяц»\n\nДорогой вариант:\n«Я выстраиваю систему привлечения клиентов через контент. За 6 месяцев работы с похожим проектом мы снизили CAC с 1 800₽ до 650₽. Стоимость — 90 000₽ в месяц»\n\nОдна и та же работа. Разный фрейм. Разный чек." },
      { type: "funfact", content: "💰 По данным Hinge Marketing, специалисты которые умеют говорить о ROI своей работы, зарабатывают в среднем на 73% больше тех, кто описывает работу через процессы. Язык цифр — это язык денег." },
      { type: "h2", content: "Формула дорогого предложения" },
      { type: "list", items: [
        "Проблема заказчика (конкретная, не абстрактная)",
        "Ваш метод решения (уникальный подход)",
        "Доказательство что работает (кейс с цифрами)",
        "Результат в цифрах (за конкретный период)",
        "Цена (только после ценности)",
      ]},
      { type: "p", content: "Никогда не называйте цену раньше, чем покажете ценность. Это как прийти на первое свидание и сразу спросить про деньги." },
    ],
    task: {
      type: "single",
      question: "Заказчик говорит: «Хочу больше подписчиков в Instagram». Что на самом деле он хочет?",
      options: [
        { id: "a", text: "Именно подписчиков — надо запустить конкурс и гивэвей", correct: false },
        { id: "b", text: "Скорее всего — больше клиентов или узнаваемость. Нужно уточнить реальную цель", correct: true },
        { id: "c", text: "Красивый профиль с единым стилем и эстетикой", correct: false },
        { id: "d", text: "Он сам знает что хочет, просто делайте что говорят", correct: false },
      ],
      explanation: "Правильный ответ — Б. Подписчики — это инструмент, а не цель. Настоящая цель — клиенты, продажи, узнаваемость. Маркетолог который понимает это — задаёт правильные вопросы и предлагает правильные решения. Именно за это платят дорого.",
    },
  },

  5: {
    id: 5,
    title: "Продающий лендинг",
    titleEm: "с нуля",
    time: "25 мин",
    xp: 200,
    intro: "Лендинг — это не сайт. Это продавец, который работает 24/7 без выходных и не просит повышения. Разбираем анатомию страницы, которая конвертирует посетителей в клиентов.",
    sections: [
      { type: "h2", content: "Первый экран решает всё" },
      { type: "p", content: "У вас есть **3–5 секунд** чтобы ответить на вопрос посетителя: «Это для меня? Это решит мою проблему?» Если ответа нет — человек закрывает страницу. Навсегда." },
      { type: "p", content: "Формула первого экрана: **Заголовок** (что вы делаете) + **Подзаголовок** (для кого и какой результат) + **CTA** (одно действие). Всё остальное — детали." },
      { type: "example", label: "Плохо vs Хорошо", content: "ПЛОХО:\n«Добро пожаловать на наш сайт! Мы — команда профессионалов с 10-летним опытом в сфере digital-маркетинга»\n\nХОРОШО:\n«Запускаем вебинары которые окупаются. Средний ROMI клиентов — 340%. Оставьте заявку — разберём ваш проект бесплатно»\n\nПервый вариант говорит о себе. Второй — о результате для клиента." },
      { type: "svg", svg: SVG_LANDING_STRUCTURE, caption: "Структура продающего лендинга. Каждый блок отвечает на конкретный вопрос посетителя." },
      { type: "h2", content: "Структура по AIDA" },
      { type: "list", items: [
        "Боль/проблема — покажите что понимаете ситуацию клиента",
        "Решение — ваш продукт как ответ на эту боль",
        "Доказательства — кейсы, цифры, отзывы (один реальный кейс > 10 красивых отзывов)",
        "Оффер — что конкретно получит клиент",
        "CTA — одно чёткое действие",
      ]},
      { type: "quote", content: "«Если на лендинге два CTA — у пользователя паралич выбора. Один CTA — одно решение»", cite: "— принцип Хика" },
      { type: "funfact", content: "📈 По данным Unbounce, лендинги с одним CTA конвертируют на 266% лучше, чем страницы с несколькими призывами к действию. Меньше — значит больше. Это работает везде: в тексте, в дизайне, в жизни." },
      { type: "h2", content: "Социальное доказательство" },
      { type: "p", content: "Самый недооценённый элемент. Один реальный кейс с цифрами работает лучше, чем 10 красивых отзывов. Формат: **Проблема клиента → Что сделали → Результат в цифрах за конкретный период**." },
      { type: "p", content: "«Отличный сервис, рекомендую!» — ноль. «Снизили CAC с 2 400₽ до 890₽ за 3 месяца» — работает." },
    ],
    task: {
      type: "builder",
      question: "Соберите структуру первого экрана лендинга — перетащите элементы в правильные слоты",
      builderSlots: [
        { id: "slot1", label: "1. Главный заголовок", correctId: "chip-headline" },
        { id: "slot2", label: "2. Подзаголовок", correctId: "chip-sub" },
        { id: "slot3", label: "3. Призыв к действию", correctId: "chip-cta" },
      ],
      builderChips: [
        { id: "chip-headline", text: "Запускаем вебинары, которые окупаются" },
        { id: "chip-sub", text: "Для EdTech и онлайн-школ. Средний ROMI — 340%" },
        { id: "chip-cta", text: "Получить бесплатный разбор воронки →" },
        { id: "chip-wrong1", text: "О нас: 5 лет на рынке, 40+ проектов" },
        { id: "chip-wrong2", text: "Наши услуги: продакшн, трафик, аналитика" },
      ],
      explanation: "Первый экран: 1) Заголовок — что вы делаете (конкретно). 2) Подзаголовок — для кого и какой результат. 3) CTA — одно действие. История компании и список услуг — это для других блоков. Первый экран должен захватить внимание за 3 секунды.",
      zones: [],
    },
  },

  6: {
    id: 6,
    title: "Лиды и квалификация:",
    titleEm: "работа с отделом продаж",
    time: "22 мин",
    xp: 180,
    intro: "Маркетолог привёл лиды — продажники говорят что они некачественные. Продажники закрыли сделки — маркетолог говорит что это его заслуга. Знакомо? Разбираемся как прекратить эту войну раз и навсегда.",
    sections: [
      { type: "h2", content: "MQL vs SQL: в чём разница" },
      { type: "p", content: "**MQL (Marketing Qualified Lead)** — человек проявил интерес: скачал материал, подписался, оставил email. Он «тёплый», но ещё не готов к покупке. Маркетинг отвечает за MQL." },
      { type: "p", content: "**SQL (Sales Qualified Lead)** — человек готов к разговору о покупке: запросил КП, задал вопрос о цене, записался на демо. Продажи отвечают за конверсию MQL в SQL и дальше." },
      { type: "quote", content: "«Маркетинг и продажи должны договориться об одном: что такое 'хороший лид'. Без этого договора — вечная война»", cite: "— Siriusdeckisions Research" },
      { type: "example", label: "SLA между маркетингом и продажами", content: "Маркетинг обязуется:\n— передавать X лидов в месяц с CAC не выше Y₽\n— квалифицированных по критериям [должность, размер компании, бюджет]\n— давать обратную связь по конверсии каналов еженедельно\n\nПродажи обязуются:\n— обрабатывать каждый лид в течение 2 часов\n— давать обратную связь по качеству лидов еженедельно\n— не менять условия сделки без согласования\n\nЭто называется SLA (Service Level Agreement) — и это меняет всё." },
      { type: "funfact", content: "⚡ По данным InsideSales, если перезвонить лиду в течение 5 минут — вероятность конверсии в 100 раз выше, чем если позвонить через 30 минут. Маркетолог который знает это — требует от продаж SLA по времени обработки." },
      { type: "h2", content: "Лид-скоринг: автоматическая квалификация" },
      { type: "p", content: "Система оценки лидов по баллам. Посмотрел страницу цен — +10 баллов. Скачал кейс — +15. Открыл 3 письма подряд — +20. Запросил демо — +50. Набрал 80 баллов — передаём в продажи." },
      { type: "p", content: "Это убирает субъективность («мне кажется, этот лид хороший») и автоматизирует квалификацию. HubSpot, Salesforce, AmoCRM — все умеют это из коробки." },
      { type: "h2", content: "Зона ответственности маркетолога шире, чем кажется" },
      { type: "list", items: [
        "Привлечение новых клиентов (acquisition)",
        "Удержание существующих (retention)",
        "Реактивация ушедших (win-back)",
        "Upsell через email-маркетинг",
        "NPS-опросы и работа с репутацией",
      ]},
    ],
    task: {
      type: "sort",
      question: "Распределите действия клиента по этапам воронки:",
      options: [
        { id: "mql", text: "Скачал бесплатный чеклист" },
        { id: "sql", text: "Запросил коммерческое предложение" },
        { id: "close", text: "Подписал договор и оплатил" },
      ],
      zones: ["MQL", "SQL", "CLOSE"],
      explanation: "MQL = проявил интерес (скачал материал). SQL = готов к покупке (запросил КП). CLOSE = стал клиентом. Маркетинг отвечает за MQL, продажи — за SQL→CLOSE. Вместе — за всю воронку от первого касания до повторной покупки.",
    },
  },

  7: {
    id: 7,
    title: "Вебинарная воронка:",
    titleEm: "от трафика до оплаты за 7 дней",
    time: "30 мин",
    xp: 250,
    intro: "Вебинар — это не просто онлайн-лекция. Это самый конвертирующий инструмент в EdTech и B2B. Мы в Гипотезе запустили 40+ вебинарных воронок. Вот схема, которая работает в 2025 году.",
    sections: [
      { type: "h2", content: "Классическая вебинарная воронка" },
      { type: "p", content: "Трафик → Лендинг регистрации → Прогревочная серия (3–5 дней) → Вебинар → Оффер на вебинаре → Дожимная серия → Продажа. Каждый этап имеет свою метрику и своё узкое место." },
      { type: "svg", svg: SVG_WEBINAR_FUNNEL, caption: "Из 1000 кликов — 8 продаж. Каждый этап — точка роста. Улучшение доходимости на 10% даёт +25% к выручке." },
      { type: "example", label: "Цифры нормальной воронки", content: "Конверсия лендинга регистрации: 25–40%\nДоходимость до вебинара: 20–35% от зарегистрировавшихся\nКонверсия в покупку на вебинаре: 3–8%\nКонверсия дожимной серии: +1–3%\n\nПример: 1000 кликов → 300 регистраций → 90 дошли → 5 купили на вебинаре + 3 после серии = 8 продаж" },
      { type: "h2", content: "Прогрев — это не спам" },
      { type: "p", content: "Прогревочная серия писем должна давать ценность **до** вебинара: инсайт, кейс, провокационный вопрос. Цель — чтобы человек пришёл на вебинар уже «тёплым», доверяющим вам." },
      { type: "p", content: "Письма которые только напоминают «не забудьте прийти» — убивают доходимость. Письма которые дают ценность — поднимают её на 30–40%." },
      { type: "quote", content: "«Продажа на вебинаре — это не продажа. Это логичное завершение трансформации которую вы начали в прогреве»", cite: "— Рассел Брансон, ClickFunnels" },
      { type: "funfact", content: "🎯 По данным агентства Гипотеза: вебинары с интерактивными элементами (опросы, Q&A, задания) показывают доходимость на 40% выше и конверсию в продажу на 25% выше, чем монологовые форматы. Люди покупают у тех, с кем взаимодействовали." },
      { type: "h2", content: "Автовебинар vs живой вебинар" },
      { type: "list", items: [
        "Живой вебинар: выше конверсия (люди чувствуют живость), требует вашего времени",
        "Автовебинар: работает 24/7, ниже конверсия (люди чувствуют запись)",
        "Оптимально: живые вебинары для запуска, автовебинар для постоянного потока",
      ]},
    ],
    task: {
      type: "single",
      question: "Из 500 человек зарегистрировалось на вебинар. Доходимость 30%, конверсия в покупку 5%. Сколько продаж?",
      options: [
        { id: "a", text: "25 продаж", correct: false },
        { id: "b", text: "7–8 продаж", correct: true },
        { id: "c", text: "15 продаж", correct: false },
        { id: "d", text: "150 продаж", correct: false },
      ],
      explanation: "500 × 30% = 150 дошли до вебинара. 150 × 5% = 7.5 продаж. Правильный ответ — 7–8. Именно поэтому важно работать над каждым этапом: даже небольшое улучшение доходимости или конверсии даёт значительный прирост продаж.",
    },
  },

  8: {
    id: 8,
    title: "Стратегия:",
    titleEm: "как думать на год вперёд",
    time: "25 мин",
    xp: 200,
    intro: "Большинство маркетологов живут в режиме «что делаем на этой неделе». Стратег думает иначе: где мы хотим быть через год и какие действия туда ведут. Разбираем разницу — и почему это стоит дороже.",
    sections: [
      { type: "h2", content: "Стратегия vs тактика" },
      { type: "p", content: "**Стратегия** — это «куда идём и почему». **Тактика** — «как именно идём». Ошибка большинства: они отличные тактики (умеют запускать рекламу, писать посты) но не умеют связать это с бизнес-целью." },
      { type: "p", content: "Маркетолог-стратег начинает с вопроса: какой результат нужен бизнесу через 12 месяцев? И только потом — какие инструменты туда ведут." },
      { type: "example", label: "Структура маркетинговой стратегии", content: "1. Цель: +200 клиентов за год, выручка 24 млн₽\n2. Аудитория: кто наш идеальный клиент (ICP)\n3. Позиционирование: чем мы отличаемся от конкурентов\n4. Каналы: где живёт наша аудитория\n5. Контент-план: какие смыслы транслируем\n6. Бюджет: сколько тратим и на что\n7. Метрики: как измеряем успех" },
      { type: "h2", content: "ICP — портрет идеального клиента" },
      { type: "p", content: "Не «мужчины 25–45 лет», а конкретно: «Основатель EdTech-компании, 30–45 лет, выручка 10–100 млн₽, уже пробовал запускать вебинары но не окупились, хочет систему а не разовую помощь»." },
      { type: "p", content: "Чем точнее ICP — тем эффективнее каждый рубль маркетинга. Широкий таргет = дорогой CAC. Точный таргет = дешёвый CAC." },
      { type: "quote", content: "«Стратегия без тактики — мечта. Тактика без стратегии — суета перед поражением»", cite: "— Сунь Цзы (и это актуально для маркетинга)" },
      { type: "funfact", content: "📊 По данным CoSchedule, маркетологи которые документируют стратегию, в 313% раз чаще сообщают об успехе, чем те кто работает «по наитию». Записанная стратегия — не бюрократия. Это конкурентное преимущество." },
      { type: "h2", content: "Как строить стратегию за один вечер" },
      { type: "list", items: [
        "Аудит: что работает, что нет (честно)",
        "Анализ конкурентов: где они слабы",
        "Определение ICP: один конкретный человек",
        "Выбор 2–3 ключевых канала (не 10)",
        "KPI на квартал: 3–5 метрик максимум",
        "Ревью каждые 30 дней",
      ]},
    ],
    task: {
      type: "multi",
      question: "Что входит в маркетинговую стратегию? Выберите все правильные варианты:",
      options: [
        { id: "a", text: "Портрет идеального клиента (ICP)", correct: true },
        { id: "b", text: "Список постов на следующую неделю", correct: false },
        { id: "c", text: "Позиционирование и отличие от конкурентов", correct: true },
        { id: "d", text: "Метрики успеха и KPI", correct: true },
        { id: "e", text: "Выбор каналов продвижения", correct: true },
      ],
      explanation: "Стратегия включает: ICP, позиционирование, метрики, каналы. Список постов — это тактика (контент-план), а не стратегия. Стратегия отвечает на «что и почему», тактика — на «как и когда».",
    },
  },

  9: {
    id: 9,
    title: "Нейросети и AI-инструменты",
    titleEm: "в маркетинге 2025",
    time: "28 мин",
    xp: 220,
    intro: "Маркетолог без AI в 2025 — как дизайнер без Photoshop в 2010-м. Разбираем инструменты которые умножают скорость в 10 раз и не требуют технического образования.",
    sections: [
      { type: "h2", content: "ChatGPT / Claude — ваш первый помощник" },
      { type: "p", content: "Что умеет: писать тексты, генерировать идеи для контента, анализировать конкурентов, составлять стратегии, отвечать на возражения, переводить, редактировать." },
      { type: "p", content: "Главный навык — **промпт-инжиниринг**: чем точнее задание, тем лучше результат. Правило: дайте контекст + роль + задачу + формат ответа." },
      { type: "example", label: "Плохой vs хороший промпт", content: "ПЛОХОЙ:\n«Напиши пост про маркетинг»\n\nХОРОШИЙ:\n«Ты — маркетолог с 10-летним опытом в EdTech. Напиши пост для LinkedIn от лица основателя агентства. Тема: почему большинство вебинаров не окупаются. Тон: экспертный, с юмором. Длина: 150–200 слов. Закончи вопросом к аудитории»\n\nРазница в результате — как между черновиком и финальным текстом." },
      { type: "h2", content: "Midjourney / DALL-E — генерация изображений" },
      { type: "p", content: "Создаёт обложки для статей, иллюстрации для презентаций, варианты баннеров за минуты. Раньше это стоило 5 000–15 000₽ за дизайнера. Теперь — включено в подписку за $20/мес." },
      { type: "h2", content: "Вайб-кодинг — сайты без кода" },
      { type: "p", content: "Cursor, Bolt, v0 — вы описываете что хотите на русском языке, AI пишет код. Маркетолог который умеет это — может за 2 часа создать лендинг, который раньше требовал разработчика на неделю." },
      { type: "funfact", content: "🚀 По данным McKinsey, маркетологи использующие AI-инструменты выполняют задачи на 40–60% быстрее. Те кто освоит AI сейчас — будут стоить в 2–3 раза дороже через год. Это не замена маркетолога — это суперсила." },
      { type: "h2", content: "Практический стек 2025" },
      { type: "list", items: [
        "ChatGPT/Claude — тексты, стратегия, анализ",
        "Midjourney/Ideogram — визуал и иллюстрации",
        "Cursor/Bolt/v0 — лендинги без кода",
        "Make/n8n — автоматизация рутины",
        "Perplexity — исследования и факты",
        "ElevenLabs — озвучка и подкасты",
      ]},
    ],
    task: {
      type: "single",
      question: "Какой промпт даст лучший результат от ChatGPT?",
      options: [
        { id: "a", text: "'Напиши текст для рекламы'", correct: false },
        { id: "b", text: "'Ты — копирайтер в B2B SaaS. Напиши заголовок лендинга CRM для малого бизнеса. Боль: теряют лиды из-за хаоса в Excel. Дай 5 вариантов'", correct: true },
        { id: "c", text: "'Помоги с маркетингом'", correct: false },
        { id: "d", text: "'Сделай хороший текст'", correct: false },
      ],
      explanation: "Правильный ответ — Б. Хороший промпт: роль (копирайтер в B2B SaaS), задача (заголовок лендинга), контекст (CRM, боль — хаос в Excel), формат (5 вариантов). Чем точнее промпт — тем полезнее ответ.",
    },
  },

  10: {
    id: 10,
    title: "Итоговый проект:",
    titleEm: "собери свою воронку",
    time: "35 мин",
    xp: 300,
    intro: "Вы прошли 9 уроков. Котлер, юнит-экономика, лендинги, воронки, AI. Теперь финальный проект — не тест, а настоящая работа. Соберите маркетинговую воронку для реального (или придуманного) проекта.",
    sections: [
      { type: "h2", content: "Что вы узнали за этот курс" },
      { type: "list", items: [
        "Маркетинг — это система управления вниманием, а не реклама (урок 1)",
        "Тексты работают когда говорят о выгодах читателя, не о себе (урок 2)",
        "Без цифр маркетинг — это просто мнение. CAC, LTV, ROMI (урок 3)",
        "Заказчик покупает результат и спокойствие, а не процесс (урок 4)",
        "Лендинг — продавец 24/7. Один CTA, структура AIDA (урок 5)",
        "Маркетинг и продажи — одна команда с SLA (урок 6)",
        "Вебинар — самый конвертирующий инструмент в EdTech (урок 7)",
        "Стратегия — система принятия решений, а не план (урок 8)",
        "AI — суперсила маркетолога 2025 года (урок 9)",
      ]},
      { type: "quote", content: "«Маркетинг — это не то что вы делаете с продуктом. Это то что вы делаете с умом потребителя»", cite: "— Эл Райс" },
      { type: "funfact", content: "🎓 Вы прошли курс который большинство маркетологов не проходит никогда. Они учатся на ошибках клиентов. Вы — на опыте агентства которое запустило 40+ проектов. Это ваше конкурентное преимущество." },
      { type: "h2", content: "Что дальше" },
      { type: "list", items: [
        "Примените одну вещь из курса на реальном проекте — сегодня",
        "Посчитайте юнит-экономику любого бизнеса вокруг вас",
        "Напишите один текст по формуле «пиши как говоришь, сокращай вдвое»",
        "Попробуйте вайб-кодинг — создайте простой лендинг за вечер",
      ]},
      { type: "p", content: "Знания без действия — это просто информация. Действие без знаний — это хаос. У вас теперь есть и то, и другое." },
    ],
    task: {
      type: "multi",
      question: "Финальный тест: выберите ВСЕ верные утверждения о маркетинге:",
      options: [
        { id: "a", text: "LTV должен быть больше CAC для прибыльного бизнеса", correct: true },
        { id: "b", text: "Больше CTA на лендинге = лучше конверсия", correct: false },
        { id: "c", text: "Маркетолог отвечает за MQL, продажи — за конверсию в сделку", correct: true },
        { id: "d", text: "Хороший промпт для AI содержит роль, задачу, контекст и формат", correct: true },
        { id: "e", text: "Стратегия — это список постов на месяц", correct: false },
      ],
      explanation: "Верно: LTV>CAC (А), разделение MQL/SQL (В), структура промпта (Г). Неверно: больше CTA снижает конверсию (паралич выбора), стратегия — это система решений, а не контент-план.",
    },
  },
};

// ─── Task components ───────────────────────────────────────────────────────────

function SingleTask({ task, onComplete }: { task: LessonData["task"]; onComplete: () => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  function check() {
    if (!sel) return;
    setRevealed(true);
    if (task.options?.find(o => o.id === sel)?.correct) onComplete();
  }

  return (
    <div>
      <p className="ll-task-q">{task.question}</p>
      <div className="ll-options">
        {task.options?.map(opt => {
          let cls = "ll-option";
          if (revealed) {
            if (opt.correct) cls += " correct";
            else if (opt.id === sel) cls += " wrong";
            else cls += " dimmed";
          } else if (opt.id === sel) cls += " sel";
          return (
            <button key={opt.id} className={cls} onClick={() => !revealed && setSel(opt.id)} disabled={revealed}>
              {opt.text}
            </button>
          );
        })}
      </div>
      {!revealed && <button className="ll-btn" onClick={check} disabled={!sel}>Проверить ответ</button>}
      {revealed && (
        <div className={`ll-result ${task.options?.find(o => o.id === sel)?.correct ? "ll-ok" : "ll-fail"}`}>
          {task.options?.find(o => o.id === sel)?.correct ? "✅ " : "❌ "}{task.explanation}
        </div>
      )}
    </div>
  );
}

function MultiTask({ task, onComplete }: { task: LessonData["task"]; onComplete: () => void }) {
  const [sel, setSel] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  function toggle(id: string) {
    if (revealed) return;
    setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }

  function check() {
    if (!sel.length) return;
    setRevealed(true);
    const correctIds = task.options?.filter(o => o.correct).map(o => o.id) || [];
    if (correctIds.every(id => sel.includes(id)) && sel.every(id => correctIds.includes(id))) onComplete();
  }

  return (
    <div>
      <p className="ll-task-q">{task.question}</p>
      <div className="ll-checks">
        {task.options?.map(opt => {
          let cls = "ll-check";
          if (sel.includes(opt.id)) cls += " ll-check-sel";
          if (revealed) {
            cls += " ll-check-disabled";
            if (opt.correct) cls += " ll-check-correct";
            else if (sel.includes(opt.id)) cls += " ll-check-wrong";
          }
          return (
            <div key={opt.id} className={cls} onClick={() => toggle(opt.id)}>
              <div className="ll-checkbox">{sel.includes(opt.id) && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}</div>
              <span className="ll-check-label">{opt.text}</span>
            </div>
          );
        })}
      </div>
      {!revealed && <button className="ll-btn" onClick={check} disabled={!sel.length}>Проверить ответ</button>}
      {revealed && (
        <div className={`ll-result ${task.options?.filter(o => o.correct).every(o => sel.includes(o.id)) && sel.every(id => task.options?.find(o => o.id === id)?.correct) ? "ll-ok" : "ll-fail"}`}>
          {task.explanation}
        </div>
      )}
    </div>
  );
}

function SortTask({ task, onComplete }: { task: LessonData["task"]; onComplete: () => void }) {
  const zones = task.zones || [];
  const [placements, setPlacements] = useState<Record<string, string | null>>(
    Object.fromEntries(zones.map(z => [z, null]))
  );
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  function drop(zone: string) {
    if (!dragItem || revealed) return;
    setPlacements(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(z => { if (next[z] === dragItem) next[z] = null; });
      next[zone] = dragItem;
      return next;
    });
    setDragItem(null);
  }

  function check() {
    setRevealed(true);
    if (zones.every(z => placements[z] === z.toLowerCase())) onComplete();
  }

  const placed = Object.values(placements).filter(Boolean) as string[];
  const allFilled = zones.every(z => placements[z] !== null);

  return (
    <div>
      <p className="ll-task-q">{task.question}</p>
      <div className="ll-drag-items">
        {task.options?.map(opt => (
          <div
            key={opt.id}
            className={`ll-drag-item${placed.includes(opt.id) ? " ll-placed" : ""}${dragItem === opt.id ? " ll-dragging" : ""}`}
            draggable={!placed.includes(opt.id) && !revealed}
            onDragStart={() => setDragItem(opt.id)}
            onClick={() => { if (revealed || placed.includes(opt.id)) return; setDragItem(dragItem === opt.id ? null : opt.id); }}
          >
            {opt.text}
          </div>
        ))}
      </div>
      <div className="ll-drop-zones">
        {zones.map(zone => {
          const p = placements[zone];
          const pOpt = task.options?.find(o => o.id === p);
          let cls = "ll-drop-zone";
          if (p) cls += " ll-zone-filled";
          if (revealed && p) cls += p === zone.toLowerCase() ? " ll-zone-correct" : " ll-zone-wrong";
          return (
            <div key={zone} className={cls}
              onDragOver={e => e.preventDefault()}
              onDrop={() => drop(zone)}
              onClick={() => { if (dragItem && !revealed) drop(zone); else if (p && !revealed) setPlacements(prev => ({ ...prev, [zone]: null })); }}
            >
              <span className="ll-zone-label">{zone} =</span>
              {pOpt ? <span className="ll-zone-value">{pOpt.text}</span> : <span style={{ color: "rgba(240,237,232,0.2)", fontSize: "13px" }}>Перетащите сюда</span>}
            </div>
          );
        })}
      </div>
      {!revealed && <button className="ll-btn" onClick={check} disabled={!allFilled}>Проверить</button>}
      {revealed && (
        <div className={`ll-result ${zones.every(z => placements[z] === z.toLowerCase()) ? "ll-ok" : "ll-fail"}`}>
          {task.explanation}
        </div>
      )}
    </div>
  );
}

function CalcTask({ task, onComplete }: { task: LessonData["task"]; onComplete: () => void }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState<{ label: string; value: string; desc: string }[]>([]);

  function calculate() {
    const numVals: Record<string, number> = {};
    task.calcFields?.forEach(f => { numVals[f.id] = parseFloat(vals[f.id] || "0") || 0; });
    const res = task.calcFormula?.(numVals) || [];
    setResults(res);
    setCalculated(true);
    onComplete();
  }

  const allFilled = task.calcFields?.every(f => vals[f.id] && parseFloat(vals[f.id]) > 0);

  return (
    <div>
      <p className="ll-task-q">{task.question}</p>
      <div className="ll-calc">
        {task.calcFields?.map(f => (
          <div key={f.id} className="ll-calc-row">
            <label className="ll-calc-label">{f.label}</label>
            <input
              className="ll-calc-input"
              type="number"
              placeholder={f.placeholder}
              value={vals[f.id] || ""}
              onChange={e => setVals(p => ({ ...p, [f.id]: e.target.value }))}
            />
          </div>
        ))}
        <button className="ll-btn" onClick={calculate} disabled={!allFilled}>
          Рассчитать →
        </button>
      </div>
      {calculated && results.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px", marginTop: "20px" }}>
          {results.map((r, i) => (
            <div key={i} className="ll-calc-result">
              <div className="ll-calc-result-label">{r.label}</div>
              <div className="ll-calc-result-value">{r.value}</div>
              <div className="ll-calc-result-desc">{r.desc}</div>
            </div>
          ))}
        </div>
      )}
      {calculated && (
        <div className="ll-result ll-ok" style={{ marginTop: "16px" }}>
          ✅ {task.explanation}
        </div>
      )}
    </div>
  );
}

function BuilderTask({ task, onComplete }: { task: LessonData["task"]; onComplete: () => void }) {
  const [slots, setSlots] = useState<Record<string, string | null>>(
    Object.fromEntries((task.builderSlots || []).map(s => [s.id, null]))
  );
  const [revealed, setRevealed] = useState(false);

  const usedChips = Object.values(slots).filter(Boolean) as string[];

  function assign(slotId: string, chipId: string) {
    if (revealed) return;
    setSlots(prev => {
      const next = { ...prev };
      // Remove chip from other slots
      Object.keys(next).forEach(s => { if (next[s] === chipId) next[s] = null; });
      next[slotId] = chipId;
      return next;
    });
  }

  function check() {
    setRevealed(true);
    const allCorrect = task.builderSlots?.every(s => slots[s.id] === s.correctId);
    if (allCorrect) onComplete();
  }

  const allFilled = task.builderSlots?.every(s => slots[s.id] !== null);

  return (
    <div>
      <p className="ll-task-q">{task.question}</p>
      <div className="ll-builder">
        {task.builderSlots?.map(slot => {
          const chipId = slots[slot.id];
          const chip = task.builderChips?.find(c => c.id === chipId);
          const isCorrect = revealed && chipId === slot.correctId;
          const isWrong = revealed && chipId && chipId !== slot.correctId;
          return (
            <div key={slot.id} className={`ll-builder-slot${chipId ? " ll-slot-filled" : ""}`}
              style={isCorrect ? { borderColor: "#22c55e", background: "rgba(34,197,94,0.08)" } : isWrong ? { borderColor: "#ef4444", background: "rgba(239,68,68,0.08)" } : {}}
              onClick={() => { if (chipId && !revealed) setSlots(prev => ({ ...prev, [slot.id]: null })); }}
            >
              <span className="ll-builder-slot-label">{slot.label}</span>
              {chip && <span style={{ fontSize: "14px", color: "#f0ede8", fontWeight: 600 }}>{chip.text}</span>}
              {!chip && <span style={{ color: "rgba(240,237,232,0.2)", fontSize: "13px" }}>Выберите вариант ниже</span>}
            </div>
          );
        })}
      </div>
      <div className="ll-builder-choices">
        {task.builderChips?.map(chip => (
          <div key={chip.id} className={`ll-builder-chip${usedChips.includes(chip.id) ? " ll-chip-used" : ""}`}
            onClick={() => {
              if (usedChips.includes(chip.id) || revealed) return;
              // Find first empty slot
              const emptySlot = task.builderSlots?.find(s => !slots[s.id]);
              if (emptySlot) assign(emptySlot.id, chip.id);
            }}
          >
            {chip.text}
          </div>
        ))}
      </div>
      {!revealed && <button className="ll-btn" onClick={check} disabled={!allFilled} style={{ marginTop: "20px" }}>Проверить</button>}
      {revealed && (
        <div className={`ll-result ${task.builderSlots?.every(s => slots[s.id] === s.correctId) ? "ll-ok" : "ll-fail"}`}>
          {task.explanation}
        </div>
      )}
    </div>
  );
}

// ─── Render section ────────────────────────────────────────────────────────────

function renderSection(sec: LessonData["sections"][0], i: number) {
  const parseText = (text: string) => text.split("**").map((part, j) =>
    j % 2 === 1 ? <strong key={j}>{part}</strong> : part
  );

  if (sec.type === "h2") return (
    <div key={i} className="ll-section">
      <h2>{parseText(sec.content || "")}</h2>
    </div>
  );
  if (sec.type === "p") return (
    <div key={i} className="ll-section">
      <p>{parseText(sec.content || "")}</p>
    </div>
  );
  if (sec.type === "list") return (
    <div key={i} className="ll-section">
      <ul>{sec.items?.map((item, j) => <li key={j}>{parseText(item)}</li>)}</ul>
    </div>
  );
  if (sec.type === "quote") return (
    <div key={i} className="ll-quote">
      <p>{sec.content}</p>
      {sec.cite && <cite>{sec.cite}</cite>}
    </div>
  );
  if (sec.type === "example") return (
    <div key={i} className="ll-example">
      <div className="ll-example-tag">{sec.label || "Пример"}</div>
      <pre>{sec.content}</pre>
    </div>
  );
  if (sec.type === "funfact") return (
    <div key={i} className="ll-funfact">
      <p>{sec.content}</p>
    </div>
  );
  if (sec.type === "svg") return (
    <div key={i} className="ll-svg-wrap">
      <div dangerouslySetInnerHTML={{ __html: sec.svg || "" }} />
      {sec.caption && <p className="ll-svg-caption">{sec.caption}</p>}
    </div>
  );
  return null;
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function LearnLessonPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const lessonId = parseInt(params.id || "1");
  const [token] = useState(() => localStorage.getItem("course_token"));
  const [isPaid, setIsPaid] = useState(false);
  const [taskDone, setTaskDone] = useState(false);
  const [lessonDone, setLessonDone] = useState(false);

  useEffect(() => {
    if (!token) { setLocation("/learn"); return; }
    fetch(`/api/course/me?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (!data.success) { setLocation("/learn"); return; }
        setIsPaid(data.student.isPaid);
        const prog = data.progress.find((p: { lessonId: number; completed: boolean; taskCompleted: boolean }) => p.lessonId === lessonId);
        if (prog?.completed) setLessonDone(true);
        if (prog?.taskCompleted) setTaskDone(true);
      });
  }, [lessonId]);

  async function markComplete(withTask = false) {
    if (!token) return;
    await fetch("/api/course/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, lessonId, taskCompleted: withTask }),
    });
    setLessonDone(true);
    if (withTask) setTaskDone(true);
  }

  const lesson = LESSONS_DATA[lessonId];
  const isLocked = lessonId > 3 && !isPaid;
  const nextId = lessonId < 10 ? lessonId + 1 : null;
  const canAccessNext = nextId ? (nextId <= 3 || isPaid) : false;

  return (
    <>
      <style>{CSS}</style>
      <div className="ll">
        <nav className="ll-nav">
          <button className="ll-back" onClick={() => setLocation("/learn")}>
            ← Все уроки
          </button>
          <div className="ll-nav-right">
            <span className="ll-num-badge">Урок {lessonId} из 10</span>
            {lesson && <span className="ll-xp-badge">+{lesson.xp} XP</span>}
          </div>
        </nav>

        <div className="ll-body">
          {isLocked ? (
            <div className="ll-locked">
              <div className="ll-locked-icon">🔒</div>
              <h2>Урок {lessonId}: {lesson?.title} {lesson?.titleEm}</h2>
              <p>Этот урок доступен в полной версии курса</p>
              <a href="/learn/pay" className="ll-locked-btn">Открыть все уроки — 5 000 ₽</a>
            </div>
          ) : !lesson ? (
            <p style={{ color: "rgba(240,237,232,0.4)", textAlign: "center", padding: "60px 0" }}>Урок в разработке</p>
          ) : (
            <>
              <div className="ll-lesson-label">Урок {lesson.id}</div>
              <h1 className="ll-h1">
                {lesson.title} {lesson.titleEm && <em>{lesson.titleEm}</em>}
              </h1>
              <div className="ll-meta">
                <span className="ll-meta-item">⏱ {lesson.time} чтения</span>
                <span className="ll-meta-item">⚡ +{lesson.xp} XP</span>
                {lessonDone && <span className="ll-meta-item" style={{ color: "#22c55e" }}>✓ Пройден</span>}
              </div>

              <p className="ll-intro">{lesson.intro}</p>

              {lesson.sections.map((sec, i) => renderSection(sec, i))}

              <div className="ll-divider" />

              {/* Task */}
              <div className="ll-task">
                <div className="ll-task-header">
                  <div className="ll-task-icon">🎯</div>
                  <div>
                    <div className="ll-task-title">Практическое задание</div>
                    <div className="ll-task-sub">{taskDone ? "Выполнено ✓" : "Выполните задание — получите XP"}</div>
                  </div>
                </div>

                {lesson.task.type === "single" && <SingleTask task={lesson.task} onComplete={() => markComplete(true)} />}
                {lesson.task.type === "multi" && <MultiTask task={lesson.task} onComplete={() => markComplete(true)} />}
                {lesson.task.type === "sort" && <SortTask task={lesson.task} onComplete={() => markComplete(true)} />}
                {lesson.task.type === "calc" && <CalcTask task={lesson.task} onComplete={() => markComplete(true)} />}
                {lesson.task.type === "builder" && <BuilderTask task={lesson.task} onComplete={() => markComplete(true)} />}
              </div>

              {/* Completion */}
              {lessonDone && (
                <div className="ll-done">
                  <span className="ll-done-emoji">🏆</span>
                  <h3>Урок пройден!</h3>
                  <p>{taskDone ? "Задание выполнено — вы молодец" : "Попробуйте выполнить задание выше"}</p>
                  {taskDone && <div className="ll-done-xp">⚡ +{lesson.xp} XP получено</div>}
                </div>
              )}

              {!lessonDone && (
                <button className="ll-next" onClick={() => markComplete(false)}>
                  Отметить урок как пройденный →
                </button>
              )}

              {lessonDone && nextId && (
                canAccessNext ? (
                  <button className="ll-next" onClick={() => setLocation(`/learn/lesson/${nextId}`)}>
                    Следующий урок {nextId} →
                  </button>
                ) : (
                  <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <p style={{ color: "rgba(240,237,232,0.5)", marginBottom: "16px" }}>Следующие уроки — в полной версии</p>
                    <button className="ll-next" onClick={() => setLocation("/learn/pay")}>
                      Открыть все уроки — 5 000 ₽
                    </button>
                  </div>
                )
              )}

              {lessonDone && !nextId && (
                <div className="ll-done" style={{ marginTop: "32px" }}>
                  <span className="ll-done-emoji">🎓</span>
                  <h3>Курс завершён!</h3>
                  <p>Вы прошли все 10 уроков. Вы — маркетолог.</p>
                  <div className="ll-done-xp">⚡ Все XP получены</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
