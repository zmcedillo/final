import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import api from '../services/api';



const BACKEND_URL = 'http://localhost:3000';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await api.login(username, password);

      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('userRole', response.role);

      navigate('/home');
    } catch (error) {
      alert(error.message || 'Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <form autoComplete="off" className="form" onSubmit={handleSubmit}>
      <div className="control">
        <h1>Login</h1>
      </div>
      <button onClick={handleGoogleLogin} className="google-login-button">
        Registrate con Google
      </button>
      <div className="control block-cube block-input">
        <input
          type="text"
          id="username"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="bg-top">
          <div className="bg-inner"></div>
        </div>
        <div className="bg-right">
          <div className="bg-inner"></div>
        </div>
        <div className="bg">
          <div className="bg-inner"></div>
        </div>
      </div>
      <div className="control block-cube block-input">
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="bg-top">
          <div className="bg-inner"></div>
        </div>
        <div className="bg-right">
          <div className="bg-inner"></div>
        </div>
        <div className="bg">
          <div className="bg-inner"></div>
        </div>
      </div>
      <Button type="submit" text="Login"/>
      <p> </p>
      <Button type="button" text="Registrarse" onClick={() => navigate('/register')}/>
      <div className="credits">
        <a href="" target="_blank">
          © todos los derechos menos 2 reservados
        </a>
      </div>
    </form>
  );
}

export default LoginPage;
