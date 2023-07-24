import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login({ setUserRole }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Por favor ingrese su usuario');
      return;
    }

    if (!password.trim()) {
      setError('Por favor ingrese su clave');
      return;
    }

    try {
      const response = await axios.get(
        `http://20.163.192.189:8080/api/login?user_username=${username}&user_password=${password}&mod_name=Inventario`,
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwODA0MzIxMzcwIiwiZXhwIjoxNjk0OTg1NDgyfQ.GljEqO4wDKT_x94OIQ76k2AraJUY4YKAwBFrfs-ZsMQ',
          },
        }
      );

      const data = response.data;

      // Si el usuario es válido y las credenciales son correctas
      if (data && data.user && data.user.usr_user === username) {
        setError('');
        setUserRole("Usuario: "+data.user.usr_first_name +" "+ data.user.usr_first_lastname, data.user.usr_user); // Establecemos el rol del usuario basado en su nombre de usuario
        navigate("/");
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al autenticar al usuario:', error);
      setError('Hubo un error al autenticar al usuario. Por favor, inténtelo de nuevo más tarde.');
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
