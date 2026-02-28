import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import api from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !role) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await api.register(username, password, role);

      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      alert('Usuario registrado exitosamente');
      navigate('/login');
    } catch (error) {
      alert(error.message || 'Error al registrar el usuario. Inténtalo de nuevo.');
    }
  };

  return (
    <form autoComplete="off" className="form" onSubmit={handleSubmit}>
      <div className="control">
        <h1>Registre un nuevo usuario</h1>
      </div>
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
      <div className="control block-cube block-input">
        <input
          type="text"
          id="role"
          placeholder="role: user o admin"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
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
      <Button type="submit" text="Registrar"/>
      <div className="credits">
        <a href="" target="_blank">
          © todos los derechos menos 2 reservados
        </a>
      </div>
    </form>
  );
}

export default RegisterPage;
