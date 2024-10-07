import React, { useState } from 'react';
import axios from 'axios';

const FileEncryptionApp = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [mode, setMode] = useState('encrypt'); // 'encrypt' or 'decrypt'

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEncrypt = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/encrypt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('File encrypted successfully!');
      setDownloadUrl(`http://localhost:5000${response.data.downloadUrl}`);
      setKey(response.data.key);
      setIv(response.data.iv);
    } catch (error) {
      setMessage('Error encrypting file.');
    }
  };

  const handleDecrypt = async (e) => {
    e.preventDefault();
    if (!file || !key || !iv) {
      setMessage('Please provide a file, key, and IV.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    formData.append('iv', iv);

    try {
      const response = await axios.post('http://localhost:5000/decrypt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('File decrypted successfully!');
      setDownloadUrl(`http://localhost:5000${response.data.downloadUrl}`);
    } catch (error) {
      setMessage('Error decrypting file.');
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>File Encryption/Decryption Tool</h1>
      <div style={styles.modeSelector}>
        <button 
          style={mode === 'encrypt' ? styles.activeMode : styles.inactiveMode} 
          onClick={() => setMode('encrypt')}
        >
          Encrypt
        </button>
        <button 
          style={mode === 'decrypt' ? styles.activeMode : styles.inactiveMode} 
          onClick={() => setMode('decrypt')}
        >
          Decrypt
        </button>
      </div>
      <form onSubmit={mode === 'encrypt' ? handleEncrypt : handleDecrypt} style={styles.form}>
        <label style={styles.label}>Select a file:</label>
        <input type="file" onChange={handleFileChange} style={styles.input} />
        {mode === 'decrypt' && (
          <>
            <label style={styles.label}>Key:</label>
            <input type="text" value={key} onChange={(e) => setKey(e.target.value)} style={styles.input} />
            <label style={styles.label}>IV:</label>
            <input type="text" value={iv} onChange={(e) => setIv(e.target.value)} style={styles.input} />
          </>
        )}
        <button type="submit" style={styles.button}>
          {mode === 'encrypt' ? 'Encrypt & Upload' : 'Decrypt & Download'}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      {downloadUrl && (
        <button onClick={handleDownload} style={styles.downloadBtn}>Download File</button>
      )}
      {mode === 'encrypt' && key && (
        <div style={styles.keyInfo}>
          <p>Key: {key}</p>
          <p>IV: {iv}</p>
          <p style={styles.warning}>Save these for decryption!</p>
        </div>
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
  modeSelector: {
    display: 'flex',
    marginBottom: '20px',
  },
  activeMode: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  inactiveMode: {
    padding: '10px 20px',
    backgroundColor: '#ddd',
    color: '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
    width: '100%',
  },
  label: {
    marginBottom: '5px',
  },
  input: {
    marginBottom: '15px',
    padding: '5px',
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
    marginBottom: '10px',
  },
  keyInfo: {
    marginTop: '20px',
    textAlign: 'center',
  },
  warning: {
    color: 'red',
    fontWeight: 'bold',
  },
};

export default FileEncryptionApp;