import { useState } from 'react';
import './App.css';

export default function Home() {
  const [form, setForm] = useState({
    originalUrl: '',
    email: '',
    name: '',
    mobileNo: '',
    githubUsername: '',
    rollNo: '',
    accessCode: '',
    clientId: '',
    clientSecret: ''
  });

  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    try {
      const res = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to shorten URL');
        return;
      }

      const data = await res.json();
      setShortUrl(`http://localhost:3000/${data.shortCode}`);
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">🌐 URL Shortener</h1>
      <form className="form" onSubmit={handleSubmit}>
        {[
          { name: 'originalUrl', placeholder: 'Long URL', type: 'text' },
          { name: 'email', placeholder: 'Email', type: 'email' },
          { name: 'name', placeholder: 'Name', type: 'text' },
          { name: 'mobileNo', placeholder: 'Mobile Number', type: 'text' },
          { name: 'githubUsername', placeholder: 'GitHub Username', type: 'text' },
          { name: 'rollNo', placeholder: 'Roll Number', type: 'text' },
          { name: 'accessCode', placeholder: 'Access Code', type: 'text' },
          { name: 'clientId', placeholder: 'Client ID', type: 'text' },
          { name: 'clientSecret', placeholder: 'Client Secret', type: 'text' }
        ].map((field) => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit">Shorten URL</button>
      </form>
      {shortUrl && (
        <p className="success">
          Short URL: <a href={shortUrl}>{shortUrl}</a>
        </p>
      )}
      {error && <p className="error">Error: {error}</p>}
    </div>
  );
}


