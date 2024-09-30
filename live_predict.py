import cv2
import os
from ultralytics import YOLO

# Path to your trained YOLO model
model_path = r"C:\torch.env\CODE\runs\detect\train3\weights\best.pt"

# Check if model file exists
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")

# Load your trained YOLO model
model = YOLO(model_path)

# Define class names
class_names = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

# Start video capture
cap = cv2.VideoCapture(0)  # Use 0 for webcam or replace with a video file path

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to capture video")
        break

    # Perform inference
    results = model(frame)

    # Process results
    for result in results:
        boxes = result.boxes
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])  # Get box coordinates
            conf = box.conf[0]                      # Confidence score
            cls = int(box.cls[0])                   # Class ID
            label = f"{class_names[cls]} {conf:.2f}"  # Get class name and confidence

            # Draw bounding box and label on the frame
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Show the frame
    cv2.imshow("Live Detection", frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture and destroy all OpenCV windows
cap.release()
cv2.destroyAllWindows()
