const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const app = express();
const port = 3000;

// Set up storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files (for serving the frontend)
app.use(express.static('public'));

// Route to handle image upload and conversion
app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        // Get the original file name without the extension
        const originalName = path.parse(req.file.originalname).name;
        
        // Convert the image to WebP with high quality
        const buffer = await sharp(req.file.buffer)
            .webp({ quality: 100 })  // Set quality to 100 for maximum quality
            .toBuffer();

        // Set headers to download the converted image with the same name but .webp extension
        res.set({
            'Content-Disposition': `attachment; filename="${originalName}.webp"`,
            'Content-Type': 'image/webp'
        });
        res.send(buffer);
    } catch (err) {
        res.status(500).send('Error converting image.');
        console.error(err);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
