import os
import sys
import json
from app.core_engine.fusion import EvidenceFusionEngine
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

def run_evaluation():
    engine = EvidenceFusionEngine()
    fixtures_dir = os.path.join(os.path.dirname(__file__), "..", "tests", "fixtures", "image_detection")
    manifest_path = os.path.join(fixtures_dir, "manifest.json")

    with open(manifest_path, "r") as f:
        benchmark_dataset = json.load(f)

    y_true = []
    y_pred = []
    y_scores = []

    print("Starting Model Evaluation...")
    for item in benchmark_dataset:
        try:
            print(f"Evaluating: {item['id']}")
            img_path = os.path.join(fixtures_dir, item['path'])
            with open(img_path, "rb") as img_file:
                image_bytes = img_file.read()

            result = engine.analyze(image_bytes, item['path'])

            # Map ground truth to binary 1=AI, 0=Real
            true_label = 1 if item["ground_truth"] == "AI_GENERATED" else 0

            y_true.append(true_label)
            y_scores.append(result["ai_probability"])
            y_pred.append(1 if result["verdict"] in ["AI_GENERATED", "AI_EDITED_OR_MANIPULATED"] else 0)
        except Exception as e:
            print(f"Error evaluating {item['id']}: {e}")

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
