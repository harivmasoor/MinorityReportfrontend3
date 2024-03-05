'use client';
import { useState, useEffect } from 'react';

export default function PreviewPage() {
  const [tokensRemaining, setTokensRemaining] = useState(null);
  const [fetchError, setFetchError] = useState(''); // State for fetch errors
  const [updateError, setUpdateError] = useState(''); // State for update errors

  const fetchTokensRemaining = () => {
    fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.token_remaining !== undefined) {
        setTokensRemaining(data.token_remaining);
        setFetchError(''); // Reset fetch error on successful fetch
      } else {
        console.error('Failed to fetch tokens remaining');
        setFetchError('Failed to fetch tokens remaining');
      }
    })
    .catch(error => {
      console.error('Error fetching tokens remaining:', error);
      setFetchError(`Error fetching tokens remaining: ${error.message}`);
    });
  };

  useEffect(() => {
    fetchTokensRemaining();

    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }
    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  const updateUser = () => {
    fetch('/api/users', {
      method: 'PUT',
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      fetchTokensRemaining();
      setUpdateError(''); // Reset update error on successful update
    })
    .catch(error => {
      console.error('Error updating user:', error);
      setUpdateError(`Error updating user: ${error.message}`);
    });
  };

  return (
    <div>
      {/* <button role="link" onClick={updateUser}>Subtract Token</button> */}
      <p>Tokens remaining: {tokensRemaining}</p>
      {fetchError && <p className="error">Fetch Error: {fetchError}</p>}
      {updateError && <p className="error">Update Error: {updateError}</p>}
      <form action="/api/checkout_sessions" method="POST">
        <section>
          <p>Please ensure you enter your Gmail address exactly as registered, including any dots. Or the stripe payment will not associate the tokens with your account.</p>
          <button type="submit" role="link">Checkout</button>
        </section>
        <style jsx>{`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            width: 400px;
            height: 112px;
            border-radius: 6px;
            justify-content: space-between;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
          .error {
            color: red;
          }
        `}</style>
      </form>
    </div>
  );
}








