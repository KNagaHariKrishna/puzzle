// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import axios from 'axios';
// import './App.css';

// const API_URL = 'http://localhost:5000/api';

// // Home Component
// function Home() {
//   return (
//     <div className="home">
//       <h1>Cryptographic Puzzle Challenge</h1>
//       <p>Welcome to the Cryptographic Puzzle Challenge. Only the best cryptographers may proceed!</p>
//       <p>Your journey begins at the swanky pub called Lucio.</p>
//       <div className="buttons">
//         <Link to="/puzzle" className="button">Start Puzzle</Link>
//         <Link to="/leaderboard" className="button">Leaderboard</Link>
//       </div>
//     </div>
//   );
// }

// // Puzzle Component
// function Puzzle() {
//   const [username, setUsername] = useState('');
//   const [stageNumber, setStageNumber] = useState(1);
//   const [encodedMessage, setEncodedMessage] = useState('');
//   const [hint, setHint] = useState('');
//   const [solution, setSolution] = useState('');
//   const [feedback, setFeedback] = useState('');
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [decodedMessage, setDecodedMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isStarted, setIsStarted] = useState(false);

//   // Fetch initial puzzle stage
//   const startPuzzle = async () => {
//     if (!username.trim()) {
//       setFeedback('Please enter a username');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/puzzle/start`);
//       setStageNumber(response.data.stageNumber);
//       setEncodedMessage(response.data.encodedMessage);
//       setHint(response.data.hint);
//       setIsStarted(true);
//       setFeedback('');
//     } catch (error) {
//       setFeedback('Error starting puzzle');
//       console.error('Error starting puzzle:', error);
//     }
//     setIsLoading(false);
//   };

//   // Submit solution
//   const submitSolution = async (e) => {
//     e.preventDefault();
    
//     if (!solution.trim()) {
//       setFeedback('Please enter a solution');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const response = await axios.post(`${API_URL}/puzzle/submit`, {
//         username,
//         stageNumber,
//         solution
//       });
      
//       if (response.data.success) {
//         setIsSuccess(true);
//         setFeedback('Correct solution!');
//         setDecodedMessage(response.data.decodedMessage);
        
//         if (response.data.nextStage) {
//           setTimeout(() => {
//             setStageNumber(response.data.nextStage.stageNumber);
//             setEncodedMessage(response.data.nextStage.encodedMessage);
//             setHint(response.data.nextStage.hint);
//             setSolution('');
//             setIsSuccess(false);
//             setDecodedMessage('');
//           }, 3000);
//         }
//       } else{

//         setIsSuccess(false);
//           setFeedback('Incorrect solution. Try again.');
//       }
//       }
//     catch (error) {
//       setFeedback('Error submitting solution');
//       console.error('Error submitting solution:', error);
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div className="puzzle-container">
//       {!isStarted ? (
//         <div className="username-form">
//           <h2>Enter Your Username to Begin</h2>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Username"
//             className="input-field"
//           />
//           <button onClick={startPuzzle} disabled={isLoading} className="button">
//             {isLoading ? 'Loading...' : 'Start Puzzle'}
//           </button>
//           {feedback && <p className="feedback">{feedback}</p>}
//         </div>
//       ) : (
//         <div className="puzzle-stage">
//           <div className="stage-header">
//             <h2>Stage {stageNumber}</h2>
//             <span className="username">User: {username}</span>
//           </div>
          
//           <div className="puzzle-content">
//             <div className="hint-box">
//               <h3>Hint:</h3>
//               <p>{hint}</p>
//             </div>
            
//             <div className="message-box">
//               <h3>Encoded Message:</h3>
//               <pre className="encoded-text">{encodedMessage}</pre>
//             </div>
            
//             {decodedMessage && (
//               <div className="decoded-box">
//                 <h3>Decoded Message:</h3>
//                 <pre className="decoded-text">{decodedMessage}</pre>
//               </div>
//             )}
            
//             <form onSubmit={submitSolution} className="solution-form">
//               <label htmlFor="solution">Your Solution:</label>
//               <input
//                 id="solution"
//                 type="text"
//                 value={solution}
//                 onChange={(e) => setSolution(e.target.value)}
//                 placeholder="Enter your solution"
//                 className="input-field"
//               />
//               <button type="submit" disabled={isLoading} className="button">
//                 {isLoading ? 'Submitting...' : 'Submit'}
//               </button>
//             </form>
            
