import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Cancel from './pages/Cancel';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Success from './pages/Success';

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/success" element={<Success/>} />
              <Route path="/cancel" element={<Cancel/>} />
              <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
