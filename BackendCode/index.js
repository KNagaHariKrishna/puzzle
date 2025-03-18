const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const base64 = require('base-64');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Define Message Schema
const MessageSchema = new mongoose.Schema({
    original: String,
    decoded: String,
    decrypted: String,
    createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

app.post('/decode', async (req, res) => {
    try {
        const { encodedText, encodingType, key } = req.body;
        const second_text = "gAAAAABnbn8oO0O7Omqtqufcp6Nk5l4484KpgLs6aii8Kz2f_n2XP6Zb3IJfmxOO7iTu_AqYedOy9wpAKVOY5km7sqDJhTdzu2ZBldl8-vwunrvHaL602_ZOsON-koFbo9SUemw4scBmINBESZtjBBPycYIb6uuZ6aWQ70ywnsqYrn8Zyr5Fc2umRkaEghU5JS8eKxU9FA8KSZmMeqweClYM4mm4CyO3nzk7PHwht8usYSpKmNBrQccWCzvGCxFl4T_Q0tTJMk1JIQ_WWhJCcxQMeKMlBJV0oE0AoMd4Aw_o7B3QjTEQorI=";
        
        let decodedText = '';
        
        // Process the main encoded text
        if (encodingType === 'Base64') {
            try {
                decodedText = Buffer.from(encodedText, 'base64').toString('utf-8');
            } catch (error) {
                return res.status(400).json({ error: 'Invalid Base64 encoding' });
            }
        } else {
            return res.status(400).json({ error: 'Invalid encoding type' });
        }

        let decryptedText = '';
        if (key && key.length > 0) {
            try {
                // Create a proper key by hashing the provided key to get 32 bytes (256 bits)
                const keyHash = crypto.createHash('sha256').update(key).digest();
                
                // For decryption, the IV should be extracted from the encoded data
                // In a real implementation, the IV is typically stored in the first 16 bytes of the encrypted data
                // This is a simplified example assuming the IV is known or transmitted separately
                const iv = Buffer.alloc(16, 0); // Using a fixed IV for demonstration (not secure in production)
                
                const decipher = crypto.createDecipheriv('aes-256-cbc', keyHash, iv);
                
                let decryptBuffer = Buffer.from(decodedText, 'utf-8');
                decryptedText = decipher.update(decryptBuffer).toString('utf-8');
                decryptedText += decipher.final('utf-8');
            } catch (error) {
                console.error('Decryption error:', error.message);
                decryptedText = "Decryption failed. Make sure the key is correct and the text was properly encrypted.";
            }
        } else {
            // If no key is provided, just return the decoded text
            decryptedText = decodedText;
        }

        // Process the second text (Base64)
        let Base64secondText = '';
        try {
            Base64secondText = Buffer.from(second_text, 'base64').toString('utf-8');
        } catch (error) {
            Base64secondText = "Failed to decode second text: " + error.message;
        }

        // ROT13 function (simple implementation)
        const ROT13 = decodedText.replace(/[a-zA-Z]/g, function(char) {
            const charCode = char.charCodeAt(0);
            const isUpperCase = char === char.toUpperCase();
            const baseCharCode = isUpperCase ? 65 : 97;
            return String.fromCharCode(
                ((charCode - baseCharCode + 13) % 26) + baseCharCode
            );
        });

        res.json({ 
            decodedText, 
            decryptedText,
            Base64secondText,
            ROT13
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Error processing request: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
