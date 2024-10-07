import React, { useState } from 'react';
import axios from 'axios';

const FileEncryptionApp = () => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [encryptedDownloadUrl, setEncryptedDownloadUrl] = useState('');
  const [iv, setIv] = useState('');
  const [decryptionMessage, setDecryptionMessage] = useState('');
  const [decryptedDownloadUrl, setDecryptedDownloadUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadMessage('File encrypted successfully!');
      setEncryptedDownloadUrl(`http://localhost:5000${response.data.downloadUrl}`);
      setIv(response.data.iv);
    } catch (error) {
      setUploadMessage('Error encrypting file.');
    }
  };

  const handleDownloadEncryptedFile = () => {
    if (encryptedDownloadUrl) {
      window.location.href = encryptedDownloadUrl;
    }
  };

  const handleDecrypt = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/decrypt', {
        filePath: encryptedDownloadUrl.replace('http://localhost:5000', ''),
        iv: iv,
      });

      setDecryptionMessage('File decrypted successfully!');
      setDecryptedDownloadUrl(`http://localhost:5000${response.data.downloadUrl}`);
    } catch (error) {
      setDecryptionMessage('Error decrypting file.');
    }
  };

  const handleDownloadDecryptedFile = () => {
    if (decryptedDownloadUrl) {
      window.location.href = decryptedDownloadUrl;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>File Encryption Tool</h1>
      <form onSubmit={handleUpload} style={styles.form}>
        <label style={styles.label}>Select a file to encrypt:</label>
        <input type="file" onChange={handleFileChange} style={styles.input} />
        <button type="submit" style={styles.button}>Encrypt & Upload</button>
      </form>
      {uploadMessage && <p style={styles.message}>{uploadMessage}</p>}
      {encryptedDownloadUrl && (
        <button onClick={handleDownloadEncryptedFile} style={styles.downloadBtn}>Download Encrypted File</button>
      )}
      {encryptedDownloadUrl && (
        <form onSubmit={handleDecrypt} style={styles.form}>
          <button type="submit" style={styles.button}>Decrypt File</button>
        </form>
      )}
      {decryptionMessage && <p style={styles.message}>{decryptionMessage}</p>}
      {decryptedDownloadUrl && (
        <button onClick={handleDownloadDecryptedFile} style={styles.downloadBtn}>Download Decrypted File</button>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f4f4f9',
    padding: '20px',
    borderRadius: '10px',
    width: '500px',
    margin: 'auto',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  label: {
    marginBottom: '10px',
  },
  input: {
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  downloadBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    color: 'green',
  },
};

export default FileEncryptionApp;
