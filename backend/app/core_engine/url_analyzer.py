import re
import math
import time
import socket
from dataclasses import dataclass, field
from typing import List, Dict, Any
from urllib.parse import urlparse
from app.core_engine.text_preprocessing import (
    SUSPICIOUS_TLDS,
    URL_SHORTENERS,
    LEGITIMATE_DOMAINS,
)

PHISHING_KEYWORDS = [
    "login", "signin", "sign-in", "verify", "verification",
    "secure", "security", "account", "update", "confirm",
    "banking", "password", "credential", "suspend", "alert",
    "unusual", "activity", "restore", "unlock", "validate",
    "authenticate", "wallet", "paypal", "apple", "microsoft",
    "amazon", "netflix", "facebook", "instagram", "google",
    "ebay", "chase", "wells", "citi", "hsbc",
]

@dataclass
class URLAnalysisResult:
    probability: float
    confidence: float
    flags: List[str] = field(default_factory=list)
    features: Dict[str, Any] = field(default_factory=dict)
    highlights: List[Dict] = field(default_factory=list)
    rule_score: float = 0.0
    processing_time_ms: int = 0

class URLAnalyzer:
    def analyze(self, url: str) -> URLAnalysisResult:
        start_time = time.time()
        flags: List[str] = []
        features: Dict[str, Any] = {}
        highlights: List[Dict] = []
        score = 0.0

        target_url = url.strip()
        if not target_url.startswith(("http://", "https://")):
            target_url = "https://" + target_url

        try:
            parsed = urlparse(target_url)
        except Exception:
            return URLAnalysisResult(
                probability=0.85,
                rule_score=0.85,
                confidence=0.9,
                flags=["invalid_url_format"],
                features={"error": "Could not parse URL"},
                processing_time_ms=int((time.time() - start_time) * 1000),
            )

        hostname = (parsed.hostname or "").lower()
        path = parsed.path.lower()
        query = parsed.query.lower()

        features["scheme"] = parsed.scheme
        features["hostname"] = hostname
        features["path"] = parsed.path
        features["query"] = parsed.query
        features["url_length"] = len(target_url)

        # 1. Scheme Check
        if parsed.scheme == "http":
            score += 0.15
            flags.append("no_https")
            highlights.append({
                "type": "scheme",
                "value": "http",
                "reason": "Connection is unencrypted (HTTP instead of HTTPS)"
            })

        # 2. IP Address check
        is_ip = self._is_ip_address(hostname)
        features["uses_ip_address"] = is_ip
        if is_ip:
            score += 0.35
            flags.append("ip_address_hostname")
            highlights.append({
                "type": "hostname",
                "value": hostname,
                "reason": "Host uses raw IP address instead of domain name"
            })

        # 3. Known Legitimate Domain check
        is_legit = any(hostname == dom or hostname.endswith("." + dom) for dom in LEGITIMATE_DOMAINS)
        if is_legit and not is_ip:
            score = max(0.0, score - 0.40)
            features["legitimate_domain"] = True

        # 4. Suspicious TLD
        tld = "." + hostname.split(".")[-1] if "." in hostname else ""
        if tld in SUSPICIOUS_TLDS:
            score += 0.25
            flags.append("suspicious_tld")
            highlights.append({
                "type": "tld",
                "value": tld,
                "reason": f"TLD '{tld}' has high historical association with phishing"
            })

        # 5. URL Shorteners
        if hostname in URL_SHORTENERS:
            score += 0.20
            flags.append("url_shortener")
            highlights.append({
                "type": "hostname",
                "value": hostname,
                "reason": "URL shortener detected — hides final destination target"
            })

        # 6. Subdomain Abuses
        subdomain_count = hostname.count(".")
        if subdomain_count >= 3:
            score += 0.15
            flags.append("excessive_subdomains")
            highlights.append({
                "type": "subdomain",
                "value": hostname,
                "reason": f"Excessive subdomains ({subdomain_count}) mimicking complex domain architecture"
            })

        # 7. Phishing Keyword Patterns
        found_keywords = [kw for kw in PHISHING_KEYWORDS if kw in path or kw in query or kw in hostname]
        if found_keywords and not is_legit:
            score += min(0.30, len(found_keywords) * 0.10)
            flags.append("phishing_keywords_found")
            highlights.append({
                "type": "keywords",
                "value": ", ".join(found_keywords[:3]),
                "reason": f"Contains sensitive authentication keywords: {', '.join(found_keywords[:3])}"
            })

        # Clamp score between 0.0 and 1.0
        final_probability = max(0.0, min(1.0, score))
        confidence = 0.95 if (final_probability > 0.7 or is_legit) else 0.85

        return URLAnalysisResult(
            probability=round(final_probability, 4),
            rule_score=round(final_probability, 4),
            confidence=confidence,
            flags=flags,
            features=features,
            highlights=highlights,
            processing_time_ms=int((time.time() - start_time) * 1000)
        )

    def _is_ip_address(self, host: str) -> bool:
        if not host:
            return False
        pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
        return bool(re.match(pattern, host))
