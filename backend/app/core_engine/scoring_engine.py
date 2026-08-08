import re
from typing import Dict, Any, List
from app.core_engine.url_analyzer import URLAnalyzer
from app.core_engine.email_analyzer import EmailAndLogAnalyzer
from app.core_engine.explainability import ExplainabilityEngine

class ScoringEngine:
    def __init__(self):
        self.url_analyzer = URLAnalyzer()
        self.email_analyzer = EmailAndLogAnalyzer()
        self.explainability = ExplainabilityEngine()

    def process(self, input_target: str, input_type: str = "auto") -> Dict[str, Any]:
        target = input_target.strip()

        # Auto-detect input type if not specified
        if input_type == "auto" or not input_type:
            if target.startswith(("http://", "https://")) or "." in target and " " not in target:
                input_type = "url"
            elif re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', target):
                input_type = "ip"
            elif re.match(r'^[a-fA-F0-9]{32,64}$', target):
                input_type = "hash"
            else:
                input_type = "log"

        if input_type == "url":
            res = self.url_analyzer.analyze(target)
            probability = res.probability
            confidence = int(res.confidence * 100)
            flags = res.flags
            highlights = res.highlights
        else:
            res = self.email_analyzer.analyze(target)
            probability = res.probability
            confidence = int(res.confidence * 100)
            flags = res.flags
            highlights = res.highlights

        # Determine Classification
        if probability < 0.25:
            classification = "Safe"
            severity = "safe"
        elif "exploit_payload" in flags:
            classification = "SQLi / Exploit Payload"
            severity = "critical" if probability >= 0.7 else "high"
        elif "credential_harvester" in flags or "phishing_keywords_found" in flags:
            classification = "Phishing Site"
            severity = "critical" if probability >= 0.75 else "high"
        elif "ip_address_hostname" in flags or "ip_address_domain" in flags or "suspicious_tld" in flags:
            classification = "Malicious Domain / IP"
            severity = "high" if probability >= 0.65 else "medium"
        elif probability >= 0.6:
            classification = "Malware / Suspicious Indicator"
            severity = "high"
        else:
            classification = "Suspicious Indicator"
            severity = "low" if probability < 0.45 else "medium"

        # Generate machine & analyst reasoning trace
        trace = self.explainability.generate_trace(
            input_target=target,
            input_type=input_type,
            probability=probability,
            flags=flags,
            highlights=highlights
        )

        return {
            "input_target": target,
            "input_type": input_type,
            "classification": classification,
            "severity": severity,
            "confidence": confidence,
            "probability": probability,
            "flags": flags,
            "reasoning_trace": trace
        }
