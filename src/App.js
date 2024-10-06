import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [iv, setIv] = useState(''); // Store IV here
  const [decryptionMessage, setDecryptionMessage] = useState('');
  const [encryptedFilePath, setEncryptedFilePath] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload and encryption
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('File encrypted and uploaded successfully');
      setDownloadLink(`http://localhost:5000${response.data.filePath}`);
      setIv(response.data.iv); // Store IV for decryption later
      console.log('IV:', response.data.iv);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file');
    }
  };

  // Handle file decryption
  const handleDecrypt = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/decrypt', {
        filePath: encryptedFilePath,
        iv: iv,
      });
      setDecryptionMessage('File decrypted successfully');
      console.log('Decrypted file path:', response.data.filePath);
    } catch (error) {
      console.error('Error decrypting file:', error);
      setDecryptionMessage('Error decrypting file');
    }
  };

  return (
    <div className="App">
      <h1>File Encryption Tool</h1>

      {/* File Upload */}
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload and Encrypt</button>
      </form>
      {message && <p>{message}</p>}
      
      {/* Download Encrypted File */}
      {downloadLink && (
        <div>
          <a href={downloadLink} download>Download Encrypted File</a>
          <p><strong>IV:</strong> {iv}</p>
        </div>
      )}

      {/* File Decryption */}
      <form onSubmit={handleDecrypt}>
        <input
          type="text"
          placeholder="Encrypted file path"
          value={encryptedFilePath}
          onChange={(e) => setEncryptedFilePath(e.target.value)}
        />
        <input
          type="text"
          placeholder="IV (initialization vector)"
          value={iv}
          onChange={(e) => setIv(e.target.value)}
        />
        <button type="submit">Decrypt</button>
      </form>
      {decryptionMessage && <p>{decryptionMessage}</p>}
    </div>
  );
}

export default App;
