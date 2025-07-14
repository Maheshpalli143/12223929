import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

export default function RedirectPage() {
  const { shortCode } = useParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/lookup/${shortCode}`);

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Unknown error');
          setStatus('error');
          return;
        }

        const data = await res.json();
        window.location.href = data.originalUrl;

      } catch (err) {
        setError('Network error');
        setStatus('error');
      }
    };

    fetchUrl();
  }, [shortCode]);

  if (status === 'loading') {
    return (
      <div className="container">
        <p>Redirecting...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return null;
}

