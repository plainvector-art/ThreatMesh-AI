import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

SECURITY_KNOWLEDGE_BASE = [
    {
        "keywords": ["phishing", "credential", "url", "link", "bank"],
        "answer": "Phishing sites lure victims into submitting credentials by spoofing authentic brand domains. ThreatMesh AI inspects domain age, suspicious TLDs (.xyz, .tk), keyword stuffing, and SSL certificate anomalies. Immediate Action: Block domain at perimeter firewall, reset affected user credentials, and purge matching emails."
    },
    {
        "keywords": ["deepfake", "synthetic", "face", "image", "voice", "clone"],
        "answer": "Deepfake media leverages GANs or Diffusion models (Midjourney, SD XL, ElevenLabs) to synthesize human faces or voices. ThreatMesh AI analyzes skin texture variance, Laplacian noise suppression, chromatic saturation anomalies, and neural vocoder phase continuity."
    },
    {
        "keywords": ["sqli", "sql", "injection", "exploit", "database"],
        "answer": "SQL Injection occurs when untrusted user inputs alter database queries (e.g. ' OR '1'='1). ThreatMesh AI detects SQLi payloads via signature matching. Mitigation: Use parameterized queries / prepared statements and validate input parameters."
    },
    {
        "keywords": ["n8n", "alert", "slack", "discord", "webhook"],
        "answer": "ThreatMesh AI integrates with n8n incident orchestration webhooks to dispatch structured JSON alerts to Slack/Discord channels within <30s of detecting critical threats."
    }
]

class SecurityChatbotService:
    def process_query(self, user_message: str) -> Dict[str, Any]:
        query_lower = user_message.lower()

        matched_answer = None
        for kb in SECURITY_KNOWLEDGE_BASE:
            if any(kw in query_lower for kw in kb["keywords"]):
                matched_answer = kb["answer"]
                break

        if not matched_answer:
            matched_answer = (
                f"ThreatMesh AI Copilot Advisor: Analyzing threat query regarding '{user_message[:60]}'. "
                f"For suspicious URLs or hashes, submit target directly in the Threat Console. "
                f"For deepfake verification, use the Deepfake & Media Forensics tab for frequency artifact scans."
            )

        return {
            "query": user_message,
            "response": matched_answer,
            "suggested_actions": [
                "Submit indicator to Threat Console",
                "Trigger test n8n alert webhook",
                "Execute Deepfake Image/Audio scan"
            ]
        }

chatbot_service = SecurityChatbotService()
