import React, { useState } from 'react';

function Login({ setUserRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Por favor ingrese su usuario');
      return;
    }

    if (!password.trim()) {
      setError('Por favor ingrese su clave');
      return;
    }

    // Aquí definimos la lista de usuarios con sus credenciales
    const users = [
      { username: 'administrador', password: 'admin123', role: 'administrador' },
      { username: 'bodeguero', password: 'bodeguero123', role: 'bodeguero' },
      { username: 'auditor', password: 'auditor123', role: 'auditor' },
    ];

    // Validamos si el usuario existe y las credenciales coinciden
    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
      // Autenticación exitosa, redirigir al usuario según su rol
      setError('');
      setUserRole(user.role); // Establecemos el rol del usuario
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
            <label htmlFor="username" style={labelStyles}>
              Usuario: 
            </label>
            <input
              type="text" 
              id="username" 
              value={username}
              onChange={handleUsernameChange} 
              placeholder="Enter your username" 
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























