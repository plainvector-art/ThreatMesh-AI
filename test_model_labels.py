from transformers import AutoModelForImageClassification
model = AutoModelForImageClassification.from_pretrained("dima806/deepfake_vs_real_image_detection")
print(model.config.id2label)
