import React, { useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import { useNavigate } from 'react-router-dom';
import BackgroundImage from './greenCyclelogo.png'

const AuthPage = ({ onLogin }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [acceptedMaterials, setAcceptedMaterials] = useState('');
    const [pricing, setPricing] = useState('');
    const [operationalHours, setOperationalHours] = useState('');

    const navigate = useNavigate();
  
    const handleLogin = async () => {
      try {
        const phoneNumber = `+91-${phone}`;
        const response = await axios.post('https://recycle-backend-apao.onrender.com/api/buyerLogin', { phoneNumber });
        const { token, scrapBuyerId } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('scrapBuyerId', scrapBuyerId);
        console.log('token..,scrapBuyerId',`${token}-${scrapBuyerId}`)
        alert('Login successful!');
        // Redirect or perform other actions after login
        onLogin(); // Trigger the login state in App.js
        navigate('/ScrapBuyerDashboard'); // Navigate to the location-picker route
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Invalid phone number');
      }
    };
  
    const handleSignup = async () => {
      try {
        const response = await axios.post('https://recycle-backend-apao.onrender.com/api/buyerSignup', {
          name,
          phone,
          businessName,
          acceptedMaterials: acceptedMaterials.split(','),
          pricing: pricing.split(',').map(p => {
            const [materialType, pricePerKg] = p.split(':');
            return { materialType, pricePerKg: parseFloat(pricePerKg) };
          }),
          operationalHours,
        });
  
        if (response.status === 201) {
          alert('Signup successful! Please log in.');
          setIsSignup(false);
        }
      } catch (error) {
        console.error('Error signing up:', error);
        alert('Signup failed');
      }
    };
  
    const styles = {
      page: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#d6a4e4',
        fontFamily: 'Arial, sans-serif',
      },
      container: {
        textAlign: 'center',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      inputGroup: {
        marginBottom: '15px',
        textAlign: 'left',
      },
      label: {
        display: 'block',
        color: '#000',
        marginBottom: '5px',
        fontSize: '1rem',
      },
      input: {
        width: 'calc(100% - 22px)',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '1rem',
      },
      button: {
        width: '100%',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#92e792',
        color: '#000',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '10px',
      },
      links: {
        marginTop: '20px',
      },
      link: {
        color: '#007bff',
        textDecoration: 'none',
        fontSize: '0.9rem',
        cursor: 'pointer',
      },
    };
  
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          {!isSignup ? (
            <>
              <h2>Login</h2>
              <div style={styles.inputGroup}>
                <label htmlFor="phone" style={styles.label}>Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  style={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button style={styles.button} onClick={handleLogin}>Log In</button>
              <div style={styles.links}>
                <span style={styles.link} onClick={() => setIsSignup(true)}>Register</span>
              </div>
            </>
          ) : (
            <>
              <h2>Signup</h2>
              <div style={styles.inputGroup}>
                <label htmlFor="name" style={styles.label}>Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  style={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="phone" style={styles.label}>Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  style={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="businessName" style={styles.label}>Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  style={styles.input}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="acceptedMaterials" style={styles.label}>Accepted Materials (comma separated)</label>
                <input
                  type="text"
                  id="acceptedMaterials"
                  name="acceptedMaterials"
                  style={styles.input}
                  value={acceptedMaterials}
                  onChange={(e) => setAcceptedMaterials(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="pricing" style={styles.label}>Pricing (format: materialType:pricePerKg, separated by commas)</label>
                <input
                  type="text"
                  id="pricing"
                  name="pricing"
                  style={styles.input}
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="operationalHours" style={styles.label}>Operational Hours</label>
                <input
                  type="text"
                  id="operationalHours"
                  name="operationalHours"
                  style={styles.input}
                  value={operationalHours}
                  onChange={(e) => setOperationalHours(e.target.value)}
                />
              </div>
              <button style={styles.button} onClick={handleSignup}>Sign Up</button>
              <div style={styles.links}>
                <span style={styles.link} onClick={() => setIsSignup(false)}>Back to Login</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default AuthPage;
