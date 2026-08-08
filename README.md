# ThreatMesh AI — AI-Driven Web Application

> **Built & Accelerated** using Google Antigravity & Google Stitch.

ThreatMesh AI is a cloud-native cybersecurity platform with a proven core threat-recognition and scanning engine, modernized UI, threat intelligence enrichment (Tavily OSINT), and incident response alerting (n8n webhooks).

---

## 🚀 Key Features

1. **Retained Core Detection Engine**
   - Heuristic & rules-based multi-factor analysis for URLs, IP addresses, domains, file hashes, and text/exploit logs.
   - Outputs threat classification, confidence percentage, and machine/analyst reasoning traces.

2. **Google Stitch Aesthetic Dashboard**
   - **Deep slate canvas** (`#020617`), **electric blue neutral accents** (`#3b82f6`), and **neon coral alert badges** (`#ff4757`).
   - **Hero Metric Cards**: Total Scans, Threats Blocked, Active High-Severity Alerts.
   - **Live Feed Panel**: Auto-scrolling ticker of incoming scan results.
   - **Side-Panel Threat Detail Modal**: In-context side drawer displaying AI reasoning traces and web context without page navigation.

3. **Tavily OSINT Intelligence Engine**
   - Automatically searches the live web for non-benign threat targets to provide a **"Live Web Context"** OSINT paragraph in the Threat Detail Modal.

4. **n8n Incident Response Alerting**
   - Dispatches formatted incident payloads to n8n webhooks for Slack/Discord alerting within <30 seconds of high/critical threat detection.

---

## 🛠️ Architecture

```
ThreatMesh AI
├── backend/                # FastAPI (Python 3.11)
│   ├── app/
│   │   ├── core_engine/    # Core threat classification modules
│   │   ├── services/       # Tavily OSINT & n8n webhook dispatcher
│   │   ├── routes/         # /api/scans, /api/metrics, /api/alerts
│   │   ├── database.py     # SQLite/PostgreSQL SQLAlchemy models
│   │   └── main.py         # Application entrypoint & demo seed generator
│   └── requirements.txt
├── frontend/               # Vite + React + Tailwind CSS + Lucide
│   ├── src/
│   │   ├── components/     # Header, HeroMetrics, ScanInputBar, LiveFeed, ThreatModal
│   │   ├── services/       # API client
│   │   └── App.tsx         # Main dashboard container
│   └── package.json
└── design/
    └── DESIGN.md           # Stitch visual tokens & design rules
```

---

## ⚡ Quickstart (Local Development)

### 1. Backend Server
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Healthcheck: `http://localhost:8000/api/health`

### 2. Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
- App Dashboard: `http://localhost:5173`

---

## 🔒 Environment Variables (`.env`)

| Variable | Description | Default |
| --- | --- | --- |
| `TAVILY_API_KEY` | Key for Tavily Live Web Search API | *(Optional - Fallback OSINT generator enabled)* |
| `N8N_WEBHOOK_URL` | Webhook target for Slack/Discord alerts | *(Optional - Simulation mode enabled)* |
| `DATABASE_URL` | DB connection string | `sqlite:///./threatmesh.db` |
