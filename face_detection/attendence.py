import cv2
import face_recognition
import numpy as np
import base64
from pymongo import MongoClient
from io import BytesIO
from PIL import Image
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Access the variables
MONGO_URI = os.getenv("MONGO_URI")

# Step 1: Scan the person's face
def scan_face():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)  # Open webcam
    
    if not cap.isOpened():
        print("Error: Could not access webcam")
        return None

    print("Scanning... Press 'q' to capture the face.")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not capture frame")
            break

        frame = cv2.rotate(frame, cv2.ROTATE_180)  # Rotate frame by 180 degrees
        frame = cv2.flip(frame, 1)  # Flip horizontally (optional, depends on webcam)

        # Display the webcam feed
        cv2.imshow("Scanning Face - Press 'q' to Capture", frame)

        # Press 'q' to capture the face
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    # Convert to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    rgb_frame = np.ascontiguousarray(rgb_frame)

    # Detect face
    face_locations = face_recognition.face_locations(rgb_frame)
    if not face_locations:
        print("No face detected. Try again!")
        return None

    # Encode the detected face
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
    if not face_encodings:
        print("Face detected, but encoding failed.")
        return None

    print("Face scanned successfully.")
    return face_encodings[0]  # Return the first face encoding

# Step 2: Load known faces from the database
def load_known_faces(collection):
    known_face_encodings = []
    known_face_names = []

    for document in collection.find():
        base64_image = document.get("image")
        name = document.get("name", "Unknown")  # Default name if missing

        if not base64_image:
            print(f"Skipping entry {name} - No image data found.")
            continue

        try:
            # Decode Base64 image
            image_data = base64.b64decode(base64_image)
            image = Image.open(BytesIO(image_data)).convert('RGB')  # Ensure RGB format
            image = np.array(image)  # Convert PIL Image to NumPy array
            image = np.ascontiguousarray(image)  # Ensure memory alignment

            # Get face encodings
            face_encodings = face_recognition.face_encodings(image)
            if face_encodings:
                known_face_encodings.append(face_encodings[0])
                known_face_names.append(name)
            else:
                print(f"Warning: No face found in {name}'s image. Skipping.")
        except Exception as e:
            print(f"Error processing {name}'s image: {e}")

    return known_face_encodings, known_face_names

# Step 3: Compare the scanned face with the database
def compare_faces(scanned_face_encoding, known_face_encodings, known_face_names, tolerance=0.6):
    if not known_face_encodings:
        return "No known faces available for comparison."

    distances = face_recognition.face_distance(known_face_encodings, scanned_face_encoding)
    min_distance_index = np.argmin(distances)
    min_distance = distances[min_distance_index]

    if min_distance < tolerance:
        return f"Face matched: {known_face_names[min_distance_index]}"
    else:
        return "Face not matched"

# Main function
def main():
    # MongoDB Connection
    connection_string = MONGO_URI
    database_name = "face_recognition_db"
    collection_name = "selfies"

    try:
        client = MongoClient(connection_string)
        db = client[database_name]
        collection = db[collection_name]
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return

    # Step 1: Scan the person's face
    scanned_face_encoding = scan_face()
    if scanned_face_encoding is None:
        print("No face detected. Exiting.")
        return

    # Step 2: Load known faces from the database
    known_face_encodings, known_face_names = load_known_faces(collection)

    # Step 3: Compare the scanned face with the database
    result = compare_faces(scanned_face_encoding, known_face_encodings, known_face_names)
    print(result)

if __name__ == "__main__":
    main()
