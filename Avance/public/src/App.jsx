import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/home" element={<HomePage />} /> {/* Nueva ruta */}
              <Route path="/" element={<Navigate to="/login" />} /> {/* Nueva ruta */}
          </Routes>
      </BrowserRouter>
  );
}

export default App;
