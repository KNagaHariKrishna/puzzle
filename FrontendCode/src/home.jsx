import React, { useState } from 'react';
import axios from 'axios';

const CryptoDecoder = () => {
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
};

export default CryptoDecoder;