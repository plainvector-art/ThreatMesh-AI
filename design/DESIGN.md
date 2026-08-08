# ThreatMesh AI — Design System & Visual Specification (Google Stitch)

This document establishes the UI design rules, color tokens, and layout guidelines for **ThreatMesh AI**. All frontend components must adhere strictly to these specifications to guarantee visual fidelity to the original PRD spec (Section 6).

---

## 1. Color Palette & Tokens

| Token Name | Hex Code | Tailwind Equivalent | Usage / Context |
| --- | --- | --- | --- |
| **Canvas / Background** | `#020617` | `bg-slate-950` | Default application background |
| **Card Surface** | `#0f172a` | `bg-slate-900` | Metric cards, feed containers, modals |
| **Subtle Border** | `#1e293b` | `border-slate-800` | Card borders, dividers, subtle outlines |
| **Electric Blue (Neutral)** | `#3b82f6` | `text-blue-500` / `#00f0ff` | Neutral data accents, metric numbers, status pills |
| **Neon Coral (Alert)** | `#f43f5e` | `text-rose-500` / `#ff4757` | High-severity threat badges, active alerts counter |
| **Amber Warning** | `#f59e0b` | `text-amber-500` | Medium-severity flags, warnings |
| **Emerald Safe** | `#10b981` | `text-emerald-500` | Clean/Safe classification status |
| **Muted Text** | `#94a3b8` | `text-slate-400` | Labels, timestamps, secondary copy |

---

## 2. Layout Structure

### Top Row — Hero Metric Cards
- 3 primary cards spanning equal width:
  1. **Total Scans**: Shows aggregated scan volume + 24h trend delta.
  2. **Threats Blocked**: Displays number of malicious items mitigated + block rate percentage.
  3. **Active Alerts**: Glowing Neon Coral highlight with count of critical/high severity items requiring analyst triage.

### Main View — Live Feed & Quick Scan
- **Quick Scan Bar**: Top input bar allowing immediate scanning of URLs, IPs, file hashes, or raw log text.
- **Live Feed Panel**: Auto-scrolling ticker displaying scan activity rows:
  - Input target (truncated with copy button)
  - Threat classification & confidence score
  - Severity badge (Safe, Low, Medium, High, Critical)
  - Timestamp & drill-down trigger on row click.

### Side-Panel Threat Detail Modal
- Opens from the right screen edge on row click (without triggering full page navigation).
- **Header**: Target name, timestamp, and severity indicator.
- **Section 1**: AI Threat Recognition Engine score & confidence gauge.
- **Section 2**: Machine-readable reasoning trace items extracted from the core engine.
- **Section 3**: "Live Web Context" powered by Tavily search intelligence.
- **Section 4**: Incident Orchestration (n8n Slack/Discord notification status).

---

## 3. Typography & UI Style

- **Font Family**: Inter, system-ui, sans-serif.
- **Monospace Font**: JetBrains Mono, Fira Code (for URLs, Hashes, IPs, and reasoning traces).
- **Aesthetic**: Minimalist dark-mode cybersecurity SaaS, glassmorphism (`backdrop-blur-md bg-slate-900/80 border border-slate-800/80`).
