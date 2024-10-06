import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [iv, setIv] = useState('');
  const [decryptionMessage, setDecryptionMessage] = useState('');
  const [decryptedDownloadUrl, setDecryptedDownloadUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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
      console.log('Upload response:', response.data);
      setMessage('File encrypted and uploaded successfully');
      setDownloadUrl(`http://localhost:5000${response.data.downloadUrl}`);
      setIv(response.data.iv);
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      setMessage(`Error uploading file: ${error.response ? error.response.data : error.message}`);
    }
  };

  const handleDownload = () => {
    window.location.href = downloadUrl;
  };

  const handleDecrypt = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/decrypt', {
        filePath: downloadUrl.replace('http://localhost:5000', ''),
        iv: iv,
      });
      console.log('Decryption response:', response.data);
      setDecryptionMessage('File decrypted successfully');
      setDecryptedDownloadUrl(`http://localhost:5000${response.data.downloadUrl}`);
    } catch (error) {
      console.error('Error decrypting file:', error.response ? error.response.data : error.message);
      setDecryptionMessage(`Error decrypting file: ${error.response ? error.response.data : error.message}`);
    }
  };

  const handleDecryptedDownload = () => {
    window.location.href = decryptedDownloadUrl;
  };

  return (
    <div className="App">
      <h1>File Encryption Tool</h1>

      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload and Encrypt</button>
      </form>
      {message && <p>{message}</p>}
      
      {downloadUrl && (
        <div>
          <button onClick={handleDownload}>Download Encrypted File</button>
          <p><strong>IV:</strong> {iv}</p>
        </div>
      )}

      {downloadUrl && (
        <form onSubmit={handleDecrypt}>
          <button type="submit">Decrypt File</button>
        </form>
      )}
      {decryptionMessage && <p>{decryptionMessage}</p>}
      {decryptedDownloadUrl && (
        <button onClick={handleDecryptedDownload}>Download Decrypted File</button>
      )}
    </div>
  );
}

export default App;