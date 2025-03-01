# Face Recognition Selfie Capture & Upload

This project captures a user's selfie, allows them to enter their name, and uploads the image to a backend server for storage in MongoDB. The backend is built with **Node.js, Express.js, and MongoDB**, while the frontend uses **React.js with Webcam integration**. Additionally, **Python** is used for performing face recognition.

## Features
- **Capture Selfie** using a webcam
- **Enter Name** before uploading
- **Upload Image** to the backend
- **Store in MongoDB** with base64 encoding
- **Retrieve Images** from the database
- **Face Recognition with Python** using OpenCV & Face Recognition Library

## Tech Stack
### **Frontend:**
- React.js
- Axios
- Webcam.js

### **Backend:**
- Node.js
- Express.js
- Multer (For handling file uploads)
- MongoDB
- dotenv (For managing environment variables)

### **Python (For Face Recognition Processing)**
- Python 3 (only use python 3.8 or python 3.9 versions because above versions not supported face_recognition library fully)
- OpenCV (`cv2`)  - 4.5.5.64
- dlib
- face-recognition 
- numpy  - 1.23.5
- dotenv (For handling secrets)

## Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/shanmukasagar/Attendence_System.git
cd your-repo
```

### 2️⃣ Setup Backend (Server)
#### **Install dependencies**
```sh
cd server
npm install
```
#### **Create a `.env` file in `server/`**
```
PORT=6005
MONGO_URI = mongodb+srv://shanmukasagar:sagar%4005@cluster0.3bton.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
#### **Run the Backend Server**
```sh
npm start
```
Server will start at `http://localhost:6005`

---

### 3️⃣ Setup Frontend (React App)
#### **Install dependencies**
```sh
cd frontend
npm install
```
#### **Run the Frontend**
```sh
npm start
```
Frontend will run at `http://localhost:3000`

---

### 4️⃣ Setup Python Script for Face Recognition
#### **Install dependencies**
```sh
pip install opencv-python dlib face-recognition numpy python-dotenv
```
#### **Create a `.env` file in Python directory**
```
MONGO_URI = mongodb+srv://shanmukasagar:sagar%4005@cluster0.3bton.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
#### **Run Python Face Recognition Script**
```sh
python face_recognition.py
```
This script will:
- Retrieve stored images from MongoDB.
- Capture a live image using a webcam.
- Compare the live image with stored images.
- Print whether a match is found or not.

## API Endpoints
### **Upload Image**
`POST /api/upload`
- **Body:** `FormData` with `image` file
- **Response:** `{ success: true, id: <MongoDB_ID> }`


## Folder Structure
```
project-root/
│── frontend/          # React Frontend
│── Backend/            # Express Backend
│── face_detection/     # Python Processing (Face Recognition) 
│── README.md          # Project Documentation
```

## Notes
- Ensure **MongoDB is running** before starting the backend.
- Use React frontend** to test the API endpoints.
- `.env` files should be **added to `.gitignore`** to prevent leaking secrets.
- Python script will match faces using the **face-recognition** library.


