import os
import sys
import json
import urllib.request
from app.core_engine.fusion import EvidenceFusionEngine
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

def fetch_image(url: str) -> bytes:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        return response.read()

def run_evaluation():
    engine = EvidenceFusionEngine()

    benchmark_dataset = [
        {"url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80", "true_label": 1, "name": "AI Portrait (StyleGAN)"}, # 1 for AI_GENERATED
        {"url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80", "true_label": 1, "name": "AI Diffusion (Midjourney)"},
        {"url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80", "true_label": 0, "name": "Authentic Portrait"}, # 0 for REAL
        {"url": "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=500&q=80", "true_label": 0, "name": "Authentic Landscape"}
    ]

    y_true = []
    y_pred = []
    y_scores = []

    print("Starting Model Evaluation...")
    for item in benchmark_dataset:
        try:
            print(f"Evaluating: {item['name']}")
            image_bytes = fetch_image(item["url"])
            result = engine.analyze(image_bytes, "benchmark.jpg")

            y_true.append(item["true_label"])
            y_scores.append(result["ai_probability"])
            y_pred.append(1 if result["verdict"] in ["AI_GENERATED", "AI_EDITED_OR_MANIPULATED"] else 0)
        except Exception as e:
            print(f"Error evaluating {item['name']}: {e}")

    if y_true:
        acc = accuracy_score(y_true, y_pred)
        prec = precision_score(y_true, y_pred, zero_division=0)
        rec = recall_score(y_true, y_pred, zero_division=0)
        f1 = f1_score(y_true, y_pred, zero_division=0)
        try:
            auc = roc_auc_score(y_true, y_scores)
        except ValueError:
            auc = 0.5 # If only one class is present in a tiny test sample

        print("\n--- Evaluation Metrics ---")
        print(f"Accuracy:  {acc:.4f}")
        print(f"Precision: {prec:.4f}")
        print(f"Recall:    {rec:.4f}")
        print(f"F1 Score:  {f1:.4f}")
        print(f"ROC-AUC:   {auc:.4f}")

if __name__ == "__main__":
    run_evaluation()
