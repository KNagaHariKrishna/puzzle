# Crypto Puzzle Solver

This repository contains a solution for a cryptographic puzzle that involves multiple encoding and encryption techniques. The solution combines frontend and backend logic to decode various encrypted messages.

## The Puzzle

The puzzle presented encoded text that needed to be decrypted through multiple layers:
1. Base64 decoding
2. AES decryption (when applicable)
3. ROT13 transformation
4. Processing of a secondary encrypted text

## Solution Architecture

### Backend (Node.js with Express)

The backend provides a REST API that handles the decoding and decryption process:

```javascript
app.post('/decode', async (req, res) => {
    try {
        const { encodedText, encodingType, key } = req.body;
        const second_text = "gAAAAABnbn8oO0O7Omqtqufcp6Nk5l4484KpgLs6aii8Kz2f_n2XP6Zb3IJfmxOO7iTu_AqYedOy9wpAKVOY5km7sqDJhTdzu2ZBldl8-vwunrvHaL602_ZOsON-koFbo9SUemw4scBmINBESZtjBBPycYIb6uuZ6aWQ70ywnsqYrn8Zyr5Fc2umRkaEghU5JS8eKxU9FA8KSZmMeqweClYM4mm4CyO3nzk7PHwht8usYSpKmNBrQccWCzvGCxFl4T_Q0tTJMk1JIQ_WWhJCcxQMeKMlBJV0oE0AoMd4Aw_o7B3QjTEQorI=";
        
        // Process primary text
        let decodedText = '';
        if (encodingType === 'Base64') {
            decodedText = Buffer.from(encodedText, 'base64').toString('utf-8');
        }

        // Apply decryption if key is provided
        let decryptedText = '';
        if (key && key.length > 0) {
            const keyHash = crypto.createHash('sha256').update(key).digest();
            const iv = Buffer.alloc(16, 0); // Fixed IV for demo purposes
            const decipher = crypto.createDecipheriv('aes-256-cbc', keyHash, iv);
            let decryptBuffer = Buffer.from(decodedText, 'utf-8');
            decryptedText = decipher.update(decryptBuffer).toString('utf-8');
            decryptedText += decipher.final('utf-8');
        } else {
            decryptedText = decodedText;
        }

        // Process second text
        let Base64secondText = Buffer.from(second_text, 'base64').toString('utf-8');

        // Apply ROT13 transformation
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
```

### Frontend (React)

The frontend provides an intuitive interface for users to interact with the decoding process:

```jsx
function CryptoSolver() {
  const [inputText, setInputText] = useState('');
  const [encodingType, setEncodingType] = useState('Base64');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encodedText: inputText,
          encodingType,
          key: decryptionKey
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setResults(data);
        setError('');
      } else {
        setError(data.error || 'Failed to decode');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  return (
    <div className="container">
      <h1>Crypto Puzzle Solver</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Encoded Text:</label>
          <textarea 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Encoding Type:</label>
          <select 
            value={encodingType} 
            onChange={(e) => setEncodingType(e.target.value)}
          >
            <option value="Base64">Base64</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Decryption Key (optional):</label>
          <input 
            type="text" 
            value={decryptionKey} 
            onChange={(e) => setDecryptionKey(e.target.value)}
          />
        </div>
        
        <button type="submit">Decode</button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      {results && (
        <div className="results">
          <h2>Results</h2>
          
          <div className="result-item">
            <h3>Base64 Decoded:</h3>
            <pre>{results.decodedText}</pre>
          </div>
          
          {decryptionKey && (
            <div className="result-item">
              <h3>Decrypted Text:</h3>
              <pre>{results.decryptedText}</pre>
            </div>
          )}
          
          <div className="result-item">
            <h3>ROT13 Transformation:</h3>
            <pre>{results.ROT13}</pre>
          </div>
          
          <div className="result-item">
            <h3>Second Text Decoded:</h3>
            <pre>{results.Base64secondText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Solving the Puzzle Step by Step

1. **Input Collection**:
   - User provides the encrypted text through the frontend interface
   - User optionally provides a decryption key if AES decryption is needed

2. **Base Layer Decoding**:
   - First, apply Base64 decoding to the input text
   - The decoded text is sent back to the frontend as `decodedText`

3. **Decryption Layer** (when applicable):
   - If a key is provided, the backend attempts to decrypt the Base64-decoded text using AES-256-CBC
   - The key is hashed using SHA-256 to produce a consistent key length
   - A fixed IV is used for demonstration purposes (in a production environment, the IV would be extracted from the encrypted data)

4. **ROT13 Transformation**:
   - Apply ROT13 cipher to the decoded text, which shifts each letter 13 positions in the alphabet
   - This transformation helps reveal hidden messages embedded in the text

5. **Secondary Text Processing**:
   - A hardcoded secondary encoded text was provided in the puzzle
   - This text is also Base64-decoded and included in the results

6. **Result Presentation**:
   - All results are displayed in the frontend for analysis:
     - Original Base64 decoded text
     - Decrypted text (if applicable)
     - ROT13 transformation
     - Secondary text decoding

## Note on Secondary Text Decryption

**Important**: Despite multiple attempts, I was unable to obtain the proper key to fully decrypt the second encoded text (`second_text`). The Base64 decoding of this text produces what appears to be further encrypted data. My solution focuses on applying both ROT13 transformation and Base64 decoding to this text, which were the only methods that yielded any readable information from this secondary encrypted data.

The challenge likely involves additional encryption layers or custom algorithms that would require further analysis or specific keys that weren't readily available. This highlights the multi-layered nature of modern cryptographic puzzles.

## Security Considerations

This implementation makes several simplifications for demonstration purposes:

1. In a production environment, the IV should be properly generated, stored, and retrieved
2. Error handling is basic and could be enhanced
3. The fixed IV used for decryption is not secure for real-world applications

## Running the Solution

1. Install dependencies:
   ```bash
   npm install express crypto body-parser
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. Open the frontend application in your browser at `http://localhost:3000`

## Conclusion

This solution demonstrates a multi-layered approach to solving cryptographic puzzles, combining:
- Base64 decoding
- AES decryption
- ROT13 transformation
- Frontend and backend integration

While I successfully implemented decoding and transformation techniques for the primary text, the secondary text remains partially encrypted, demonstrating the complexity of multi-layered cryptographic challenges. The techniques used in this project can be applied to similar cryptographic challenges and can be extended to include additional encoding and encryption methods.
