const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 6005;

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());

// MongoDB Connection
let db;
const client = new MongoClient(process.env.MONGO_URI);
client.connect()
    .then(() => {
        console.log('MongoDB Connected');
        db = client.db('face_recognition_db');
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); // Exit if DB connection fails
    });

const collection = () => db.collection('selfies');

// Multer (File Upload Setup)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Image Route
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;

        // Validate name field
        if (!name || name.trim() === "") {
            return res.status(400).json({ success: false, message: "Name field is required" });
        }

        // Validate image file
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const imageBuffer = req.file.buffer.toString('base64');

        // Save to MongoDB
        const result = await collection().insertOne({ name, image: imageBuffer });

        res.status(200).json({ success: true, message: "Image uploaded successfully", id: result.insertedId });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
