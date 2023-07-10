import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Porfavor ingrese su email');
      return;
    }

    if (!password.trim()) {
      setError('Porfavor ingrese su clave');
      return;
    }

    if (email === 'usuario1@example.com' && password === 'password1') {
      // Autenticación exitosa, redirigir a la página principal
      setError('');
      window.location.href = '/pagina-principal';
    } else if (email === 'usuario2@example.com' && password === 'password2') {
      // Autenticación exitosa, redirigir a la página principal
      setError('');
      window.location.href = '/pagina-principal';
    } else if (email === 'usuario3@example.com' && password === 'password3') {
      // Autenticación exitosa, redirigir a la página principal
      setError('');
      window.location.href = '/pagina-principal';
    } else {
      // Autenticación fallida, mostrar mensaje de error
      setError('Credenciales incorrectas');
    }
  };

  const formContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f3f3f3',
  };

  const titleStyles = {
    fontSize: '2rem',
    marginBottom: '1rem',
  };

  const inputStyles = {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '1rem',
  };

  const labelStyles = {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  };

  const errorStyles = {
    color: 'red',
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
  };

  const buttonStyles = {
    width: '100%',
    backgroundColor: '#1a237e',
    color: 'white',
    padding: '0.5rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={formContainerStyles}>
      <div style={formStyles}>
        <h2 style={titleStyles}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={labelStyles}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              style={inputStyles}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={labelStyles}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              style={inputStyles}
            />
          </div>
          {error && <div style={errorStyles}>{error}</div>}
          <button type="submit" style={buttonStyles}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;





















