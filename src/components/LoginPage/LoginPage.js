import React, { useState } from 'react';
import './LoginPageStyles.scss';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic here
    console.log('Login attempted with:', { username, password });
  };

  return (
    <div className='login-page'>
      <h1 className='login-page-title'>Login Page</h1>
      <form className='login-page-form' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={handleUsernameChange}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={handlePasswordChange}
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
