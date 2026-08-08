import re
from typing import List, Set

URGENCY_PHRASES = [
    "urgent", "immediate", "immediately", "act now", "action required",
    "verify now", "confirm now", "limited time", "expires soon",
    "account suspended", "account blocked", "account locked",
    "within 24 hours", "within 48 hours", "last chance",
    "final notice", "important notice", "security alert",
    "unusual activity", "suspicious activity", "unauthorized access",
]

CREDENTIAL_PHRASES = [
    "enter your password", "confirm your password", "verify your identity",
    "enter your otp", "share your otp", "provide your otp",
    "enter your pin", "confirm your details", "update your kyc",
    "complete your kyc", "kyc verification", "click here to verify",
    "click the link", "login to verify", "verify your account",
    "enter your credentials", "enter your card", "enter your cvv",
    "bank account details", "debit card number", "credit card number",
]

FINANCIAL_SCAM_PHRASES = [
    "you have won", "congratulations", "prize money", "lottery",
    "selected for", "claim your reward", "free money", "cash prize",
    "government refund", "income tax refund", "tds refund",
    "insurance claim", "emi waiver", "loan approved",
    "upi cashback", "gpay offer", "phonepe offer", "paytm offer",
]

SUSPICIOUS_TLDS = {
    ".xyz", ".tk", ".ml", ".ga", ".cf", ".gq", ".pw",
    ".top", ".club", ".online", ".site", ".info", ".biz",
    ".link", ".click", ".download", ".stream", ".gdn", ".buzz", ".icu"
}

URL_SHORTENERS = {
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly",
    "is.gd", "buff.ly", "adf.ly", "tiny.cc", "cutt.ly",
    "rb.gy", "shorturl.at", "tiny.one", "short.io",
}

LEGITIMATE_DOMAINS = {
    "google.com", "youtube.com", "facebook.com", "amazon.com",
    "apple.com", "microsoft.com", "github.com", "stackoverflow.com",
    "wikipedia.org", "twitter.com", "x.com", "linkedin.com",
    "reddit.com", "netflix.com", "paypal.com", "ebay.com",
    "instagram.com", "whatsapp.com", "zoom.us", "render.com",
}

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_urls_from_text(text: str) -> List[str]:
    url_pattern = re.compile(
        r'https?://[^\s<>"{}|\\^`\[\]]+|'
        r'www\.[^\s<>"{}|\\^`\[\]]+'
    )
    urls = url_pattern.findall(text)
    return [url.rstrip('.,)>') for url in urls]
