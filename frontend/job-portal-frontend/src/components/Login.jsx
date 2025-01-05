import React, { useState } from 'react';
import './Login.css'; 
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async() => {
    console.log("Attempting to login with",{username,password})

    try{
      const response = await axiosInstance.post('/login/',{username,password}, {
        headers: {
          'Content-Type': 'application/json',  
        },
      })
      localStorage.setItem('authToken',response.data.token)
      window.location.href='/dashboard';
    }catch(err){
      console.error(err)
      if (err.response){
        console.error("Error Response Data:",err.response.data)
      }
      setError('Invalid credentials.Please try again.')
    }
    
  };


  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={(e)=>{e.preventDefault(); handleLogin();} }>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <p>Don't have an accound? <Link to="/register"><span>Sign Up</span></Link></p>
          <button type="submit" className="login-button" >Login</button>
        </form>
        {error && <p style={{color:'red'}}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
