import React, { useState } from 'react';
import './Register.css'; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/register/',formData);
      setSuccess('Registration successful! Please login')
      window.location.href='/';
    } catch (error) {
      console.log(error)
      setError('Registration Failed. Please try again.')
    }

  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="register-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="register-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="register-input"
          />
          <p>Already have an accound? <Link to="/"><span>Log In</span></Link></p>
          <button type="submit" className="register-button">Register</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    </div>
  );
};

export default Register;
