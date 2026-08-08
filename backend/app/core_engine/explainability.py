from typing import List, Dict, Any

class ExplainabilityEngine:
    def generate_trace(
        self,
        input_target: str,
        input_type: str,
        probability: float,
        flags: List[str],
        highlights: List[Dict]
    ) -> List[Dict[str, Any]]:
        trace = []

        # Step 1: Input Parsing
        trace.append({
            "step": 1,
            "title": "Ingestion & Schema Normalization",
            "status": "passed",
            "detail": f"Parsed input target '{input_target}' as format '{input_type.upper()}'"
        })

        # Step 2: Feature Extraction
        flag_summary = ", ".join(flags) if flags else "No anomalous flags triggered"
        trace.append({
            "step": 2,
            "title": "Heuristic & Signature Extraction",
            "status": "warning" if flags else "passed",
            "detail": f"Extracted threat indicators: {flag_summary}"
        })

        # Step 3: Highlights & Evidence
        if highlights:
            for idx, h in enumerate(highlights, start=1):
                trace.append({
                    "step": 2 + idx,
                    "title": f"Evidence #{idx}: {h.get('type', 'indicator').title()}",
                    "status": "flagged",
                    "detail": f"[{h.get('value')}] {h.get('reason')}"
                })

        # Final Step: Model Classification Decision
        risk_percentage = int(probability * 100)
        trace.append({
            "step": len(trace) + 1,
            "title": "AI Risk Assessment Decision",
            "status": "critical" if probability >= 0.7 else ("warning" if probability >= 0.3 else "passed"),
            "detail": f"Calculated composite risk probability of {risk_percentage}% based on ML model and rule weights."
        })

        return trace