//             {feedback && (
//               <p className={`feedback ${isSuccess ? 'success' : 'error'}`}>
//                 {feedback}
//               </p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Leaderboard Component
// function Leaderboard() {
//   const [leaders, setLeaders] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/leaderboard`);
//         setLeaders(response.data);
//         setIsLoading(false);
//       } catch (err) {
//         setError('Failed to load leaderboard');
//         setIsLoading(false);
//         console.error('Error fetching leaderboard:', err);
//       }
//     };

//     fetchLeaderboard();
//   }, []);

//   if (isLoading) {
//     return <div className="loading">Loading leaderboard...</div>;
//   }

//   if (error) {
//     return <div className="error">{error}</div>;
//   }

//   return (
//     <div className="leaderboard">
//       <h2>Puzzle Masters</h2>
      
//       {leaders.length === 0 ? (
//         <p>No one has completed the puzzle yet. Be the first!</p>
//       ) : (
//         <table className="leaderboard-table">
//           <thead>
//             <tr>
//               <th>Rank</th>
//               <th>Username</th>
//               <th>Completion Time</th>
//               <th>Attempts</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaders.map((leader, index) => (
//               <tr key={leader._id}>
//                 <td>{index + 1}</td>
//                 <td>{leader.username}</td>
//                 <td>{new Date(leader.completedAt).toLocaleString()}</td>
//                 <td>{leader.attempts}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
      
//       <Link to="/" className="button">Back to Home</Link>
//     </div>
//   );
// }

// // Admin Component (for puzzle management)
// function Admin() {
//   const [adminKey, setAdminKey] = useState('');
//   const [feedback, setFeedback] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const resetPuzzle = async (e) => {
//     e.preventDefault();
    
//     if (!adminKey.trim()) {
//       setFeedback('Please enter admin key');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const response = await axios.post(`${API_URL}/admin/reset`, { adminKey });
//       setFeedback(response.data.message);
//     } catch (error) {
//       setFeedback('Error: Unauthorized or server error');
//       console.error('Error resetting puzzle:', error);
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div className="admin-panel">
//       <h2>Admin Panel</h2>
      
//       <form onSubmit={resetPuzzle} className="admin-form">
//         <label htmlFor="adminKey">Admin Key:</label>
//         <input
//           id="adminKey"
//           type="password"
//           value={adminKey}
//           onChange={(e) => setAdminKey(e.target.value)}
//           placeholder="Enter admin key"
//           className="input-field"
//         />
//         <button type="submit" disabled={isLoading} className="button">
//           {isLoading ? 'Processing...' : 'Reset Puzzle'}
//         </button>
//       </form>
      
//       {feedback && <p className="feedback">{feedback}</p>}
      
//       <Link to="/" className="button">Back to Home</Link>
//     </div>
//   );
// }

// // Main App Component
// function App() {
//   return (
//     <Router>
//       <div className="app">
//         <header className="app-header">
//           <h1>Cryptographic Puzzle Challenge</h1>
//         </header>
        
//         <main className="app-content">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/puzzle" element={<Puzzle />} />
//             <Route path="/leaderboard" element={<Leaderboard />} />
//             <Route path="/admin" element={<Admin />} />
//           </Routes>
//         </main>
        
//         <footer className="app-footer">
//           <p>&copy; {new Date().getFullYear()} Cryptographic Puzzle Challenge</p>
//         </footer>
//       </div>
//     </Router>
//   );
// }

// export default App;


import React, { useState } from 'react';
import axios from 'axios';
import CryptoDecoder from './home';

function App() {
    // const [encodedText, setEncodedText] = useState('');
    // const [encodingType, setEncodingType] = useState('Base64');
    // const [key, setKey] = useState('');
    // const [decodedText, setDecodedText] = useState('');
    // const [decryptedText, setDecryptedText] = useState('');

    // const handleDecode = async () => {
    //     if (!encodedText.trim()) {
    //         alert('Please enter text to decode.');
    //         return;
    //     }
        
    //     try {
    //         const response = await axios.post('http://localhost:5000/decode', { encodedText, encodingType, key });
    //         setDecodedText(response.data.decodedText);
    //         setDecryptedText(response.data.decryptedText);
    //     } catch (error) {
    //         console.error('Error decoding:', error);
    //     }
    // };

    return (
      <CryptoDecoder/>
    );
}

export default App;