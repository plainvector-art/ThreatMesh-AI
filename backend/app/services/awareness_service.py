import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

QUIZZES = [
    {
        "id": "q-1",
        "title": "Phishing & Domain Spoofing Defense",
        "difficulty": "Beginner",
        "question": "Which of the following domain names is most likely a phishing attempt targeting HDFC Bank?",
        "options": [
            "https://netbanking.hdfcbank.com/netbanking",
            "https://hdfc-security-login-update.xyz/login",
            "https://www.hdfcbank.com/personal",
            "https://retail.hdfcbank.com"
        ],
        "correct_index": 1,
        "explanation": "Domains using suspicious TLDs like '.xyz' combined with brand keywords ('hdfc-security-login-update') are classic phishing lures."
    },
    {
        "id": "q-2",
        "title": "Deepfake & Synthetic Media Recognition",
        "difficulty": "Intermediate",
        "question": "What is a key acoustic indicator of AI synthetic voice cloning?",
        "options": [
            "Natural background ambient noise",
            "Unnatural pitch constancy (lack of vocal cord micro-tremors)",
            "Standard dynamic frequency range",
            "Consistent stereo channel balancing"
        ],
        "correct_index": 1,
        "explanation": "Synthetic voice models often generate unnaturally flat pitch contours without human vocal cord micro-tremors."
    },
    {
        "id": "q-3",
        "title": "OWASP SQL Injection Vulnerabilities",
        "difficulty": "Advanced",
        "question": "How can developers effectively prevent SQL Injection attacks?",
        "options": [
            "Use client-side JavaScript regex checks only",
            "Use Parameterized Queries (Prepared Statements)",
            "Encode special characters into Base64 before querying",
            "Disable SSL certificates on the database port"
        ],
        "correct_index": 1,
        "explanation": "Parameterized queries ensure user inputs are treated strictly as data parameters rather than executable SQL code."
    }
]

CYBER_NEWS = [
    {
        "id": "news-1",
        "title": "CISA Issues Advisory on High-Severity Zero-Day Exploit",
        "category": "Vulnerability Advisory",
        "severity": "HIGH",
        "timestamp": "10 mins ago",
        "summary": "CISA has added a critical remote code execution vulnerability to its Known Exploited Vulnerabilities catalog targeting enterprise SSL VPN gateways."
    },
    {
        "id": "news-2",
        "title": "Emerging AI Voice Cloning Scams Target Financial Sector",
        "category": "Threat Intelligence",
        "severity": "CRITICAL",
        "timestamp": "42 mins ago",
        "summary": "Security analysts report a 40% surge in deepfake voice cloning campaigns impersonating corporate executives during wire transfer authorizations."
    },
    {
        "id": "news-3",
        "title": "Quishing Attacks Exploit QR Codes in Corporate Email Phishing",
        "category": "Phishing Lure",
        "severity": "MEDIUM",
        "timestamp": "2 hours ago",
        "summary": "Attackers are embedding QR codes in PDF attachments to bypass conventional email text security filters."
    }
]

class AwarenessService:
    def get_quizzes(self) -> List[Dict[str, Any]]:
        return QUIZZES

    def get_news(self) -> List[Dict[str, Any]]:
        return CYBER_NEWS

awareness_service = AwarenessService()
