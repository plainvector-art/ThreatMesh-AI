# 🛡️ ThreatMesh AI — SaaS Cybersecurity & Threat Recognition Engine

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141+-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178c6.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.1+-646cff.svg)](https://vitejs.dev)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.8+-5C3EE8.svg)](https://opencv.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38bdf8.svg)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-3+-003B57.svg)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**ThreatMesh AI** is a cloud-native, full-spectrum threat recognition engine and digital forensics platform. It combines heuristic threat analysis, deepfake & media forensics, Tavily OSINT web intelligence, AI Security Copilot guidance, and automated n8n incident response webhooks.

The system provides real-time URL/IP/Hash/Log threat classification, multi-factor reasoning decision traces, synthetic voice & image forensic inspection, and automated Slack/Discord alerting.

> *Next-Generation Cybersecurity Intelligence, Forensics & Incident Orchestration*

---

## 📋 Table of Contents

- [Core Capabilities](#-core-capabilities)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Detection Engine Pipeline](#-detection-engine-pipeline)
- [Deepfake & Media Forensics Workspace](#-deepfake--media-forensics-workspace)
- [Installation & Local Setup](#-installation--local-setup)
- [API Documentation](#-api-documentation)
- [Environment Configuration](#-environment-configuration)
- [Use Cases](#-use-cases)

---

## 🚀 Core Capabilities

| Feature | Description |
|---------|-------------|
| 🎯 **Threat Recognition Mesh** | Multi-factor classification for URLs, IP addresses, file hashes, and SQLi log payloads |
| 👁️ **Deepfake Media Forensics** | OpenCV Laplacian noise variance, skin texture smoothness, and color saturation analysis |
| 🎙️ **Voice Clone Inspector** | Spectral anomaly and synthetic audio frequency variance analysis |
| 📱 **QR Quishing Decoder** | Extracts and evaluates embedded phishing URLs inside QR code images |
| 🔍 **Tavily OSINT Search** | Live web threat search providing contextual OSINT summaries for flagged targets |
| ⚡ **n8n Webhook Orchestration** | Dispatches incident response alert payloads to n8n webhooks within <30 seconds |
| 🤖 **AI Security Copilot** | Interactive natural language advisor for incident triage playbooks and CVE guidance |
| 🎓 **Analyst Training Challenges** | Interactive knowledge quizzes and live CISA/NVD threat news advisories |
| 📊 **Real-Time Live Feed** | Auto-updating threat ticker with severity filtering (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `CLEAN`) |
| 🔐 **SQLite Persistence** | Structured relational storage using SQLAlchemy for scan records and metrics |

---

## 🧠 Technology Stack

### **Frontend**
```
React 18.2         → Component-based UI framework
TypeScript         → Strict type-safe client development
Vite 5.1           → High-performance dev server & bundler
TailwindCSS 3.4    → Dark cyber-noir glassmorphism design system
Lucide React       → Modern tactical icon set
Google Fonts       → Typography hierarchy (Inter, JetBrains Mono, Outfit)
```

### **Backend**
```
FastAPI 0.141      → High-performance asynchronous Python web framework
Uvicorn 0.52       → ASGI web server
SQLAlchemy 2.0     → Relational ORM for database operations
Pydantic v2        → Data validation & setting schemas
OpenCV (headless)  → Image frequency, face cascade, & edge detection
NumPy 2.5          → Array processing & spectral variance calculations
Pillow 12.3        → Image file decoding & EXIF metadata extraction
```

### **Integrations & OSINT**
```
Tavily Search API  → Live web context search for non-benign targets
n8n Webhooks       → Automated incident response alerting for Slack/Discord
SQLite3            → Embedded local relational database
```

---

## 📐 System Architecture

### **High-Level Architecture**

```
┌────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Threat Console   │  │ Deepfake Studio  │  │ AI Security Copilot  │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
│           │                     │                       │              │
│           └─────────────────────┴───────────────────────┘              │
│                                 │                                      │
│                         ┌───────▼────────┐                             │
│                         │   Vite + React │                             │
│                         │ (TypeScript)   │                             │
│                         └───────┬────────┘                             │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │ HTTP / REST API (Port 8000 Proxy)
┌─────────────────────────────────▼──────────────────────────────────────┐
│                        FASTAPI BACKEND ENGINE                          │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         API ROUTERS                              │  │
│  │ /api/scans  /api/metrics  /api/deepfake  /api/chat  /api/alerts │  │
│  └────────┬─────────────────────────────────────────────┬───────────┘  │
│           │                                             │              │
│  ┌────────▼──────────────┐                    ┌─────────▼───────────┐  │
│  │   SERVICES LAYER      │                    │    DATA MODELS      │  │
│  ├───────────────────────┤                    ├─────────────────────┤  │
│  │ • Threat Engine       │◄──────────────────►│ • ScanRecord        │  │
│  │ • Deepfake Analyzer   │                    │ • DashboardMetrics  │  │
│  │ • Tavily OSINT        │                    │ • Quizzes & News    │  │
│  │ • n8n Webhook Sender  │                    └─────────────────────┘  │
│  └────────┬──────────────┘                                             │
└───────────┼────────────────────────────────────────────────────────────┘
            │
    ┌───────┴──────┬──────────────────┬─────────────────┐
    │              │                  │                 │
┌───▼────┐   ┌─────▼──────┐    ┌──────▼──────┐   ┌──────▼──────┐
│ Tavily │   │ n8n Alert  │    │ SQLite DB   │   │ OpenCV /    │
│ OSINT  │   │ Webhook    │    │ SQLAlchemy  │   │ NumPy Engine│
└────────┘   └────────────┘    └─────────────┘   └─────────────┘
```

### **Data Flow Diagram**

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THREAT SCANNING WORKFLOW                        │
└────────────────────────────────────────────────────────────────────────┘

1. TARGET INGESTION
   User submits target (URL, IP, Hash, Log Payload)
   ↓
   Validate format & normalize target string
   ↓
   Generate unique scan UUID

2. MULTI-FACTOR THREAT ANALYSIS
   ↓
   ┌────────────────────────────────────────────────────────┐
   │ Heuristic & Rule Engine Analysis:                      │
   │ • TLD & brand keyword phishing check                   │
   │ • IP beacon & port signature scan                      │
   │ • SQLi & OWASP exploit pattern matching                │
   │ • Certificate / TLS verification                       │
   └────────────────────────────────────────────────────────┘
   ↓
   Calculate risk score & classification

3. OSINT INTEL ENRICHMENT
   ↓
   If target severity is HIGH or CRITICAL:
   Query Tavily Search API for active threat campaigns & domain history
   ↓
   Attach live web context to scan payload

4. INCIDENT RESPONSE DISPATCH
   ↓
   If target severity is HIGH or CRITICAL:
   Format incident JSON payload (target, severity, classification, trace)
   ↓
   Post JSON payload to n8n Webhook URL (Slack/Discord notification)

5. PERSISTENCE & RESPONSE
   ↓
   Save scan record & decision trace into SQLite database
   ↓
   Return JSON response to React dashboard
```

---

## 🤖 Detection Engine Pipeline

ThreatMesh AI uses a **hybrid multi-factor detection pipeline** combining rules-based heuristics with machine classification:

```
                  ┌──────────────────────────────┐
                  │    INPUT TARGET INGESTION    │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ HEURISTIC PATTERN MATCHING   │
                  │ • Malicious TLD Check        │
                  │ • IP C2 Port Verification    │
                  │ • SQLi Regex Signatures      │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ SCORE WEIGHTED AGGREGATION   │
                  │ • AI Weight: 75%             │
                  │ • Heuristic Weight: 25%      │
                  └──────────────┬───────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
                 ▼                               ▼
       [Score >= 0.70]                 [Score < 0.30]
   CLASSIFICATION: CRITICAL/HIGH     CLASSIFICATION: SAFE/CLEAN
                 │                               │
                 ▼                               ▼
        Tavily OSINT Search              Bypass Tavily & n8n
                 │                               │
                 ▼                               │
        n8n Webhook Dispatch                     │
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │   SQLITE PERSISTENCE & UI    │
                  └──────────────────────────────┘
```

---

## 🔬 Deepfake & Media Forensics Workspace

The platform provides a dedicated forensic workspace for inspecting synthetic media:

1. **AI Image Forensic Detector**:
   * **Skin Texture Smoothness**: Measures facial sub-surface variance (low variance indicates diffusion/GAN models).
   * **Spectral Noise Analysis**: Computes Laplacian variance to detect synthetic upscaling.
   * **Chromatic Saturation Profile**: Analyzes HSV saturation channels for Midjourney/StyleGAN color signatures.
   * **EXIF Metadata Inspection**: Verifies camera lens & sensor hardware tags.

2. **Voice Clone Audio Inspector**:
   * **Frequency Variance**: Detects neural voice synthesis artifacts across sample audio waveforms.

3. **QR Quishing Payload Decoder**:
   * **Payload Extraction**: Decodes QR code image matrix and evaluates embedded target URLs against the threat engine.

---

## ⚡ Installation & Local Setup

### **Prerequisites**
* **Node.js**: v18.0 or higher
* **Python**: v3.11 or higher
* **Git**: Installed

---

### **1. Clone the Repository**

```bash
git clone https://github.com/plainvector-art/ThreatMesh-AI.git
cd ThreatMesh-AI
```

---

### **2. Backend Setup (FastAPI)**

Navigate to the `backend` directory, create a virtual environment, install dependencies, and launch Uvicorn:

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

* **Backend Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
* **Interactive API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### **3. Frontend Setup (React + Vite)**

In a new terminal window, navigate to the `frontend` directory, install Node dependencies, and start Vite:

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

* **Local Web Dashboard**: [http://localhost:5173/](http://localhost:5173/)

---

## 📡 API Documentation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | `GET` | Health check endpoint returning service status |
| `/api/metrics` | `GET` | Returns aggregated metrics (total scans, threats blocked, active alerts) |
| `/api/scans` | `GET` | Fetches live threat scan feed with optional `severity` query filter |
| `/api/scans/{id}` | `GET` | Retrieves detailed threat scan record by ID |
| `/api/scans` | `POST` | Submits a target string for threat classification & OSINT analysis |
| `/api/alerts/test` | `POST` | Triggers a test incident response payload to n8n webhook |
| `/api/deepfake/samples` | `GET` | Returns deepfake benchmark sample presets |
| `/api/deepfake/analyze` | `POST` | Uploads and performs OpenCV forensic scan on image file |
| `/api/deepfake/analyze-preset` | `POST` | Runs forensic inspection on sample preset image |
| `/api/qr/analyze` | `POST` | Decodes QR code image and evaluates embedded URL |
| `/api/audio/analyze-sample` | `POST` | Analyzes audio sample for synthetic voice clone indicators |
| `/api/chat/ask` | `POST` | Queries AI Security Copilot for incident playbooks & CVE help |
| `/api/awareness/quizzes` | `GET` | Fetches analyst knowledge training challenges |
| `/api/awareness/news` | `GET` | Returns live CISA/NVD threat advisories |

---

## 🔐 Environment Configuration

Create a `.env` file inside the `backend/` folder (optional):

```env
# Tavily Live Web Search OSINT API Key (Optional — Fallback OSINT generator active if omitted)
TAVILY_API_KEY=tvly-YOUR_TAVILY_API_KEY

# n8n Incident Alert Webhook URL (Optional — Simulation mode active if omitted)
N8N_WEBHOOK_URL=https://n8n.your-domain.com/webhook/threat-alert

# Database URL
DATABASE_URL=sqlite:///./threatmesh.db

# Environment
ENVIRONMENT=development
```

---

## 🎯 Use Cases

1. **SOC Analyst Incident Triage**:
   * Inspect incoming phishing URLs, C2 beacon IPs, and SQLi log payloads with machine-readable decision traces.

2. **Deepfake & Synthetic Media Forensics**:
   * Verify authenticity of uploaded image profiles, synthetic voice recordings, and suspicious QR codes.

3. **Automated Incident Response**:
   * Dispatch high-severity alert notifications directly to Slack/Discord response channels via n8n.

4. **Tier-1 Security Analyst Training**:
   * Train security personnel with interactive vulnerability challenges and real-time CISA threat news updates.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
