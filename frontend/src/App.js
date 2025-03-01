import React, { useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

const App = () => {
    const [image, setImage] = useState(null);
    const [capturing, setCapturing] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const webcamRef = useRef(null);

    const startCapture = () => {
        setCapturing(true);
        setImage(null);
        setError(""); // Reset error when opening the camera
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        setCapturing(false);
    };

    const cancelCapture = () => {
        setImage(null);
        setCapturing(false);
        setName(""); // Clear name when canceling
        setError(""); // Clear any errors
    };

    const uploadImage = async () => {
        if (!image) return alert("Capture an image first");
        if (!name.trim()) {
            setError("Name field cannot be empty");
            return;
        }

        const blob = await fetch(image).then((res) => res.blob());
        const formData = new FormData();
        formData.append("image", blob, "selfie.jpg");
        formData.append("name", name);

        try {
            const response = await axios.post("http://localhost:6005/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data) {
                alert("Image Uploaded Successfully");
                cancelCapture();
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image failed to upload");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Face Recognition Selfie Capture</h2>

            {capturing ? (
                <>
                    <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "500px", border: "2px solid black" }} />
                    <br />
                    <button onClick={capture} style={buttonStyle}>Capture</button>
                    <button onClick={cancelCapture} style={buttonStyle}>Cancel</button>
                </>
            ) : (
                <button onClick={startCapture} style={buttonStyle}>Start Camera</button>
            )}

            <br />

            {image && (
                <div style={containerStyle}>
                    <img src={image} alt="Captured" style={{ width: "300px", marginTop: "10px" }} />
                    
                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                    />
                    {error && <p style={{ color: "red", margin: "5px 0" }}>{error}</p>}
                    
                    <div style={buttonContainerStyle}>
                        <button onClick={cancelCapture} style={buttonStyle}>Cancel</button>
                        <button onClick={uploadImage} style={buttonStyle}>Upload</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Button Styling
const buttonStyle = {
    margin: "10px",
    padding: "10px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    background: "#007bff",
    color: "#fff",
};

// Container Styles
const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
};

// Button Container
const buttonContainerStyle = {
    display: "flex",
    gap: "20px",
};

// Input Styling
const inputStyle = {
    padding: "10px",
    width: "250px",
    borderRadius: "5px",
    border: "1px solid #ccc",
};

export default App;
