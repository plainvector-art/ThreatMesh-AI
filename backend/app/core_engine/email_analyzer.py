import re
import time
from dataclasses import dataclass, field
from typing import List, Dict, Any
from app.core_engine.text_preprocessing import (
    URGENCY_PHRASES,
    CREDENTIAL_PHRASES,
    FINANCIAL_SCAM_PHRASES,
    clean_text
)

@dataclass
class TextAnalysisResult:
    probability: float
    confidence: float
    flags: List[str] = field(default_factory=list)
    features: Dict[str, Any] = field(default_factory=dict)
    highlights: List[Dict] = field(default_factory=list)

class EmailAndLogAnalyzer:
    def analyze(self, text: str) -> TextAnalysisResult:
        start_time = time.time()
        flags: List[str] = []
        features: Dict[str, Any] = {}
        highlights: List[Dict] = []
        score = 0.0

        cleaned = clean_text(text)

        # 1. Urgency Phrases
        urgency_matches = [phrase for phrase in URGENCY_PHRASES if phrase in cleaned]
        if urgency_matches:
            score += min(0.30, len(urgency_matches) * 0.10)
            flags.append("urgent_language")
            highlights.append({
                "type": "language",
                "value": urgency_matches[0],
                "reason": f"High-urgency coercive social engineering language detected ('{urgency_matches[0]}')"
            })

        # 2. Credential Theft Indications
        cred_matches = [phrase for phrase in CREDENTIAL_PHRASES if phrase in cleaned]
        if cred_matches:
            score += min(0.35, len(cred_matches) * 0.12)
            flags.append("credential_harvester")
            highlights.append({
                "type": "credentials",
                "value": cred_matches[0],
                "reason": f"Requests sensitive authentication credentials ('{cred_matches[0]}')"
            })

        # 3. Financial Scam Patterns
        scam_matches = [phrase for phrase in FINANCIAL_SCAM_PHRASES if phrase in cleaned]
        if scam_matches:
            score += min(0.30, len(scam_matches) * 0.10)
            flags.append("financial_scam_pattern")
            highlights.append({
                "type": "scam",
                "value": scam_matches[0],
                "reason": f"Financial scam lure detected ('{scam_matches[0]}')"
            })

        # 4. SQL Injection / Exploit Log Signatures
        sqli_patterns = [r"union\s+select", r"exec\s*\(", r"drop\s+table", r"<\s*script\s*>", r"1=1", r"or\s+1=1"]
        for pat in sqli_patterns:
            if re.search(pat, cleaned, re.IGNORECASE):
                score += 0.40
                flags.append("exploit_payload")
                highlights.append({
                    "type": "exploit",
                    "value": pat,
                    "reason": "Web application exploit payload / SQL injection pattern matched"
                })
                break

        final_probability = max(0.0, min(1.0, score))
        confidence = 0.90 if final_probability > 0.5 else 0.80

        return TextAnalysisResult(
            probability=round(final_probability, 4),
            confidence=confidence,
            flags=flags,
            features={"text_length": len(text), "cleaned_length": len(cleaned)},
            highlights=highlights
        )
